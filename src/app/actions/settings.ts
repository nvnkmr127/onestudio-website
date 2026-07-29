'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import type { ActionResult, SeoSettings } from '@/lib/types';

// Zod validation schema for Global SEO Settings
const settingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required'),
  site_url: z.string().url('Invalid site URL'),
  default_title_template: z.string().min(1, 'Title template is required'),
  default_meta_desc: z.string().min(1, 'Default meta description is required'),
  default_og_image: z.string().min(1, 'Default OG image URL is required'),
  business_name: z.string().min(1, 'Business name is required'),
  street_address: z.string().min(1, 'Street address is required'),
  locality: z.string().min(1, 'Locality is required'),
  region: z.string().min(1, 'Region is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().default('IN'),
  phone: z.string().min(1, 'Phone is required'),
  whatsapp: z.string().min(1, 'WhatsApp is required'),
  email: z.string().email('Invalid email address'),
  geo_lat: z.coerce.number(),
  geo_lng: z.coerce.number(),
  opening_hours: z
    .array(
      z.object({
        day: z.string(),
        opens: z.string(),
        closes: z.string(),
      })
    )
    .default([]),
  social_profiles: z
    .object({
      instagram: z.string().optional().or(z.literal('')),
      facebook: z.string().optional().or(z.literal('')),
      youtube: z.string().optional().or(z.literal('')),
      pinterest: z.string().optional().or(z.literal('')),
      linkedin: z.string().optional().or(z.literal('')),
    })
    .default({}),
  gsc_verification: z.string().nullable().optional(),
  bing_verification: z.string().nullable().optional(),
  brand_stats: z
    .object({
      quality_checks: z.coerce.number().default(415),
      warranty_structural: z.string().default('10-15 years'),
      warranty_workmanship: z.string().default('1 year'),
      delays: z.string().default('zero'),
    })
    .default({
      quality_checks: 415,
      warranty_structural: '10-15 years',
      warranty_workmanship: '1 year',
      delays: 'zero',
    }),
});

export async function getSettings(): Promise<ActionResult<SeoSettings>> {
  try {
    const sb = createClient();
    const { data, error } = await sb.from('seo_settings').select('*').eq('id', 1).maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data) {
      // Return defaults if row does not exist yet
      return {
        ok: true,
        data: {
          id: 1,
          site_name: 'One Studio',
          site_url: 'https://www.onestudio.in',
          default_title_template: '%s | One Studio',
          default_meta_desc:
            'Bespoke interior design & luxury home execution in HBR Layout, Bengaluru. Transparent pricing, 150+ quality checks & 10-year warranty.',
          default_og_image: 'https://www.onestudio.in/og-default.jpg',
          business_name: 'One Studio',
          street_address: '38th Cross Rd, 1751, 15th Main Rd, 5th Block, 1st Stage, Telecom Layout',
          locality: 'HBR Layout',
          region: 'Bengaluru, Karnataka',
          postal_code: '560043',
          country: 'IN',
          phone: '+91 90143 03409',
          email: 'reachus@onestudio.in',
          whatsapp: '+91 90143 03409',
          geo_lat: 13.0247,
          geo_lng: 77.6288,
          opening_hours: [{ day: 'Monday-Saturday', opens: '09:00', closes: '19:00' }],
          social_profiles: {},
          gsc_verification: null,
          bing_verification: null,
          brand_stats: {
            quality_checks: 415,
            warranty_structural: '10-15 years',
            warranty_workmanship: '1 year',
            delays: 'zero',
          },
        },
      };
    }

    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to fetch SEO settings' };
  }
}

export async function updateSettings(input: unknown): Promise<ActionResult<SeoSettings & { warning?: string }>> {
  try {
    const parseResult = settingsSchema.safeParse(input);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { ok: false, error: errorMsg };
    }

    const validated = parseResult.data;
    let warning: string | undefined;

    if (!validated.default_title_template.includes('%s')) {
      warning = 'Title template is missing "%s" placeholder. %s will not be dynamically replaced.';
    }

    // Clean social profiles and opening hours if empty
    const cleanSocials: Record<string, string> = {};
    if (validated.social_profiles) {
      Object.entries(validated.social_profiles).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          cleanSocials[key] = value.trim();
        }
      });
    }

    const cleanHours = validated.opening_hours.filter(
      (h) => h.day.trim() !== '' && (h.opens.trim() !== '' || h.closes.trim() !== '')
    );

    const payload = {
      id: 1,
      ...validated,
      social_profiles: cleanSocials,
      opening_hours: cleanHours,
    };

    const sb = createClient();
    const { data, error } = await sb.from('seo_settings').upsert(payload);

    if (error) {
      return { ok: false, error: error.message };
    }

    // Regenerate global JSON-LD schemas with new NAP values
    try {
      const { syncGlobalSchemasFromSettings } = await import('@/app/actions/schema');
      await syncGlobalSchemasFromSettings();
    } catch {
      // Ignore schema sync failure
    }

    revalidatePath('/', 'layout');

    return {
      ok: true,
      data: {
        ...(data || payload),
        warning,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to update SEO settings' };
  }
}
