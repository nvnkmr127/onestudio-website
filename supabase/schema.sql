-- ===================================================
-- One Studio - Supabase Database Schema with Yoast SEO Engine
-- Run this in your Supabase SQL Editor (https://supabase.com)
-- ===================================================

-- 1. Create LEADS table for storing contact & calculator inquiries
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  source_page TEXT DEFAULT 'contact',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for leads" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read for leads" ON public.leads
  FOR SELECT USING (auth.role() = 'authenticated');


-- 2. Create BLOGS table with Yoast SEO Metadata columns
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Interior Design',
  author TEXT DEFAULT 'One Studio Team',
  featured_image TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  focus_keyword TEXT,
  og_image TEXT,
  canonical_url TEXT,
  schema_type TEXT DEFAULT 'Article',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blogs_slug_idx ON public.blogs (slug);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select for blogs" ON public.blogs
  FOR SELECT USING (true);
