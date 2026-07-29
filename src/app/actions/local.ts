'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ActionResult } from '@/lib/types';
import { runNapDriftCheck, NapAuditReport } from '@/lib/seo/nap-check';
import { staticLocalSeoPages, LocalSeoPageConfig } from '@/lib/localSeoData';

export interface GeoPageItem extends LocalSeoPageConfig {
  slug: string;
  is_served: boolean;
  map_url?: string;
}

const geoPageSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  image: z.string().optional(),
  content: z.array(z.string()).min(1, 'At least one content paragraph is required'),
  features: z.array(z.string()).min(1, 'At least one feature point is required'),
  is_served: z.boolean().refine((val) => val === true, {
    message: 'HARD GUARDRAIL: Cannot publish geo page for unserved area. "is_served" must be checked.',
  }),
  map_url: z.string().optional(),
});

export async function listGeoPages(): Promise<ActionResult<GeoPageItem[]>> {
  try {
    const sb = createClient();
    const { data: dbMetas } = await sb.from('seo_meta').select('*');

    const result: GeoPageItem[] = [];

    // Merge static pages
    Object.entries(staticLocalSeoPages).forEach(([slug, cfg]) => {
      result.push({
        slug,
        ...cfg,
        is_served: true,
        map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.054593922378!2d77.6288!3d13.0247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae172a39bb871f%3A0x6b4f7e27cf5c3639!2sScrew%20Wood!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      });
    });

    return { ok: true, data: result };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to list geo pages' };
  }
}

export async function saveGeoPage(input: unknown): Promise<ActionResult<GeoPageItem>> {
  try {
    const parseResult = geoPageSchema.safeParse(input);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { ok: false, error: errorMsg };
    }

    const validated = parseResult.data;
    const sb = createClient();

    // Upsert into seo_meta table for per-page SEO metadata
    const metaPayload = {
      path: `/${validated.slug}`,
      title: validated.title,
      meta_desc: validated.description,
      canonical_url: `https://www.onestudio.in/${validated.slug}`,
      index: true,
      follow: true,
      updated_at: new Date().toISOString(),
    };

    await sb.from('seo_meta').upsert(metaPayload);

    revalidatePath(`/${validated.slug}`);
    revalidatePath('/');

    return { ok: true, data: validated };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to save geo page' };
  }
}

export async function auditNapDrift(): Promise<ActionResult<NapAuditReport>> {
  try {
    const report = await runNapDriftCheck();
    return { ok: true, data: report };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to run NAP audit' };
  }
}
