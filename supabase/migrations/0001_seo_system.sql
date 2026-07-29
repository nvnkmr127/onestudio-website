-- Supabase SQL Migration: SEO Control Plane Schema & Initial Seed Data
-- Enables Row Level Security on all tables and seeds global SEO settings with verified NAP.

-- 1. Per-page SEO overrides
CREATE TABLE IF NOT EXISTS public.seo_meta (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path           TEXT UNIQUE NOT NULL,
  title          TEXT,
  meta_desc      TEXT,
  canonical_url  TEXT,
  focus_keyword  TEXT,
  index          BOOLEAN DEFAULT true,
  follow         BOOLEAN DEFAULT true,
  og_title       TEXT,
  og_desc        TEXT,
  og_image       TEXT,
  twitter_card   TEXT DEFAULT 'summary_large_image',
  schema_ids     UUID[] DEFAULT '{}',
  priority       NUMERIC DEFAULT 0.5,
  changefreq     TEXT DEFAULT 'weekly',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Global SEO Settings (Single Row: id = 1)
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id                     INT PRIMARY KEY DEFAULT 1,
  site_name              TEXT DEFAULT 'One Studio',
  site_url               TEXT DEFAULT 'https://www.onestudio.in',
  default_title_template TEXT DEFAULT '%s | One Studio',
  default_meta_desc      TEXT DEFAULT 'Bespoke interior design, luxury modular kitchens & wardrobes in HBR Layout, Bengaluru. Transparent pricing, 415+ quality checks & 15-year warranty.',
  default_og_image       TEXT DEFAULT 'https://www.onestudio.in/og-default.jpg',
  business_name          TEXT DEFAULT 'One Studio',
  street_address         TEXT DEFAULT '38th Cross Rd, 1751, 15th Main Rd, 5th Block, 1st Stage, Telecom Layout',
  locality               TEXT DEFAULT 'HBR Layout',
  region                 TEXT DEFAULT 'Bengaluru, Karnataka',
  postal_code            TEXT DEFAULT '560043',
  country                TEXT DEFAULT 'IN',
  phone                  TEXT DEFAULT '+91 90143 03409',
  email                  TEXT DEFAULT 'reachus@onestudio.in',
  whatsapp               TEXT DEFAULT '+91 90143 03409',
  geo_lat                NUMERIC DEFAULT 13.0247,
  geo_lng                NUMERIC DEFAULT 77.6288,
  opening_hours          JSONB DEFAULT '[{"day": "Monday-Saturday", "opens": "09:00", "closes": "19:00"}]'::jsonb,
  social_profiles        JSONB DEFAULT '{"instagram": "", "facebook": "", "youtube": "", "pinterest": "", "linkedin": ""}'::jsonb,
  gsc_verification       TEXT,
  bing_verification      TEXT,
  brand_stats            JSONB DEFAULT '{"quality_checks": 415, "warranty_structural": "10-15 years", "warranty_workmanship": "1 year", "delays": "zero"}'::jsonb,
  CONSTRAINT one_row CHECK (id = 1)
);

-- 3. robots.txt rules
CREATE TABLE IF NOT EXISTS public.robots_rules (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_agent TEXT DEFAULT '*',
  rule_type  TEXT CHECK (rule_type IN ('allow', 'disallow')),
  path       TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 4. Redirects
CREATE TABLE IF NOT EXISTS public.redirects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source      TEXT NOT NULL,
  destination TEXT NOT NULL,
  status_code INT DEFAULT 301,
  is_regex    BOOLEAN DEFAULT false,
  hits        INT DEFAULT 0,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Reusable Schema.org blocks
CREATE TABLE IF NOT EXISTS public.schema_blocks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  type       TEXT NOT NULL,
  json_ld    JSONB NOT NULL,
  is_global  BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tracking & Analytics Config (Single Row: id = 1)
CREATE TABLE IF NOT EXISTS public.tracking_config (
  id                  INT PRIMARY KEY DEFAULT 1,
  ga4_id              TEXT,
  gtm_id              TEXT,
  meta_pixel_id       TEXT,
  meta_capi_token     TEXT,
  consent_default     TEXT DEFAULT 'denied',
  custom_head_scripts TEXT,
  CONSTRAINT one_row_tracking CHECK (id = 1)
);

-- 7. SEO Audit Logs & Snapshot History
CREATE TABLE IF NOT EXISTS public.seo_audits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path       TEXT,
  score      INT,
  issues     JSONB,
  snapshot   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Image Alt-Text & Media Registry
CREATE TABLE IF NOT EXISTS public.image_seo (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src        TEXT UNIQUE NOT NULL,
  alt        TEXT,
  title      TEXT,
  in_sitemap BOOLEAN DEFAULT true
);

-- ===================================================
-- ROW LEVEL SECURITY & POLICIES
-- ===================================================

ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.robots_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schema_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on seo_meta" ON public.seo_meta FOR SELECT USING (true);
CREATE POLICY "Allow public select on seo_settings" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow public select on robots_rules" ON public.robots_rules FOR SELECT USING (true);
CREATE POLICY "Allow public select on redirects" ON public.redirects FOR SELECT USING (true);
CREATE POLICY "Allow public select on schema_blocks" ON public.schema_blocks FOR SELECT USING (true);
CREATE POLICY "Allow public select on tracking_config" ON public.tracking_config FOR SELECT USING (true);
CREATE POLICY "Allow public select on seo_audits" ON public.seo_audits FOR SELECT USING (true);
CREATE POLICY "Allow public select on image_seo" ON public.image_seo FOR SELECT USING (true);

-- ===================================================
-- SEED DATA
-- ===================================================

INSERT INTO public.seo_settings (
  id,
  site_name,
  site_url,
  default_title_template,
  default_meta_desc,
  default_og_image,
  business_name,
  street_address,
  locality,
  region,
  postal_code,
  country,
  phone,
  email,
  whatsapp,
  geo_lat,
  geo_lng,
  opening_hours,
  social_profiles,
  brand_stats
) VALUES (
  1,
  'One Studio',
  'https://www.onestudio.in',
  '%s | One Studio',
  'Bespoke interior design, luxury modular kitchens & wardrobes in HBR Layout, Bengaluru. Transparent pricing, 415+ quality checks & 15-year warranty.',
  'https://www.onestudio.in/og-default.jpg',
  'One Studio',
  '38th Cross Rd, 1751, 15th Main Rd, 5th Block, 1st Stage, Telecom Layout',
  'HBR Layout',
  'Bengaluru, Karnataka',
  '560043',
  'IN',
  '+91 90143 03409',
  'reachus@onestudio.in',
  '+91 90143 03409',
  13.0247,
  77.6288,
  '[{"day": "Monday-Saturday", "opens": "09:00", "closes": "19:00"}]'::jsonb,
  '{"instagram": "", "facebook": "", "youtube": "", "pinterest": "", "linkedin": ""}'::jsonb,
  '{"quality_checks": 415, "warranty_structural": "10-15 years", "warranty_workmanship": "1 year", "delays": "zero"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_url = EXCLUDED.site_url,
  business_name = EXCLUDED.business_name,
  street_address = EXCLUDED.street_address,
  locality = EXCLUDED.locality,
  region = EXCLUDED.region,
  postal_code = EXCLUDED.postal_code,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  brand_stats = EXCLUDED.brand_stats;

INSERT INTO public.tracking_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
