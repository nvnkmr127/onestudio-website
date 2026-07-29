import { VERIFIED_NAP } from './nap-check';

export interface CitabilityCheckItem {
  id: string;
  label: string;
  passed: boolean;
  score: number;
  recommendation: string;
}

export interface AiCitabilityResult {
  citabilityScore: number; // 0 - 100
  rating: 'Highly Citable' | 'Moderately Citable' | 'Low Citability';
  checks: CitabilityCheckItem[];
}

/**
 * Evaluates page content for AI search engine (Perplexity, ChatGPT, Google SGE) citability.
 */
export function calculateAiCitabilityScore(input: {
  title: string;
  content: string;
  hasFaqSchema?: boolean;
  hasLocalBusinessSchema?: boolean;
}): AiCitabilityResult {
  const checks: CitabilityCheckItem[] = [];
  const text = input.content || '';

  // 1. Heading Structure Check
  const hasSubheadings = text.includes('##') || text.includes('###') || /<h[23]/i.test(text);
  checks.push({
    id: 'subheadings',
    label: 'Subheading Hierarchy (H2/H3)',
    passed: hasSubheadings,
    score: hasSubheadings ? 25 : 5,
    recommendation: hasSubheadings
      ? 'Clear section hierarchy detected for LLM parsing.'
      : 'Add markdown subheadings (## or ###) to organize content into distinct topical sections.',
  });

  // 2. Self-Contained Concise Answer Paragraphs
  const paragraphs = text
    .split(/\n\n|<p>/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);
  const avgWordsPerPara =
    paragraphs.reduce((acc, p) => acc + p.split(/\s+/).length, 0) / Math.max(1, paragraphs.length);
  const isConcise = avgWordsPerPara >= 15 && avgWordsPerPara <= 65;

  checks.push({
    id: 'concise-paragraphs',
    label: 'Concise Self-Contained Answers',
    passed: isConcise,
    score: isConcise ? 25 : 15,
    recommendation: isConcise
      ? 'Paragraph length optimal (~15-65 words) for direct AI direct-answer extractions.'
      : 'Keep paragraphs concise (~20-50 words) so AI models can easily summarize discrete answers.',
  });

  // 3. Entity & NAP Clarity
  const mentionsBrand = text.toLowerCase().includes('one studio');
  const mentionsLocation = text.toLowerCase().includes('bengaluru') || text.toLowerCase().includes('hbr layout');
  const entityPassed = mentionsBrand && mentionsLocation;

  checks.push({
    id: 'entity-clarity',
    label: 'Verified Brand & Geo Entity Clarity',
    passed: entityPassed,
    score: entityPassed ? 25 : 10,
    recommendation: entityPassed
      ? 'Brand name and location entity explicitly identified.'
      : 'Mention One Studio and HBR Layout/Bengaluru explicitly to anchor geographic entity authority.',
  });

  // 4. Schema Structuring (FAQ / LocalBusiness)
  const schemaPassed = Boolean(input.hasFaqSchema || input.hasLocalBusinessSchema);
  checks.push({
    id: 'schema-structured',
    label: 'JSON-LD Schema Markup Integration',
    passed: schemaPassed,
    score: schemaPassed ? 25 : 10,
    recommendation: schemaPassed
      ? 'Structured JSON-LD schema detected for search engine graph indexers.'
      : 'Attach FAQPage or LocalBusiness JSON-LD schema to assist structured AI indexing.',
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);

  let rating: 'Highly Citable' | 'Moderately Citable' | 'Low Citability' = 'Highly Citable';
  if (totalScore < 60) rating = 'Low Citability';
  else if (totalScore < 85) rating = 'Moderately Citable';

  return {
    citabilityScore: totalScore,
    rating,
    checks,
  };
}
