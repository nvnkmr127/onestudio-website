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
    slug: 'sustainable-interior-materials-hyderabad',
    title: 'Top Sustainable Interior Materials for Homes in Hyderabad',
    excerpt: 'Discover eco-friendly and energy-efficient interior materials optimized for modern Hyderabad homes.',
    dateStr: '15 OCT 2024',
    image: '/images/bangalore_modern_interior.png',
    category: 'Materials',
    author: 'One Studio Design Team',
    content: `Designing a sustainable home in Hyderabad involves choosing materials that reduce thermal heat gain, lower power consumption, and provide longevity. Premium BWP marine plywood, low-VOC finishes, and energy-efficient LED ambient lighting are standard choices for eco-conscious homeowners.`,
  },
  {
    id: '2',
    slug: 'hyderabad-interior-design-cost-guide-2025',
    title: 'Complete Guide to Interior Design Costs & Timelines in Hyderabad',
    excerpt: 'Understanding modular kitchen costs, wardrobe finishes, and turnkey interior timelines in Hyderabad.',
    dateStr: '28 NOV 2024',
    image: '/images/bangalore_commercial_complex.png',
    category: 'Interior Design',
    author: 'Lead Interior Designer, One Studio',
    content: `Planning home interiors in Hyderabad requires clear understanding of material grades, factory modular manufacturing, and stage payments. From 2BHK to luxury villas in Jubilee Hills and Gachibowli, choosing BWP marine plywood and factory edge-banding ensures 10+ years of durability.

### Key Budget Factors:
- BWP Marine Plywood vs Commercial Plywood
- German Hettich & Blum Soft-Close Hardware
- Factory Modular Cabinetry vs On-Site Carpentry`,
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
