import { fetchBlogs, fetchBlogBySlug, BlogPostData } from './supabase';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  dateStr: string;
  image: string;
  category?: string;
  author?: string;
}

export const defaultPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'sustainable-building-materials-bangalore',
    title: 'Top Sustainable Building Materials for Homes in Bangalore',
    excerpt: 'Discover eco-friendly and energy-efficient building materials optimized for modern Bangalore homes.',
    dateStr: '15 OCT 2024',
    image: '/images/bangalore_modern_interior.png',
    category: 'Materials',
    author: 'One Studio Design Team',
    content: `Building a sustainable home in Bangalore involves choosing materials that reduce thermal heat gain, lower power consumption, and provide longevity. High-performance AAC blocks, solar-reflective roof coatings, and low-VOC paints are standard choices for eco-conscious homeowners.

### Key Eco-Friendly Construction Practices:
1. **Autoclaved Aerated Concrete (AAC) Blocks**: Superior thermal insulation reducing air conditioning loads up to 25%.
2. **Rainwater Harvesting & Recharging Systems**: Mandatory for BBMP compliance while ensuring groundwater sustainability.
3. **Low-E Solar Glazing**: Double-glazed UPVC windows that block UV rays while retaining natural indoor daylight.`,
  },
  {
    id: '2',
    slug: 'bbmp-building-approval-guide-2025',
    title: 'Complete Guide to BBMP Plan Approvals & Regulations',
    excerpt: 'Navigating plan sanctions, setback requirements, and structural norms for residential construction.',
    dateStr: '28 NOV 2024',
    image: '/images/bangalore_commercial_complex.png',
    category: 'Regulations',
    author: 'Lead Interior Designer, One Studio',
    content: `BBMP building plan sanctions require strict adherence to setback rules, FAR ratios, and rainwater harvesting compliance. Working with certified structural engineers ensures seamless sanctioning without costly delays.

### Mandatory Compliance Steps:
- Khata A Certificate verification
- Structural Stability Certificate from BBMP empaneled engineer
- Solar Water Heater installation proof for structures above 2400 sq.ft`,
  },
  {
    id: '3',
    slug: 'cost-effective-interior-design-tips',
    title: 'Cost-Effective Commercial & Residential Interior Design Tips',
    excerpt: 'Maximizing space and luxury aesthetics without overshooting your construction budget.',
    dateStr: '10 JAN 2025',
    image: '/images/bangalore_hero_building.png',
    category: 'Interior Design',
    author: 'Interior Design Division',
    content: `Optimizing interior aesthetics does not require lavish spending. Modular cabinetry, strategic accent lighting, and durable laminate finishes create high-end visual appeal at fraction of the cost.`,
  },
];

/**
 * Gets all published blog posts from Supabase or fallback defaults.
 */
export async function getPosts(): Promise<BlogPost[]> {
  const dbPosts = await fetchBlogs();
  if (dbPosts && dbPosts.length > 0) {
    return dbPosts.map((p) => ({
      id: p.id || p.slug,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      dateStr: p.published_at
        ? new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
        : 'RECENT',
      image: p.featured_image || '/images/bangalore_modern_interior.png',
      category: p.category || 'Construction',
      author: p.author || 'One Studio Team',
    }));
  }
  return defaultPosts;
}

/**
 * Gets a single post by slug from Supabase or fallback defaults.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const dbPost = await fetchBlogBySlug(slug);
  if (dbPost) {
    return {
      id: dbPost.id || dbPost.slug,
      slug: dbPost.slug,
      title: dbPost.title,
      excerpt: dbPost.excerpt,
      content: dbPost.content,
      dateStr: dbPost.published_at
        ? new Date(dbPost.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Recent Post',
      image: dbPost.featured_image || '/images/bangalore_modern_interior.png',
      category: dbPost.category || 'Construction',
      author: dbPost.author || 'One Studio Team',
    };
  }

  const fallback = defaultPosts.find((p) => p.slug === slug);
  return fallback || null;
}
