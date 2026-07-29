'use client';

import React, { useState } from 'react';

interface SerpPreviewProps {
  title: string;
  description: string;
  url: string;
  focusKeyword?: string;
}

export default function SerpPreview({
  title,
  description,
  url,
  focusKeyword = '',
}: SerpPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const displayTitle = title.trim() || 'Page Title — One Studio';
  const displayDesc = description.trim() || 'Please provide a meta description for this page to preview how it will appear on Google search results.';
  const displayUrl = url.trim() || 'https://www.onestudio.in';

  // Highlight focus keyword if present
  const highlightKeyword = (text: string) => {
    if (!focusKeyword.trim()) return text;
    const parts = text.split(new RegExp(`(${focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === focusKeyword.toLowerCase() ? (
        <strong key={i} className="font-extrabold text-slate-900 bg-yellow-100 dark:bg-yellow-900/40 px-0.5 rounded">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const titleLength = displayTitle.length;
  const descLength = displayDesc.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Google SERP Live Simulator
          </h3>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              device === 'desktop' ? 'bg-orange-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            💻 Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              device === 'mobile' ? 'bg-orange-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📱 Mobile
          </button>
        </div>
      </div>

      {/* Google Result Box */}
      <div
        className={`bg-white text-slate-900 p-5 rounded-2xl border border-slate-200 transition-all ${
          device === 'mobile' ? 'max-w-[360px] mx-auto shadow-md' : 'w-full'
        }`}
      >
        {/* Favicon + Site Info */}
        <div className="flex items-center gap-2 mb-1.5 text-xs text-[#202124]">
          <div className="w-5 h-5 rounded-full bg-[#f2bd19] text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">
            OS
          </div>
          <div className="truncate">
            <span className="font-semibold text-slate-900 block leading-tight text-[12px]">One Studio</span>
            <span className="text-[11px] text-[#5f6368] truncate block leading-tight">{displayUrl}</span>
          </div>
        </div>

        {/* Title Tag */}
        <h4 className="text-[#1a0dab] hover:underline text-lg md:text-xl font-normal leading-snug cursor-pointer line-clamp-1 mb-1">
          {highlightKeyword(displayTitle)}
        </h4>

        {/* Description Tag */}
        <p className="text-[#4d5156] text-xs md:text-sm leading-relaxed line-clamp-2">
          {highlightKeyword(displayDesc)}
        </p>
      </div>

      {/* Length Health Checkers */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold">
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400">Title Length:</span>
          <span
            className={`${
              titleLength >= 45 && titleLength <= 60
                ? 'text-emerald-400 font-bold'
                : 'text-amber-400 font-bold'
            }`}
          >
            {titleLength} / 60 chars {titleLength >= 45 && titleLength <= 60 ? '✓' : '⚠️'}
          </span>
        </div>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400">Meta Desc Length:</span>
          <span
            className={`${
              descLength >= 120 && descLength <= 160
                ? 'text-emerald-400 font-bold'
                : 'text-amber-400 font-bold'
            }`}
          >
            {descLength} / 160 chars {descLength >= 120 && descLength <= 160 ? '✓' : '⚠️'}
          </span>
        </div>
      </div>
    </div>
  );
}
