import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { RobotsRule } from '@/lib/types';

export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const sb = createClient();

  const [{ data: settings }, { data: rulesData }] = await Promise.all([
    sb.from('seo_settings').select('site_url').eq('id', 1).maybeSingle(),
    sb.from('robots_rules').select('*').order('sort_order', { ascending: true }),
  ]);

  const siteUrl = (settings?.site_url || 'https://www.onestudio.co.in').replace(/\/$/, '');

  const rulesMap: Record<string, { allow?: string[]; disallow: string[] }> = {};

  // Default fallback for wildcard *
  rulesMap['*'] = {
    allow: ['/'],
    disallow: ['/admin', '/admin/*', '/api', '/*?*'],
  };

  if (rulesData && Array.isArray(rulesData)) {
    rulesData.forEach((r: RobotsRule) => {
      const ua = r.user_agent || '*';
      if (!rulesMap[ua]) {
        rulesMap[ua] = { allow: [], disallow: [] };
      }
      if (r.rule_type === 'allow') {
        if (!rulesMap[ua].allow) rulesMap[ua].allow = [];
        if (!rulesMap[ua].allow?.includes(r.path)) {
          rulesMap[ua].allow?.push(r.path);
        }
      } else {
        if (!rulesMap[ua].disallow.includes(r.path)) {
          rulesMap[ua].disallow.push(r.path);
        }
      }
    });
  }

  // HARD GUARDRAIL: /admin and /admin/* must ALWAYS be disallowed for ALL user agents
  Object.keys(rulesMap).forEach((ua) => {
    if (!rulesMap[ua].disallow.includes('/admin')) {
      rulesMap[ua].disallow.push('/admin');
    }
    if (!rulesMap[ua].disallow.includes('/admin/*')) {
      rulesMap[ua].disallow.push('/admin/*');
    }
  });

  const formattedRules = Object.entries(rulesMap).map(([userAgent, config]) => ({
    userAgent,
    allow: config.allow && config.allow.length > 0 ? config.allow : undefined,
    disallow: config.disallow,
  }));

  return {
    rules: formattedRules,
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
