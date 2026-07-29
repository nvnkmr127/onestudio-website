import { staticLocalSeoPages } from '@/lib/localSeoData';
import { staticServices } from '@/lib/servicesData';

export interface InternalLinkSuggestion {
  phrase: string;
  targetPath: string;
  targetTitle: string;
  isAlreadyLinked: boolean;
  markdownSnippet: string;
}

interface TargetPage {
  title: string;
  path: string;
  keywords: string[];
}

const STATIC_TARGET_PAGES: TargetPage[] = [
  {
    title: 'Luxury Interior Design Services',
    path: '/services/interior-design',
    keywords: ['interior design', 'interiors', 'modular kitchen', 'living room interior'],
  },
  {
    title: 'Commercial & Office Interior Fitouts',
    path: '/services/commercial-interiors',
    keywords: ['commercial interiors', 'office fitout', 'office interior', 'retail interior'],
  },
  {
    title: 'Interior Design Cost Estimator',
    path: '/estimate',
    keywords: ['cost calculator', 'interior cost', 'estimate', 'calculator'],
  },
  {
    title: 'Contact One Studio Team',
    path: '/contact',
    keywords: ['contact us', 'consultation', 'hbr layout', 'book appointment'],
  },
];

/**
 * Scans article content and recommends contextual internal link opportunities.
 */
export function suggestInternalLinks(
  content: string,
  extraPages: Array<{ title: string; path: string; keywords?: string[] }> = []
): InternalLinkSuggestion[] {
  if (!content) return [];

  const allTargets: TargetPage[] = [...STATIC_TARGET_PAGES];

  // Add static local SEO pages dynamically
  Object.entries(staticLocalSeoPages).forEach(([slug, cfg]) => {
    allTargets.push({
      title: cfg.heading,
      path: `/${slug}`,
      keywords: [cfg.location.toLowerCase(), slug.replace(/-/g, ' ')],
    });
  });

  // Add extra blog posts/pages if passed
  extraPages.forEach((p) => {
    allTargets.push({
      title: p.title,
      path: p.path.startsWith('/') ? p.path : `/${p.path}`,
      keywords: p.keywords || [p.title.toLowerCase()],
    });
  });

  const suggestions: InternalLinkSuggestion[] = [];
  const contentLower = content.toLowerCase();

  allTargets.forEach((target) => {
    target.keywords.forEach((keyword) => {
      if (!keyword || keyword.length < 3) return;
      const kwLower = keyword.toLowerCase();

      if (contentLower.includes(kwLower)) {
        // Check if this path or phrase is already linked in markdown
        const isAlreadyLinked =
          content.includes(`](${target.path})`) ||
          content.includes(`](${target.path}/)`) ||
          content.toLowerCase().includes(`[${kwLower}]`);

        // Avoid adding duplicate suggestions for the same target path
        if (!suggestions.some((s) => s.targetPath === target.path && s.phrase === keyword)) {
          suggestions.push({
            phrase: keyword,
            targetPath: target.path,
            targetTitle: target.title,
            isAlreadyLinked,
            markdownSnippet: `[${keyword}](${target.path})`,
          });
        }
      }
    });
  });

  return suggestions;
}
