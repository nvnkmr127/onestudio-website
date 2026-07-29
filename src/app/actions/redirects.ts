'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ActionResult, Redirect } from '@/lib/types';
import { clearRedirectsCache, detectRedirectChainOrLoop } from '@/lib/seo/redirects';

const redirectSchema = z.object({
  source: z.string().min(1, 'Source URL path is required'),
  destination: z.string().min(1, 'Destination URL path is required'),
  status_code: z.coerce.number().refine((val) => val === 301 || val === 302, {
    message: 'Status code must be 301 or 302',
  }),
  is_regex: z.boolean().default(false),
  active: z.boolean().default(true),
});

export async function listRedirects(): Promise<ActionResult<Redirect[]>> {
  try {
    const sb = createClient();
    const { data, error } = await sb.from('redirects').select('*').order('created_at', { ascending: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data || [] };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to list redirects' };
  }
}

export async function addRedirect(input: unknown): Promise<ActionResult<Redirect>> {
  try {
    const parseResult = redirectSchema.safeParse(input);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { ok: false, error: errorMsg };
    }

    const { source, destination, status_code, is_regex, active } = parseResult.data;
    const sb = createClient();

    // Fetch existing active redirects for loop & chain detection
    const { data: existing } = await sb.from('redirects').select('*').eq('active', true);
    const existingList = (existing as Redirect[]) || [];

    // Chain & Loop Validation
    if (active) {
      const validation = detectRedirectChainOrLoop(source, destination, existingList);
      if (!validation.isValid) {
        return { ok: false, error: validation.error };
      }
    }

    const newRecord = {
      source: source.trim(),
      destination: destination.trim(),
      status_code,
      is_regex,
      active,
      hits: 0,
    };

    const { data, error } = await sb.from('redirects').insert(newRecord);

    if (error) {
      return { ok: false, error: error.message };
    }

    clearRedirectsCache();
    revalidatePath('/', 'layout');

    const createdRow = Array.isArray(data) ? data[0] : data || newRecord;
    return { ok: true, data: createdRow };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to add redirect' };
  }
}

export async function toggleRedirectActive(id: string, active: boolean): Promise<ActionResult<boolean>> {
  try {
    const sb = createClient();

    if (active) {
      // Validate no loop/chain when enabling
      const { data: rTarget } = await sb.from('redirects').select('*').eq('id', id).single();
      if (rTarget) {
        const { data: existing } = await sb.from('redirects').select('*').eq('active', true);
        const validation = detectRedirectChainOrLoop(rTarget.source, rTarget.destination, (existing as Redirect[]) || [], id);
        if (!validation.isValid) {
          return { ok: false, error: validation.error };
        }
      }
    }

    const { error } = await sb.from('redirects').eq('id', id).update({ active });

    if (error) {
      return { ok: false, error: error.message };
    }

    clearRedirectsCache();
    revalidatePath('/', 'layout');
    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to update redirect status' };
  }
}

export async function deleteRedirect(id: string): Promise<ActionResult<boolean>> {
  try {
    const sb = createClient();
    const { error } = await sb.from('redirects').eq('id', id).delete();

    if (error) {
      return { ok: false, error: error.message };
    }

    clearRedirectsCache();
    revalidatePath('/', 'layout');
    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to delete redirect' };
  }
}

export async function incrementRedirectHit(id: string): Promise<void> {
  try {
    const sb = createClient();
    const { data: row } = await sb.from('redirects').select('hits').eq('id', id).single();
    if (row) {
      const newHits = (row.hits || 0) + 1;
      await sb.from('redirects').eq('id', id).update({ hits: newHits });
    }
  } catch {
    // Non-blocking hit increment
  }
}

export interface CsvImportResult {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

export async function importRedirectsCsv(csvText: string): Promise<ActionResult<CsvImportResult>> {
  try {
    if (!csvText || !csvText.trim()) {
      return { ok: false, error: 'CSV file content is empty' };
    }

    const sb = createClient();
    const { data: existing } = await sb.from('redirects').select('*').eq('active', true);
    const accumulatedRedirects: Redirect[] = [...((existing as Redirect[]) || [])];

    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) {
      return { ok: false, error: 'CSV file contains no valid rows' };
    }

    let startIndex = 0;
    const firstLineHeader = lines[0].toLowerCase();
    if (firstLineHeader.includes('source') || firstLineHeader.includes('from') || firstLineHeader.includes('origin')) {
      startIndex = 1;
    }

    const toInsert: Omit<Redirect, 'id' | 'created_at'>[] = [];
    const errors: string[] = [];
    let skippedCount = 0;

    for (let i = startIndex; i < lines.length; i++) {
      const lineNum = i + 1;
      const line = lines[i];

      // Parse CSV line (split by comma while respecting quotes)
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((p) => p.replace(/^"|"$/g, '').trim());

      if (parts.length < 2) {
        errors.push(`Line ${lineNum}: Invalid format. Expected at least "source,destination".`);
        skippedCount++;
        continue;
      }

      const source = parts[0];
      const destination = parts[1];
      const statusCodeStr = parts[2];
      const isRegexStr = parts[3];

      if (!source || !destination) {
        errors.push(`Line ${lineNum}: Source and Destination cannot be empty.`);
        skippedCount++;
        continue;
      }

      const statusCode = statusCodeStr === '302' ? 302 : 301;
      const isRegex = isRegexStr === 'true' || isRegexStr === '1';

      // Chain & Loop validation against accumulated redirects
      const validation = detectRedirectChainOrLoop(source, destination, accumulatedRedirects);
      if (!validation.isValid) {
        errors.push(`Line ${lineNum} (${source} -> ${destination}): ${validation.error}`);
        skippedCount++;
        continue;
      }

      const newRedirect = {
        source,
        destination,
        status_code: statusCode,
        is_regex: isRegex,
        hits: 0,
        active: true,
      };

      toInsert.push(newRedirect);
      accumulatedRedirects.push(newRedirect as Redirect);
    }

    if (toInsert.length > 0) {
      const { error } = await sb.from('redirects').insert(toInsert);
      if (error) {
        return { ok: false, error: `Failed to insert redirects into database: ${error.message}` };
      }
    }

    clearRedirectsCache();
    revalidatePath('/', 'layout');

    return {
      ok: true,
      data: {
        importedCount: toInsert.length,
        skippedCount,
        errors,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to import CSV' };
  }
}
