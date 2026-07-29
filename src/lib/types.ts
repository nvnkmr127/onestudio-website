// Shared TypeScript interfaces for Supabase database tables & Server Actions

export interface ActionResult<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface SeoMeta {
  id?: string;
  path: string;
  title?: string | null;
  meta_desc?: string | null;
  canonical_url?: string | null;
  focus_keyword?: string | null;
  index?: boolean;
  follow?: boolean;
  og_title?: string | null;
  og_desc?: string | null;
  og_image?: string | null;
  twitter_card?: string;
  schema_ids?: string[];
  priority?: number;
  changefreq?: string;
  updated_at?: string;
}

export interface OpeningHour {
  day: string;
  opens: string;
  closes: string;
}

export interface SocialProfiles {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  pinterest?: string;
  linkedin?: string;
}

export interface BrandStats {
  quality_checks: number;
  warranty_structural: string;
  warranty_workmanship: string;
  delays: string;
  [key: string]: any;
}

export interface SeoSettings {
  id: number;
  site_name: string;
  site_url: string;
  default_title_template: string;
  default_meta_desc: string;
  default_og_image: string;
  business_name: string;
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  whatsapp: string;
  geo_lat: number;
  geo_lng: number;
  opening_hours: OpeningHour[];
  social_profiles: SocialProfiles;
  gsc_verification?: string | null;
  bing_verification?: string | null;
  brand_stats: BrandStats;
}

export interface RobotsRule {
  id?: string;
  user_agent: string;
  rule_type: 'allow' | 'disallow';
  path: string;
  sort_order: number;
}

export interface Redirect {
  id?: string;
  source: string;
  destination: string;
  status_code: number;
  is_regex: boolean;
  hits?: number;
  active: boolean;
  created_at?: string;
}

export interface SchemaBlock {
  id?: string;
  name: string;
  type: string;
  json_ld: Record<string, any>;
  is_global: boolean;
  updated_at?: string;
}

export interface TrackingConfig {
  id: number;
  ga4_id?: string | null;
  gtm_id?: string | null;
  meta_pixel_id?: string | null;
  meta_capi_token?: string | null;
  consent_default: string;
  custom_head_scripts?: string | null;
}

export interface SeoAuditIssue {
  severity: 'critical' | 'warning' | 'info';
  code: string;
  message: string;
}

export interface SeoAudit {
  id?: string;
  path: string;
  score: number;
  issues: SeoAuditIssue[];
  snapshot?: Record<string, any>;
  created_at?: string;
}

export interface ImageSeo {
  id?: string;
  src: string;
  alt?: string | null;
  title?: string | null;
  in_sitemap: boolean;
}
