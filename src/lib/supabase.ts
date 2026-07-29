// Lightweight Supabase client using native fetch API (Zero external dependency bloat)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export interface LeadData {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source_page?: string;
  status?: string;
  created_at?: string;
}

export interface BlogPostData {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  author?: string;
  featured_image?: string;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  og_image?: string;
  canonical_url?: string;
  schema_type?: string;
}

export interface PageSeoSetting {
  page_path: string;
  seo_title: string;
  seo_description: string;
  focus_keyword?: string;
  og_image?: string;
  canonical_url?: string;
  schema_type?: string;
  updated_at?: string;
}

/**
 * Inserts a new lead into the Supabase database.
 */
export async function insertLead(lead: LeadData): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[Supabase Warning] Environment variables missing. Lead logged locally:', lead);
    return { success: true, data: { ...lead, id: 'local-demo-id', created_at: new Date().toISOString() } };
  }

  try {
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        email: lead.email || null,
        message: lead.message || null,
        source_page: lead.source_page || 'contact',
        status: lead.status || 'new',
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Fetches all leads (Admin only).
 */
export async function fetchAllLeads(): Promise<LeadData[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  try {
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/leads?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('[Supabase Error] Exception fetching leads:', err);
    return [];
  }
}

/**
 * Updates lead status.
 */
export async function updateLeadStatus(id: string, status: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;

  try {
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/leads?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Fetches blog posts from Supabase.
 */
export async function fetchBlogs(): Promise<BlogPostData[] | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  try {
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/blogs?select=*&order=published_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Fetches a single blog post by slug.
 */
export async function fetchBlogBySlug(slug: string): Promise<BlogPostData | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  try {
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/blogs?slug=eq.${slug}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const posts: BlogPostData[] = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (err) {
    return null;
  }
}

/**
 * Creates or updates a blog post with Yoast SEO fields.
 */
export async function insertBlog(blog: BlogPostData): Promise<{ success: boolean; error?: string }> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { success: false, error: 'Supabase keys missing. Blog saved to memory.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/blogs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category || 'Construction',
        author: blog.author || 'One Studio Team',
        featured_image: blog.featured_image || '/images/bangalore_modern_interior.png',
        published_at: blog.published_at || new Date().toISOString(),
        seo_title: blog.seo_title || blog.title,
        seo_description: blog.seo_description || blog.excerpt,
        focus_keyword: blog.focus_keyword || null,
        og_image: blog.og_image || blog.featured_image || null,
        canonical_url: blog.canonical_url || null,
        schema_type: blog.schema_type || 'Article',
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Deletes a blog post by ID or slug.
 */
export async function deleteBlog(idOrSlug: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;

  try {
    const isUuid = idOrSlug.includes('-');
    const query = isUuid ? `id=eq.${idOrSlug}` : `slug=eq.${idOrSlug}`;
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/blogs?${query}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });

    return res.ok;
  } catch (err) {
    return false;
  }
}
