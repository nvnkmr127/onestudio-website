'use client';

import React, { useState, useRef } from 'react';
import { openCallModal } from '@/components/CallModal';

const comparisonData = [
  {
    feature: 'Project Timelines & Guarantees',
    oneStudioTitle: 'Guaranteed 45-Day Handover',
    oneStudioDesc: 'Strict penalty clause for delays. Detailed day-by-day milestone schedule.',
    typicalTitle: 'Frequent Uncontrolled Delays',
    typicalDesc: 'Projects drag on for months beyond verbal promises with zero accountability.',
  },
  {
    feature: 'Pricing & Cost Transparency',
    oneStudioTitle: '100% Price Lock Guarantee',
    oneStudioDesc: 'Zero hidden costs after contract signing. Itemized BOQ before booking.',
    typicalTitle: 'Continuous Cost Escalations',
    typicalDesc: 'Initial low quotes followed by 20-30% surprise extra charges during execution.',
  },
  {
    feature: 'Woodwork & Material Quality',
    oneStudioTitle: '100% BWP Marine Plywood & German CNC',
    oneStudioDesc: 'Boiling waterproof plywood with factory edge-banding & Hettich/Blum hardware.',
    typicalTitle: 'Sub-Standard Local Carpentry',
    typicalDesc: 'Cheap commercial ply, manual edge banding that peels, and non-branded hinges.',
  },
  {
    feature: 'Quality Audits & Inspection',
    oneStudioTitle: '150+ Standardized Quality Checks',
    oneStudioDesc: 'Dedicated quality auditor inspects moisture levels, alignment, and finishing.',
    typicalTitle: 'Zero Independent Quality Control',
    typicalDesc: 'Carpenters inspect their own work; quality depends entirely on individual labor.',
  },
  {
    feature: 'Site Progress Tracking',
    oneStudioTitle: 'Live 3D App Tracking & Daily Photos',
    oneStudioDesc: 'Monitor daily HD photo updates and stage audit reports directly on your phone.',
    typicalTitle: 'Endless Site Visits Required',
    typicalDesc: 'You have to personally visit the site daily to manage contractors and check work.',
  },
  {
    feature: 'Payment Security',
    oneStudioTitle: 'Safe Stage Milestone Payment System',
    oneStudioDesc: 'Payments are released ONLY after you approve each completed inspection stage.',
    typicalTitle: 'High Upfront Advances',
    typicalDesc: 'Demands 50%+ advance payment before work starts, leaving you with no leverage.',
  },
  {
    feature: 'Warranty & Post-Handover Care',
    oneStudioTitle: '10-Year Warranty & Free Service',
    oneStudioDesc: 'Official warranty certificate with 1-year free post-handover maintenance support.',
    typicalTitle: 'Zero After-Sales Support',
    typicalDesc: 'Contractor availability vanishes immediately after receiving final payment.',
  },
];

export default function MaintenanceComparison() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeCardIndex < comparisonData.length - 1) {
      setActiveCardIndex((prev) => prev + 1);
    }
    if (isRightSwipe && activeCardIndex > 0) {
      setActiveCardIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="py-16 md:py-28 bg-slate-50 font-sans" id="the-one-studio-edge">
      <div className="max-w-7xl mx-auto px-4 space-y-10 md:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 md:space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-950 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
            ✨ THE ONE STUDIO EDGE
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Why Homeowners Choose Us Over Others
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Your dream home interiors should be a happy experience, not a stressful one. From bespoke design to factory-precision execution, here is how we compare.
          </p>
        </div>

        {/* Mobile Touch Swipe Gesture Slider (< md breakpoint) */}
        <div className="md:hidden space-y-4">
          {/* Controls Bar */}
          <div className="flex items-center justify-between px-2 text-xs font-black text-slate-700">
            <span className="bg-amber-500/15 text-amber-900 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
              👈 SWIPE TO COMPARE ({activeCardIndex + 1} / {comparisonData.length})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveCardIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeCardIndex === 0}
                className="w-8 h-8 rounded-full bg-slate-200 disabled:opacity-30 text-slate-900 flex items-center justify-center font-black text-sm cursor-pointer"
                aria-label="Previous card"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setActiveCardIndex((prev) => Math.min(comparisonData.length - 1, prev + 1))}
                disabled={activeCardIndex === comparisonData.length - 1}
                className="w-8 h-8 rounded-full bg-amber-500 disabled:opacity-30 text-slate-950 flex items-center justify-center font-black text-sm shadow-md cursor-pointer"
                aria-label="Next card"
              >
                →
              </button>
            </div>
          </div>

          {/* Touch Swipeable Container */}
          <div
            className="relative overflow-hidden touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeCardIndex * 100}%)` }}
            >
              {comparisonData.map((row, idx) => (
                <div key={row.feature} className="w-full shrink-0 px-1">
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        0{idx + 1}. {row.feature}
                      </span>
                    </div>

                    {/* One Studio Box (Golden Highlight) */}
                    <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 border border-amber-500/40 rounded-2xl p-4 space-y-1.5 shadow-inner">
                      <div className="flex items-center justify-between text-amber-950 font-black text-xs uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <span className="text-amber-600">👑</span> One Studio
                        </span>
                        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md text-[9px] font-black">
                          RECOMMENDED ✓
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-slate-950">{row.oneStudioTitle}</h4>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{row.oneStudioDesc}</p>
                    </div>

                    {/* Typical Experience Box */}
                    <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-4 space-y-1.5">
                      <div className="text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-slate-400">✕</span> Typical Experience
                      </div>
                      <h4 className="font-bold text-sm text-slate-700">{row.typicalTitle}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{row.typicalDesc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-1.5 pt-2">
            {comparisonData.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setActiveCardIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeCardIndex === dotIdx ? 'w-6 bg-amber-500' : 'w-2 bg-slate-300'
                }`}
                aria-label={`Go to card ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Table View (>= md breakpoint) */}
        <div className="hidden md:block relative overflow-hidden">
          <div className="grid grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Table Header Row */}
            <div className="col-span-12 grid grid-cols-12 font-black text-sm md:text-base">
              <div className="col-span-3 bg-slate-50 p-6 border-b border-r border-slate-200 flex items-center justify-start text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                FEATURE
              </div>
              <div className="col-span-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white p-6 border-b border-amber-600 font-extrabold text-xl flex items-center justify-between shadow-md">
                <span className="flex items-center gap-2">
                  <span>👑 One Studio</span>
                </span>
                <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  Recommended
                </span>
              </div>
              <div className="col-span-4 bg-slate-100 text-slate-800 p-6 border-b border-slate-200 font-extrabold text-base flex items-center justify-between">
                <span>Other Companies / Typical Experience</span>
              </div>
            </div>

            {/* Table Body Rows */}
            {comparisonData.map((row, idx) => {
              const isLast = idx === comparisonData.length - 1;
              return (
                <div key={row.feature} className="col-span-12 grid grid-cols-12 group">
                  {/* Feature Label Column */}
                  <div
                    className={`col-span-3 bg-slate-50/70 p-5 md:p-6 font-extrabold text-xs md:text-sm text-slate-900 tracking-wide flex items-center border-r border-slate-200/80 ${
                      !isLast ? 'border-b border-slate-200/60' : ''
                    }`}
                  >
                    {row.feature}
                  </div>

                  {/* One Studio Column */}
                  <div
                    className={`col-span-5 bg-white p-5 md:p-6 space-y-1.5 border-r border-slate-200/80 ${
                      !isLast ? 'border-b border-slate-200/60' : ''
                    } transition-colors group-hover:bg-amber-50/40`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-amber-500 font-black text-lg leading-none shrink-0 mt-0.5">•</span>
                      <div>
                        <h4 className="font-black text-sm md:text-base text-slate-900 leading-snug">
                          {row.oneStudioTitle}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed mt-0.5">
                          {row.oneStudioDesc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Typical Experience Column */}
                  <div
                    className={`col-span-4 bg-slate-100/60 p-5 md:p-6 space-y-1.5 ${
                      !isLast ? 'border-b border-slate-200/60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-slate-400 font-bold text-lg leading-none shrink-0 mt-0.5">•</span>
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-slate-700 leading-snug">
                          {row.typicalTitle}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mt-0.5">
                          {row.typicalDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section & Footnote */}
        <div className="text-center space-y-4 pt-4">
          <button
            type="button"
            onClick={openCallModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            GET FREE CONSULTATION
          </button>
          
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            *10-year warranty on modular woodwork &amp; hardware fittings and 45-day guaranteed installation applicable per official One Studio specification agreement.
          </p>
        </div>
      </div>
    </section>
  );
}
