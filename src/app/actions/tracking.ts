'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ActionResult, TrackingConfig } from '@/lib/types';

const trackingSchema = z.object({
  ga4_id: z.string().nullable().optional(),
  gtm_id: z.string().nullable().optional(),
  meta_pixel_id: z.string().nullable().optional(),
  meta_capi_token: z.string().nullable().optional(),
  consent_default: z.string().default('denied'),
  custom_head_scripts: z.string().nullable().optional(),
});

export type PublicTrackingConfig = Omit<TrackingConfig, 'meta_capi_token'>;

export async function getPublicTrackingConfig(): Promise<ActionResult<PublicTrackingConfig>> {
  try {
    const sb = createClient();
    const { data, error } = await sb.from('tracking_config').select('id, ga4_id, gtm_id, meta_pixel_id, consent_default, custom_head_scripts').eq('id', 1).maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }

    const defaultPublic: PublicTrackingConfig = {
      id: 1,
      ga4_id: null,
      gtm_id: null,
      meta_pixel_id: null,
      consent_default: 'denied',
      custom_head_scripts: null,
    };

    return { ok: true, data: data || defaultPublic };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to fetch public tracking config' };
  }
}

export async function getTrackingConfigAdmin(): Promise<ActionResult<TrackingConfig>> {
  try {
    const sb = createClient();
    const { data, error } = await sb.from('tracking_config').select('*').eq('id', 1).maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }

    const defaultConfig: TrackingConfig = {
      id: 1,
      ga4_id: null,
      gtm_id: null,
      meta_pixel_id: null,
      meta_capi_token: null,
      consent_default: 'denied',
      custom_head_scripts: null,
    };

    return { ok: true, data: data || defaultConfig };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to fetch tracking config' };
  }
}

export async function updateTrackingConfig(input: unknown): Promise<ActionResult<TrackingConfig>> {
  try {
    const parseResult = trackingSchema.safeParse(input);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { ok: false, error: errorMsg };
    }

    const validated = parseResult.data;
    const payload = {
      id: 1,
      ...validated,
    };

    const sb = createClient();
    const { data, error } = await sb.from('tracking_config').upsert(payload);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return { ok: true, data: data || payload };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to update tracking config' };
  }
}

async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sendMetaCapiLeadEvent(leadData: {
  name?: string;
  phone?: string;
  email?: string;
  sourcePage?: string;
}): Promise<ActionResult<boolean>> {
  try {
    const sb = createClient();
    const { data: config } = await sb.from('tracking_config').select('meta_pixel_id, meta_capi_token').eq('id', 1).maybeSingle();

    if (!config || !config.meta_pixel_id || !config.meta_capi_token) {
      return { ok: true, data: false }; // CAPI not configured, soft return
    }

    const hashedPhone = leadData.phone ? await sha256Hex(leadData.phone.replace(/\D/g, '')) : undefined;
    const hashedEmail = leadData.email ? await sha256Hex(leadData.email) : undefined;
    const hashedName = leadData.name ? await sha256Hex(leadData.name) : undefined;

    const eventPayload = {
      data: [
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          user_data: {
            ph: hashedPhone ? [hashedPhone] : undefined,
            em: hashedEmail ? [hashedEmail] : undefined,
            fn: hashedName ? [hashedName] : undefined,
          },
          custom_data: {
            source_page: leadData.sourcePage || 'Website',
          },
        },
      ],
    };

    const url = `https://graph.facebook.com/v19.0/${config.meta_pixel_id}/events?access_token=${config.meta_capi_token}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `Meta CAPI error: ${errText}` };
    }

    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'CAPI execution error' };
  }
}
