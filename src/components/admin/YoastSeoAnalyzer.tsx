'use client';

import React, { useState, useMemo } from 'react';
import { analyzeSeoContent } from '@/lib/seo/analyze';
import { suggestInternalLinks, InternalLinkSuggestion } from '@/lib/seo/internal-links';

export interface YoastSeoState {
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  slug: string;
  content: string;
  ogImage: string;
  canonicalUrl: string;
  schemaType: 'Article' | 'LocalBusiness' | 'FAQPage' | 'Service';
  robotsIndex: boolean;
}

interface YoastSeoAnalyzerProps {
  seoState: YoastSeoState;
  onChange: (updatedState: Partial<YoastSeoState>) => void;
  siteDomain?: string;
  extraPublishedPosts?: Array<{ title: string; path: string }>;
}

export default function YoastSeoAnalyzer({
  seoState,
  onChange,
  siteDomain = 'https://www.onestudio.in',
  extraPublishedPosts = [],
}: YoastSeoAnalyzerProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'checklist' | 'readability' | 'internalLinks'>('checklist');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const {
    seoTitle,
    seoDescription,
    focusKeyword,
    slug,
    content,
    ogImage,
    canonicalUrl,
    schemaType,
    robotsIndex,
  } = seoState;

  // Real-time Analysis Engine calculation
  const analysis = useMemo(() => {
    return analyzeSeoContent({
      title: seoTitle,
      slug,
      content,
      focusKeyword,
      metaDesc: seoDescription,
    });
  }, [seoTitle, slug, content, focusKeyword, seoDescription]);

  // Real-time Internal Link Suggestions
  const linkSuggestions = useMemo(() => {
    return suggestInternalLinks(content, extraPublishedPosts);
  }, [content, extraPublishedPosts]);

  const targetUrl = `${siteDomain.replace(/\/$/, '')}/${slug ? (slug.startsWith('/') ? slug.slice(1) : slug) : ''}`;

  const titleLength = seoTitle.length;
  const isTitleIdeal = titleLength >= 45 && titleLength <= 60;

  const descLength = seoDescription.length;
  const isDescIdeal = descLength >= 120 && descLength <= 160;

  const copyToClipboard = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(snippet);
    setTimeout(() => setCopiedSnippet(null), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-slate-100 font-sans shadow-xl">
      {/* Header with Score Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#f2bd19] text-slate-900 flex items-center justify-center font-black text-xl shadow-md">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Yoast SEO &amp; Readability Analyzer</h3>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${analysis.scoreBadgeColor}`}>
                {analysis.score}/100 • {analysis.scoreLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-time keyword placement, readability &amp; internal link engine</p>
          </div>
        </div>

        {/* Device Preview Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-extrabold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPreviewDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              previewDevice === 'desktop' ? 'bg-[#f2bd19] text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🖥️ Desktop
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              previewDevice === 'mobile' ? 'bg-[#f2bd19] text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            📱 Mobile
          </button>
        </div>
      </div>

      {/* Google SERP Snippet Preview Box */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
          Google Search Result Snippet Preview ({previewDevice.toUpperCase()})
        </label>
        <div
          className={`bg-white rounded-2xl p-5 shadow-lg border border-slate-200 text-left font-sans ${
            previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
          }`}
        >
          <div className="flex items-center gap-2 text-xs mb-1">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-[#f2bd19] flex items-center justify-center font-black text-[10px]">
              OS
            </div>
            <div className="min-w-0">
              <span className="text-slate-900 font-semibold block text-[12px] leading-none">One Studio</span>
              <span className="text-slate-500 text-[10px] block truncate">{targetUrl}</span>
            </div>
          </div>

          <h4 className="text-[#1a0dab] hover:underline font-normal text-lg leading-snug cursor-pointer truncate">
            {seoTitle || 'Page Title Placeholder - One Studio Interiors'}
          </h4>

          <p className="text-[#4d5156] text-xs leading-relaxed mt-1 line-clamp-2">
            {seoDescription || 'Add a compelling meta description to improve your click-through rate on Google search results...'}
          </p>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SEO Title Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              SEO Title Tag *
            </label>
            <span
              className={`text-[10px] font-bold ${
                isTitleIdeal ? 'text-emerald-400' : titleLength > 60 ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {titleLength} / 60 chars
            </span>
          </div>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => onChange({ seoTitle: e.target.value })}
            placeholder="e.g. Turnkey Interior Design Services Bangalore | One Studio"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#f2bd19]"
          />
        </div>

        {/* Focus Keyword Input */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
            Focus Keyword / Keyphrase
          </label>
          <input
            type="text"
            value={focusKeyword}
            onChange={(e) => onChange({ focusKeyword: e.target.value })}
            placeholder="e.g., house construction bangalore"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-[#f2bd19] focus:outline-none focus:border-[#f2bd19]"
          />
        </div>

        {/* Meta Description Input */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Meta Description Tag *
            </label>
            <span
              className={`text-[10px] font-bold ${
                isDescIdeal ? 'text-emerald-400' : descLength > 160 ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {descLength} / 160 chars
            </span>
          </div>
          <textarea
            rows={3}
            value={seoDescription}
            onChange={(e) => onChange({ seoDescription: e.target.value })}
            placeholder="Write a clear, persuasive 120-155 character description containing your focus keyword..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-medium text-white focus:outline-none focus:border-[#f2bd19]"
          />
        </div>
      </div>

      {/* Analyzer Tabs */}
      <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex border-b border-slate-800 gap-4 overflow-x-auto text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'checklist' ? 'border-[#f2bd19] text-[#f2bd19]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📋 SEO Analysis ({analysis.items.filter((i) => i.category === 'seo').length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('readability')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'readability' ? 'border-[#f2bd19] text-[#f2bd19]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📖 Readability Metrics ({analysis.metrics.wordCount} words)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('internalLinks')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'internalLinks' ? 'border-[#f2bd19] text-[#f2bd19]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🔗 Internal Links ({linkSuggestions.length} found)
          </button>
        </div>

        {/* TAB 1: SEO CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-2">
            {analysis.items
              .filter((i) => i.category === 'seo')
              .map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    item.status === 'pass'
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : item.status === 'warn'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">
                      {item.status === 'pass' ? '🟢' : item.status === 'warn' ? '🟡' : '🔴'}
                    </span>
                    <div>
                      <span className="font-bold block text-slate-100">{item.label}</span>
                      <span className="text-[11px] opacity-90">{item.message}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* TAB 2: READABILITY METRICS */}
        {activeTab === 'readability' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Sentence Length</span>
                <p className="text-lg font-black text-white">{analysis.metrics.avgSentenceLength} words</p>
                <span className="text-[10px] text-slate-500">Target: &lt; 20 words</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Passive Voice</span>
                <p className="text-lg font-black text-white">{analysis.metrics.passiveVoicePercent}%</p>
                <span className="text-[10px] text-slate-500">Target: &lt; 15%</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Transition Words</span>
                <p className="text-lg font-black text-white">{analysis.metrics.transitionWordsPercent}%</p>
                <span className="text-[10px] text-slate-500">Target: &gt; 20%</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Keyword Density</span>
                <p className="text-lg font-black text-white">{analysis.metrics.keywordDensityPercent}%</p>
                <span className="text-[10px] text-slate-500">Target: 0.5% - 2.5%</span>
              </div>
            </div>

            <div className="space-y-2">
              {analysis.items
                .filter((i) => i.category === 'readability')
                .map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                      item.status === 'pass'
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                        : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{item.status === 'pass' ? '🟢' : '🟡'}</span>
                      <div>
                        <span className="font-bold block text-slate-100">{item.label}</span>
                        <span className="text-[11px] opacity-90">{item.message}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: INTERNAL LINKS SUGGESTIONS */}
        {activeTab === 'internalLinks' && (
          <div className="space-y-3">
            {copiedSnippet && (
              <div className="p-2.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold">
                Copied markdown link: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white">{copiedSnippet}</code>
              </div>
            )}

            {linkSuggestions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No matching internal link anchor phrases found in current content.
              </p>
            ) : (
              linkSuggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Phrase: "{s.phrase}"</span>
                      {s.isAlreadyLinked ? (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                          Already Linked
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                          Opportunity
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Points to: <span className="text-amber-400">{s.targetTitle}</span> ({s.targetPath})
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(s.markdownSnippet)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition shrink-0"
                  >
                    Copy Markdown Link
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
