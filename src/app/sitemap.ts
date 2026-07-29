import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { staticServices } from '@/lib/servicesData';
import { staticLocalSeoPages } from '@/lib/localSeoData';
import type { SeoMeta } from '@/lib/types';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sb = createClient();

  const [{ data: settings }, { data: dbMetas }, { data: blogs }] = await Promise.all([
    sb.from('seo_settings').select('site_url').eq('id', 1).maybeSingle(),
    sb.from('seo_meta').select('*'),
    sb.from('blogs').select('slug, updated_at, published_at'),
  ]);

  const siteUrl = (settings?.site_url || 'https://www.onestudio.co.in').replace(/\/$/, '');
  const metaMap = new Map<string, SeoMeta>();
  if (dbMetas && Array.isArray(dbMetas)) {
    dbMetas.forEach((m: SeoMeta) => metaMap.set(m.path, m));
  }

  const entries: MetadataRoute.Sitemap = [];

  const addSitemapUrl = (
    path: string,
    defaultPriority: number,
    defaultFreq: MetadataRoute.Sitemap[number]['changeFrequency'],
    defaultLastmod?: string
  ) => {
    // HARD GUARDRAIL: Admin routes MUST NEVER appear in sitemap
    if (path.startsWith('/admin')) return;

    const m = metaMap.get(path);
    const isIndexed = m?.index ?? true;
    if (!isIndexed) return; // Omit noindex pages

    const priority = m?.priority ?? defaultPriority;
    const changeFrequency = (m?.changefreq as MetadataRoute.Sitemap[number]['changeFrequency']) || defaultFreq;
    const lastModified = m?.updated_at ? new Date(m.updated_at) : defaultLastmod ? new Date(defaultLastmod) : new Date();

    entries.push({
      url: `${siteUrl}${path === '/' ? '' : path}`,
      lastModified,
      changeFrequency,
      priority,
    });
  };

  // Core static pages
  addSitemapUrl('/', 1.0, 'weekly');
  addSitemapUrl('/services', 0.8, 'monthly');
  addSitemapUrl('/contact', 0.7, 'monthly');
  addSitemapUrl('/how-it-works', 0.9, 'monthly');
  addSitemapUrl('/projects', 0.8, 'monthly');
  addSitemapUrl('/news', 0.8, 'daily');
  addSitemapUrl('/estimate', 0.9, 'weekly');

  // Service Detail Pages
  Object.keys(staticServices).forEach((slug) => {
    addSitemapUrl(`/services/${slug}`, 0.8, 'weekly');
  });

  // Local SEO Landing Pages
  Object.keys(staticLocalSeoPages).forEach((slug) => {
    addSitemapUrl(`/${slug}`, 0.85, 'weekly');
  });

  // Dynamic Published Blogs
  if (blogs && Array.isArray(blogs)) {
    blogs.forEach((b: any) => {
      addSitemapUrl(`/news/${b.slug}`, 0.7, 'weekly', b.updated_at || b.published_at);
    });
  }

  return entries;
}
