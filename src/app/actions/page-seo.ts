'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { staticServices } from '@/lib/servicesData';
import { staticLocalSeoPages } from '@/lib/localSeoData';
import type { ActionResult, SeoMeta } from '@/lib/types';

export interface SeoPathOption {
  path: string;
  label: string;
  category: 'core' | 'services' | 'local' | 'blogs' | 'other';
}

const pageSeoSchema = z.object({
  path: z.string().min(1, 'Path is required'),
  title: z.string().nullable().optional(),
  meta_desc: z.string().nullable().optional(),
  canonical_url: z.string().nullable().optional(),
  focus_keyword: z.string().nullable().optional(),
  index: z.boolean().default(true),
  follow: z.boolean().default(true),
  og_title: z.string().nullable().optional(),
  og_desc: z.string().nullable().optional(),
  og_image: z.string().nullable().optional(),
  twitter_card: z.string().default('summary_large_image'),
  schema_ids: z.array(z.string()).default([]),
  priority: z.coerce.number().min(0).max(1).default(0.5),
  changefreq: z.string().default('weekly'),
});

export async function listSeoPaths(): Promise<ActionResult<SeoPathOption[]>> {
  try {
    const paths: SeoPathOption[] = [
      { path: '/', label: 'Homepage (/)', category: 'core' },
      { path: '/services', label: 'Services Overview (/services)', category: 'core' },
      { path: '/contact', label: 'Contact Us (/contact)', category: 'core' },
      { path: '/how-it-works', label: 'How It Works (/how-it-works)', category: 'core' },
      { path: '/projects', label: 'Completed Projects (/projects)', category: 'core' },
      { path: '/news', label: 'Blog & News Hub (/news)', category: 'core' },
      { path: '/estimate', label: 'Interior Estimator (/estimate)', category: 'core' },
    ];

    // Add static services
    Object.keys(staticServices).forEach((slug) => {
      paths.push({
        path: `/services/${slug}`,
        label: `Service: ${staticServices[slug].title}`,
        category: 'services',
      });
    });

    // Add static local SEO pages
    Object.keys(staticLocalSeoPages).forEach((slug) => {
      paths.push({
        path: `/${slug}`,
        label: `Local: ${staticLocalSeoPages[slug].title}`,
        category: 'local',
      });
    });

    // Add blogs from Supabase
    const sb = createClient();
    const { data: blogs } = await sb.from('blogs').select('slug, title');
    if (blogs && Array.isArray(blogs)) {
      blogs.forEach((b: any) => {
        paths.push({
          path: `/news/${b.slug}`,
          label: `Article: ${b.title}`,
          category: 'blogs',
        });
      });
    }

    // Add custom paths from seo_meta not in list
    const { data: dbMetas } = await sb.from('seo_meta').select('path, title');
    if (dbMetas && Array.isArray(dbMetas)) {
      const existingPaths = new Set(paths.map((p) => p.path));
      dbMetas.forEach((m: any) => {
        if (!existingPaths.has(m.path)) {
          paths.push({
            path: m.path,
            label: m.title || m.path,
            category: 'other',
          });
        }
      });
    }

    return { ok: true, data: paths };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to list SEO paths' };
  }
}

export async function getPageSeo(path: string): Promise<ActionResult<SeoMeta | null>> {
  try {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const sb = createClient();
    const { data, error } = await sb.from('seo_meta').select('*').eq('path', normalizedPath).maybeSingle();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data || null };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to fetch page SEO' };
  }
}

export async function savePageSeo(path: string, input: unknown): Promise<ActionResult<SeoMeta>> {
  try {
    const parseResult = pageSeoSchema.safeParse(input);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { ok: false, error: errorMsg };
    }

    const data = parseResult.data;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // GUARDRAIL: Never allow duplicate titles like "One Studio - One Studio"
    if (data.title) {
      const cleanTitle = data.title.toLowerCase();
      if (cleanTitle.includes('one studio - one studio') || cleanTitle.includes('one studio | one studio')) {
        return {
          ok: false,
          error: 'Title guardrail violation: Duplicate brand name detected ("One Studio - One Studio"). Please revise.',
        };
      }
    }

    const payload = {
      ...data,
      path: normalizedPath,
      updated_at: new Date().toISOString(),
    };

    const sb = createClient();
    const { data: saved, error } = await sb.from('seo_meta').upsert(payload);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath(normalizedPath);
    revalidatePath('/', 'layout');

    return { ok: true, data: saved || payload };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to save page SEO' };
  }
}
