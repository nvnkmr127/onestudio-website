export interface SeoAnalysisInput {
  title: string;
  slug: string;
  content: string;
  focusKeyword: string;
  metaDesc: string;
}

export interface AnalysisItem {
  id: string;
  category: 'seo' | 'readability';
  status: 'pass' | 'warn' | 'fail';
  label: string;
  message: string;
}

export interface SeoAnalysisResult {
  score: number;
  scoreLabel: 'Poor' | 'Needs Improvement' | 'Good' | 'Optimal';
  scoreBadgeColor: string;
  items: AnalysisItem[];
  metrics: {
    wordCount: number;
    sentenceCount: number;
    avgSentenceLength: number;
    passiveVoicePercent: number;
    transitionWordsPercent: number;
    keywordDensityPercent: number;
    keywordCount: number;
    internalLinkCount: number;
    externalLinkCount: number;
    keywordInTitle: boolean;
    keywordInFirstPara: boolean;
    keywordInSlug: boolean;
    keywordInMetaDesc: boolean;
    keywordInHeadings: boolean;
  };
}

const COMMON_TRANSITION_WORDS = [
  'however', 'therefore', 'furthermore', 'moreover', 'in addition', 'also',
  'consequently', 'as a result', 'for example', 'for instance', 'in contrast',
  'on the other hand', 'meanwhile', 'subsequently', 'nevertheless', 'because',
  'since', 'although', 'even though', 'despite', 'specifically', 'in summary'
];

/**
 * Analyzes article content and metadata for real-time SEO + Readability health.
 */
export function analyzeSeoContent(input: SeoAnalysisInput): SeoAnalysisResult {
  const { title, slug, content, focusKeyword, metaDesc } = input;
  const keyword = focusKeyword.toLowerCase().trim();
  const rawText = content.replace(/<[^>]*>/g, ' ').replace(/#+/g, ' ');

  // 1. Text Segmentation
  const words = rawText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  const sentences = rawText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const avgSentenceLength = wordCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;

  // 2. Keyword Presence
  const titleLower = title.toLowerCase();
  const slugLower = slug.toLowerCase();
  const metaLower = metaDesc.toLowerCase();

  const keywordInTitle = keyword ? titleLower.includes(keyword) : false;
  const keywordInSlug = keyword ? slugLower.includes(keyword) : false;
  const keywordInMetaDesc = keyword ? metaLower.includes(keyword) : false;

  // First paragraph keyword check
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.replace(/<[^>]*>/g, '').trim())
    .filter((p) => p.length > 0);
  const firstPara = paragraphs[0] ? paragraphs[0].toLowerCase() : '';
  const keywordInFirstPara = keyword ? firstPara.includes(keyword) : false;

  // Headings keyword check
  const headingMatches = content.match(/^#{1,6}\s+(.*)$/gm) || [];
  const headingsText = headingMatches.join(' ').toLowerCase();
  const keywordInHeadings = keyword ? headingsText.includes(keyword) : false;

  // Keyword Density
  let keywordCount = 0;
  if (keyword && wordCount > 0) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    const matches = rawText.match(regex);
    keywordCount = matches ? matches.length : 0;
  }
  const keywordWords = keyword ? keyword.split(/\s+/).length : 1;
  const keywordDensityPercent = wordCount > 0 ? Math.round(((keywordCount * keywordWords) / wordCount) * 1000) / 10 : 0;

  // 3. Readability Analysis
  // Passive voice estimation
  let passiveSentenceCount = 0;
  const passivePattern = /\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|[a-z]+en)\b/i;
  sentences.forEach((s) => {
    if (passivePattern.test(s)) passiveSentenceCount++;
  });
  const passiveVoicePercent = sentenceCount > 0 ? Math.round((passiveSentenceCount / sentenceCount) * 100) : 0;

  // Transition words estimation
  let transitionSentenceCount = 0;
  sentences.forEach((s) => {
    const sLower = s.toLowerCase();
    if (COMMON_TRANSITION_WORDS.some((tw) => sLower.includes(tw))) {
      transitionSentenceCount++;
    }
  });
  const transitionWordsPercent = sentenceCount > 0 ? Math.round((transitionSentenceCount / sentenceCount) * 100) : 0;

  // Link counts
  const markdownLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  let internalLinkCount = 0;
  let externalLinkCount = 0;
  markdownLinks.forEach((link) => {
    if (link.includes('http://') || link.includes('https://')) {
      if (link.includes('onestudio.in') || link.includes('onestudio.co')) {
        internalLinkCount++;
      } else {
        externalLinkCount++;
      }
    } else {
      internalLinkCount++;
    }
  });

  // 4. Checklist & Scoring Engine
  const items: AnalysisItem[] = [];
  let score = 0;

  // --- SEO Checks (60 pts max) ---

  // Focus Keyword defined
  if (!keyword) {
    items.push({
      id: 'focus-keyword-missing',
      category: 'seo',
      status: 'warn',
      label: 'Focus Keyword',
      message: 'Set a focus keyword to evaluate keyword placement and density.',
    });
  } else {
    items.push({
      id: 'focus-keyword-set',
      category: 'seo',
      status: 'pass',
      label: 'Focus Keyword',
      message: `Focus keyword set to "${focusKeyword}".`,
    });
    score += 5;
  }

  // Keyword in Title
  if (keywordInTitle) {
    items.push({
      id: 'kw-title',
      category: 'seo',
      status: 'pass',
      label: 'Keyword in Title',
      message: 'Focus keyword appears in the SEO title tag.',
    });
    score += 10;
  } else {
    items.push({
      id: 'kw-title',
      category: 'seo',
      status: 'fail',
      label: 'Keyword in Title',
      message: 'Add the focus keyword to the title tag.',
    });
  }

  // Keyword in First Paragraph (HARD REQUIREMENT)
  if (keywordInFirstPara) {
    items.push({
      id: 'kw-first-para',
      category: 'seo',
      status: 'pass',
      label: 'Keyword in Introduction',
      message: 'Focus keyword appears in the first paragraph.',
    });
    score += 10;
  } else {
    items.push({
      id: 'kw-first-para',
      category: 'seo',
      status: 'fail',
      label: 'Keyword in Introduction',
      message: 'The focus keyword is missing from the first paragraph.',
    });
  }

  // Keyword in URL Slug
  if (keywordInSlug) {
    items.push({
      id: 'kw-slug',
      category: 'seo',
      status: 'pass',
      label: 'Keyword in URL',
      message: 'Focus keyword appears in the URL slug.',
    });
    score += 5;
  } else {
    items.push({
      id: 'kw-slug',
      category: 'seo',
      status: 'warn',
      label: 'Keyword in URL',
      message: 'Include your focus keyword in the URL slug.',
    });
  }

  // Keyword in Meta Description
  if (keywordInMetaDesc) {
    items.push({
      id: 'kw-meta',
      category: 'seo',
      status: 'pass',
      label: 'Keyword in Meta Description',
      message: 'Focus keyword appears in the meta description.',
    });
    score += 10;
  } else {
    items.push({
      id: 'kw-meta',
      category: 'seo',
      status: 'warn',
      label: 'Keyword in Meta Description',
      message: 'Add the focus keyword to the meta description tag.',
    });
  }

  // Keyword Density Band
  if (keywordDensityPercent >= 0.5 && keywordDensityPercent <= 2.5) {
    items.push({
      id: 'kw-density',
      category: 'seo',
      status: 'pass',
      label: 'Keyword Density',
      message: `Keyword density is optimal (${keywordDensityPercent}%).`,
    });
    score += 10;
  } else if (keywordDensityPercent > 2.5) {
    items.push({
      id: 'kw-density',
      category: 'seo',
      status: 'warn',
      label: 'Keyword Density',
      message: `Keyword density is high (${keywordDensityPercent}%). Avoid keyword stuffing.`,
    });
    score += 5;
  } else {
    items.push({
      id: 'kw-density',
      category: 'seo',
      status: 'warn',
      label: 'Keyword Density',
      message: `Keyword density is low (${keywordDensityPercent}%). Target between 0.5% and 2.5%.`,
    });
    score += 2;
  }

  // Content Length
  if (wordCount >= 300) {
    items.push({
      id: 'word-count',
      category: 'seo',
      status: 'pass',
      label: 'Text Length',
      message: `Content contains ${wordCount} words (Good length).`,
    });
    score += 10;
  } else {
    items.push({
      id: 'word-count',
      category: 'seo',
      status: 'fail',
      label: 'Text Length',
      message: `Content contains only ${wordCount} words. Minimum 300 words recommended.`,
    });
  }

  // --- Readability Checks (40 pts max) ---

  // Sentence Length
  if (avgSentenceLength <= 20 && avgSentenceLength > 0) {
    items.push({
      id: 'sentence-length',
      category: 'readability',
      status: 'pass',
      label: 'Sentence Length',
      message: `Average sentence length is ${avgSentenceLength} words (Great readability).`,
    });
    score += 15;
  } else if (avgSentenceLength > 20) {
    items.push({
      id: 'sentence-length',
      category: 'readability',
      status: 'warn',
      label: 'Sentence Length',
      message: `Average sentence length is ${avgSentenceLength} words. Keep sentences under 20 words for clarity.`,
    });
    score += 5;
  }

  // Passive Voice
  if (passiveVoicePercent <= 15) {
    items.push({
      id: 'passive-voice',
      category: 'readability',
      status: 'pass',
      label: 'Passive Voice',
      message: `Passive voice is ${passiveVoicePercent}% (Active tone).`,
    });
    score += 15;
  } else {
    items.push({
      id: 'passive-voice',
      category: 'readability',
      status: 'warn',
      label: 'Passive Voice',
      message: `Passive voice is ${passiveVoicePercent}%. Use active voice for more engaging content.`,
    });
    score += 5;
  }

  // Transition Words
  if (transitionWordsPercent >= 20) {
    items.push({
      id: 'transition-words',
      category: 'readability',
      status: 'pass',
      label: 'Transition Words',
      message: `${transitionWordsPercent}% of sentences contain transition words.`,
    });
    score += 10;
  } else {
    items.push({
      id: 'transition-words',
      category: 'readability',
      status: 'warn',
      label: 'Transition Words',
      message: `Only ${transitionWordsPercent}% of sentences contain transition words. Aim for 20%+.`,
    });
    score += 5;
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const scoreLabel = finalScore >= 80 ? 'Optimal' : finalScore >= 65 ? 'Good' : finalScore >= 45 ? 'Needs Improvement' : 'Poor';
  const scoreBadgeColor = finalScore >= 80 ? 'bg-emerald-500 text-white' : finalScore >= 65 ? 'bg-sky-500 text-white' : finalScore >= 45 ? 'bg-amber-500 text-slate-900' : 'bg-red-500 text-white';

  return {
    score: finalScore,
    scoreLabel,
    scoreBadgeColor,
    items,
    metrics: {
      wordCount,
      sentenceCount,
      avgSentenceLength,
      passiveVoicePercent,
      transitionWordsPercent,
      keywordDensityPercent,
      keywordCount,
      internalLinkCount,
      externalLinkCount,
      keywordInTitle,
      keywordInFirstPara,
      keywordInSlug,
      keywordInMetaDesc,
      keywordInHeadings,
    },
  };
}
