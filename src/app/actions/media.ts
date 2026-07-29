'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from '@/lib/types';

export interface ImageSeoItem {
  id: string;
  url: string;
  alt_text: string;
  caption?: string;
  in_sitemap: boolean;
  updated_at?: string;
}

const STATIC_IMAGE_REGISTRY: ImageSeoItem[] = [
  {
    id: 'hero-building',
    url: '/images/bangalore_hero_building.png',
    alt_text: 'One Studio Turnkey Interior Design Site in HBR Layout Bangalore',
    in_sitemap: true,
  },
  {
    id: 'architect-planning',
    url: '/images/bangalore_architect_planning.png',
    alt_text: 'Structural engineers and architects reviewing BBMP blueprints in HBR Layout',
    in_sitemap: true,
  },
  {
    id: 'modern-interior',
    url: '/images/bangalore_modern_interior.png',
    alt_text: 'Luxury modular kitchen and living room interior design by One Studio',
    in_sitemap: true,
  },
  {
    id: 'commercial-complex',
    url: '/images/bangalore_commercial_complex.png',
    alt_text: 'Commercial office building construction in Whitefield Bangalore',
    in_sitemap: true,
  },
];

export async function listImageSeo(): Promise<ActionResult<ImageSeoItem[]>> {
  try {
    const sb = createClient();
    const { data: dbImages } = await sb.from('image_seo').select('*');

    if (!dbImages || dbImages.length === 0) {
      return { ok: true, data: STATIC_IMAGE_REGISTRY };
    }

    return { ok: true, data: dbImages };
  } catch (err: any) {
    return { ok: true, data: STATIC_IMAGE_REGISTRY };
  }
}

export async function updateImageAlt(id: string, altText: string): Promise<ActionResult<boolean>> {
  try {
    const sb = createClient();
    const { error } = await sb.from('image_seo').upsert({
      id,
      alt_text: altText,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/admin/dashboard/media');
    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to update image ALT text' };
  }
}
