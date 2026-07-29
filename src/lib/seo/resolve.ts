import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import type { SeoMeta, SeoSettings } from '@/lib/types';

const DEFAULT_SETTINGS: SeoSettings = {
  id: 1,
  site_name: 'One Studio',
  site_url: 'https://www.onestudio.co',
  default_title_template: '%s | One Studio',
  default_meta_desc: 'Luxury interior design studio & bespoke modular woodwork in Bengaluru. 45-day delivery guarantee, transparent pricing & 10-year warranty.',
  default_og_image: 'https://www.onestudio.co/og-default.jpg',
  business_name: 'One Studio',
  street_address: '38th Cross Rd, 1751, 15th Main Rd, 5th Block, 1st Stage, Telecom Layout',
  locality: 'HBR Layout',
  region: 'Bengaluru, Karnataka',
  postal_code: '560043',
  country: 'IN',
  phone: '+91 90143 03409',
  email: 'hello@onestudio.co',
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
};

export async function resolveSeo(rawPath: string): Promise<Metadata> {
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const sb = createClient();

  const [{ data: dbSettings }, { data: dbMeta }] = await Promise.all([
    sb.from('seo_settings').select('*').eq('id', 1).maybeSingle(),
    sb.from('seo_meta').select('*').eq('path', path).maybeSingle(),
  ]);

  const s: SeoSettings = dbSettings || DEFAULT_SETTINGS;
  const m: SeoMeta | null = dbMeta || null;

  let titleStr = m?.title;
  if (!titleStr) {
    if (path === '/') {
      titleStr = `${s.site_name} | Luxury Interior Designers & Bespoke Woodwork in Bengaluru`;
    } else {
      const pathLabel = path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Home';
      const capitalized = pathLabel.charAt(0).toUpperCase() + pathLabel.slice(1);
      titleStr = s.default_title_template
        ? s.default_title_template.replace('%s', capitalized)
        : `${capitalized} | ${s.site_name}`;
    }
  }

  const description = m?.meta_desc || s.default_meta_desc;
  const normalizedSiteUrl = (s.site_url || 'https://www.onestudio.co').replace(/\/$/, '');
  const canonical = m?.canonical_url || `${normalizedSiteUrl}${path === '/' ? '' : path}`;

  const ogTitle = m?.og_title || titleStr;
  const ogDesc = m?.og_desc || description;
  const ogImage = m?.og_image || s.default_og_image;

  const metadata: Metadata = {
    title: titleStr,
    description: description,
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: m?.index ?? true,
      follow: m?.follow ?? true,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      siteName: s.site_name,
      images: [
        {
          url: ogImage,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: (m?.twitter_card || 'summary_large_image') as 'summary_large_image',
      title: ogTitle,
      description: ogDesc,
      images: [ogImage],
    },
  };

  const verificationObj: Record<string, string> = {};
  if (s.gsc_verification) verificationObj.google = s.gsc_verification;
  if (s.bing_verification) verificationObj['msvalidate.01'] = s.bing_verification;

  if (Object.keys(verificationObj).length > 0) {
    metadata.verification = verificationObj;
  }

  return metadata;
}
