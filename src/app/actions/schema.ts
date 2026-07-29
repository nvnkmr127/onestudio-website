'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ActionResult, SchemaBlock, SeoSettings } from '@/lib/types';
import { buildGlobalSchemas, validateSchemaBlock } from '@/lib/seo/build-schema';

const schemaBlockInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Block name is required'),
  type: z.string().min(1, 'Schema type is required'),
  json_ld: z.any(),
  is_global: z.boolean().default(false),
});

export async function listSchemaBlocks(): Promise<ActionResult<SchemaBlock[]>> {
  try {
    const sb = createClient();
    const { data, error } = await sb.from('schema_blocks').select('*').order('updated_at', { ascending: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data || data.length === 0) {
      // Auto-sync global schemas if DB is empty
      await syncGlobalSchemasFromSettings();
      const { data: synced } = await sb.from('schema_blocks').select('*').order('updated_at', { ascending: false });
      return { ok: true, data: synced || [] };
    }

    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to list schema blocks' };
  }
}

export async function saveSchemaBlock(input: unknown): Promise<ActionResult<SchemaBlock>> {
  try {
    const parseResult = schemaBlockInputSchema.safeParse(input);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { ok: false, error: errorMsg };
    }

    const { id, name, type, json_ld, is_global } = parseResult.data;

    let parsedJson = json_ld;
    if (typeof json_ld === 'string') {
      try {
        parsedJson = JSON.parse(json_ld);
      } catch {
        return { ok: false, error: 'Invalid JSON-LD string format.' };
      }
    }

    // Per-type validation and guardrail check
    const validation = validateSchemaBlock(type, parsedJson);
    if (!validation.isValid) {
      return { ok: false, error: validation.errors.join(' ') };
    }

    const sb = createClient();
    const rowData: SchemaBlock = {
      name,
      type,
      json_ld: parsedJson,
      is_global,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      rowData.id = id;
    }

    const { data, error } = id
      ? await sb.from('schema_blocks').eq('id', id).update(rowData)
      : await sb.from('schema_blocks').insert(rowData);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    const resultRow = Array.isArray(data) ? data[0] : data || rowData;
    return { ok: true, data: resultRow };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to save schema block' };
  }
}

export async function deleteSchemaBlock(id: string): Promise<ActionResult<boolean>> {
  try {
    const sb = createClient();
    const { error } = await sb.from('schema_blocks').eq('id', id).delete();

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to delete schema block' };
  }
}

/**
 * Regenerate and upsert global Organization and GeneralContractor schemas from verified NAP settings.
 */
export async function syncGlobalSchemasFromSettings(): Promise<ActionResult<boolean>> {
  try {
    const sb = createClient();
    const { data: dbSettings } = await sb.from('seo_settings').select('*').eq('id', 1).maybeSingle();

    if (!dbSettings) {
      return { ok: false, error: 'SEO Settings not found in database.' };
    }

    const { organization, localBusiness } = buildGlobalSchemas(dbSettings as SeoSettings);

    const globalBlocks = [
      {
        name: 'Global Organization Schema',
        type: 'Organization',
        json_ld: organization,
        is_global: true,
        updated_at: new Date().toISOString(),
      },
      {
        name: 'Global GeneralContractor / LocalBusiness Schema',
        type: 'GeneralContractor',
        json_ld: localBusiness,
        is_global: true,
        updated_at: new Date().toISOString(),
      },
    ];

    // Delete existing global blocks and re-insert
    await sb.from('schema_blocks').eq('is_global', true).delete();
    for (const block of globalBlocks) {
      await sb.from('schema_blocks').insert(block);
    }

    revalidatePath('/', 'layout');
    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to sync global schemas' };
  }
}
