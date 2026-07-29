'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { staticServices } from '@/lib/servicesData';
import { staticLocalSeoPages } from '@/lib/localSeoData';
import type { ActionResult } from '@/lib/types';

export interface SitemapItemAdmin {
  path: string;
  url: string;
  priority: number;
  changefreq: string;
  index: boolean;
  lastmod: string;
  category: 'core' | 'services' | 'local' | 'blogs' | 'other';
}

export async function listSitemapEntries(): Promise<ActionResult<SitemapItemAdmin[]>> {
  try {
    const sb = createClient();
    const [{ data: settings }, { data: dbMetas }, { data: blogs }] = await Promise.all([
      sb.from('seo_settings').select('site_url').eq('id', 1).maybeSingle(),
      sb.from('seo_meta').select('*'),
      sb.from('blogs').select('slug, title, updated_at, published_at'),
    ]);

    const siteUrl = (settings?.site_url || 'https://www.onestudio.in').replace(/\/$/, '');
    const metaMap = new Map<string, any>();
    if (dbMetas && Array.isArray(dbMetas)) {
      dbMetas.forEach((m: any) => metaMap.set(m.path, m));
    }

    const items: SitemapItemAdmin[] = [];

    const addRoute = (path: string, defaultPriority: number, defaultFreq: string, category: 'core' | 'services' | 'local' | 'blogs' | 'other', lastmod?: string) => {
      // HARD GUARDRAIL: Never include admin paths
      if (path.startsWith('/admin')) return;

      const m = metaMap.get(path);
      const isIndexed = m?.index ?? true;
      const priority = m?.priority ?? defaultPriority;
      const changefreq = m?.changefreq || defaultFreq;
      const finalLastmod = m?.updated_at || lastmod || new Date().toISOString();

      items.push({
        path,
        url: `${siteUrl}${path === '/' ? '' : path}`,
        priority,
        changefreq,
        index: isIndexed,
        lastmod: finalLastmod,
        category,
      });
    };

    // Core static pages
    addRoute('/', 1.0, 'weekly', 'core');
    addRoute('/services', 0.8, 'monthly', 'core');
    addRoute('/contact', 0.7, 'monthly', 'core');
    addRoute('/how-it-works', 0.9, 'monthly', 'core');
    addRoute('/projects', 0.8, 'monthly', 'core');
    addRoute('/news', 0.8, 'daily', 'core');
    addRoute('/ai-house-construction-calculator', 0.9, 'weekly', 'core');

    // Service detail pages
    Object.keys(staticServices).forEach((slug) => {
      addRoute(`/services/${slug}`, 0.8, 'weekly', 'services');
    });

    // Local SEO pages
    Object.keys(staticLocalSeoPages).forEach((slug) => {
      addRoute(`/${slug}`, 0.85, 'weekly', 'local');
    });

    // Published blog posts
    if (blogs && Array.isArray(blogs)) {
      blogs.forEach((b: any) => {
        addRoute(`/news/${b.slug}`, 0.7, 'weekly', 'blogs', b.updated_at || b.published_at);
      });
    }

    return { ok: true, data: items };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to fetch sitemap entries' };
  }
}

export async function updateSitemapItem(
  path: string,
  options: { priority?: number; changefreq?: string; index?: boolean }
): Promise<ActionResult<boolean>> {
  try {
    if (path.startsWith('/admin')) {
      return { ok: false, error: 'Admin paths cannot be added to sitemap' };
    }

    const sb = createClient();
    const { data: existing } = await sb.from('seo_meta').select('*').eq('path', path).maybeSingle();

    const payload = {
      path,
      priority: options.priority ?? existing?.priority ?? 0.5,
      changefreq: options.changefreq || existing?.changefreq || 'weekly',
      index: options.index ?? existing?.index ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await sb.from('seo_meta').upsert(payload);
    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/sitemap.xml');
    revalidatePath('/', 'layout');

    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to update sitemap item' };
  }
}

export async function pingSearchEngines(): Promise<ActionResult<{ google: boolean; bing: boolean; message: string }>> {
  try {
    const sb = createClient();
    const { data: settings } = await sb.from('seo_settings').select('site_url').eq('id', 1).maybeSingle();
    const siteUrl = (settings?.site_url || 'https://www.onestudio.in').replace(/\/$/, '');
    const sitemapUrl = `${siteUrl}/sitemap.xml`;

    let googleOk = false;
    let bingOk = false;

    // Ping Google
    try {
      const gRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, { method: 'GET' });
      googleOk = gRes.ok;
    } catch (_) {
      googleOk = false;
    }

    // Ping Bing
    try {
      const bRes = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, { method: 'GET' });
      bingOk = bRes.ok;
    } catch (_) {
      bingOk = false;
    }

    return {
      ok: true,
      data: {
        google: googleOk,
        bing: bingOk,
        message: `Ping completed for ${sitemapUrl}. Google: ${googleOk ? 'Success' : 'Sent'}, Bing: ${bingOk ? 'Success' : 'Sent'}.`,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Search engine ping failed' };
  }
}
