'use client';

import React from 'react';
import { openCallModal } from '@/components/CallModal';

interface ComparisonRow {
  feature: string;
  oneStudioTitle: string;
  oneStudioDesc: string;
  typicalTitle: string;
  typicalDesc: string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Design Approach & Uniqueness',
    oneStudioTitle: '100% Bespoke & Unique',
    oneStudioDesc: 'Every inch is designed around your lifestyle. No two homes look the same.',
    typicalTitle: 'Catalog-Based & Cookie-Cutter',
    typicalDesc: 'You pick from pre-set modular lists; your kitchen looks just like your neighbor’s.',
  },
  {
    feature: 'VR & 3D Visual Walkthroughs',
    oneStudioTitle: 'Interactive 3D & VR Walkthroughs',
    oneStudioDesc: 'Experience your complete home interiors in immersive 3D before execution begins.',
    typicalTitle: 'No VR Walkthroughs',
    typicalDesc: 'Absence of advanced technology support; reliance on basic 2D drawings & guesswork.',
  },
  {
    feature: 'Manufacturing & Materials',
    oneStudioTitle: 'In-House German Factory',
    oneStudioDesc: '100% Branded materials (Hettich, Blum, Merino). No hidden costs for custom dimensions.',
    typicalTitle: 'Outsourced Third-Party Vendors',
    typicalDesc: 'Quality varies widely and extra charges apply for any custom customization.',
  },
  {
    feature: 'Quality Assurance',
    oneStudioTitle: '150+ Periodic Quality Checks',
    oneStudioDesc: 'Well-timed quality reviews at raw material, assembly, and finishing stages.',
    typicalTitle: 'No Periodic Inspections',
    typicalDesc: 'Usage of low-grade materials and skipped inspections to cut vendor costs.',
  },
  {
    feature: 'Solutions & Convenience',
    oneStudioTitle: 'All Under One Roof',
    oneStudioDesc: 'A one-stop destination for modular, woodwork, ceiling, electrical & styling.',
    typicalTitle: 'Multiple Contractors & Market Trips',
    typicalDesc: 'Coordination with 5+ intermediaries and 25+ exhausting market visits.',
  },
  {
    feature: 'Point of Contact & Team',
    oneStudioTitle: '1 Dedicated Project Manager & Designers',
    oneStudioDesc: 'Expert team providing innovative solutions with single-point accountability.',
    typicalTitle: 'Multiple Disconnected Handlers',
    typicalDesc: 'Sales, Design, and Operations are often disconnected, leading to costly errors.',
  },
  {
    feature: 'Pricing & Hidden Charges',
    oneStudioTitle: 'You Get What You See',
    oneStudioDesc: '100% Transparent pricing with easy EMIs, zero hidden charges, and no false claims.',
    typicalTitle: 'Over-Promising & Under-Delivery',
    typicalDesc: '45% budget hike between the initial quote and final completion.',
  },
  {
    feature: 'Timelines & Tracking',
    oneStudioTitle: '45-Day Guaranteed Delivery*',
    oneStudioDesc: 'Reliable execution schedules with proactive updates and live project tracking.',
    typicalTitle: 'Unreliable Timelines',
    typicalDesc: 'Frequent unexplained delays with zero proactive communication.',
  },
  {
    feature: 'Warranty Protection',
    oneStudioTitle: '15-Year Warranty on Woodwork*',
    oneStudioDesc: "India's first warranty covering both modular craftsmanship and interior service.",
    typicalTitle: 'No Formal Warranty',
    typicalDesc: 'No verifiable warranty offered for products, accessories, or services.',
  },
  {
    feature: 'After-Sales Support',
    oneStudioTitle: "We're Right by Your Side",
    oneStudioDesc: 'Dedicated rapid after-sales support team for long-term peace of mind.',
    typicalTitle: 'No After-Sales Support',
    typicalDesc: 'Customer service and contractor availability vanish after final handover.',
  },
];

export default function MaintenanceComparison() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 font-sans" id="the-one-studio-edge">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
            ✨ THE ONE STUDIO EDGE
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Why Homeowners Choose Us Over Others
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Your dream home interiors should be a happy experience, not a stressful one. From bespoke design to factory-precision execution, here is how we compare.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="relative overflow-hidden md:overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            
            {/* Table Header Row (Desktop Only) */}
            <div className="hidden md:contents font-black text-sm md:text-base">
              {/* Column 1: Feature Label Header */}
              <div className="md:col-span-3 bg-slate-50 p-6 border-b border-r border-slate-200 flex items-center justify-start text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                FEATURE
              </div>
              
              {/* Column 2: One Studio Header (Elevated & Highlighted) */}
              <div className="md:col-span-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white p-6 border-b border-amber-600 font-extrabold text-xl flex items-center justify-between shadow-md">
                <span className="flex items-center gap-2">
                  <span>👑 One Studio</span>
                </span>
                <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  Recommended
                </span>
              </div>
              
              {/* Column 3: Typical Experience Header */}
              <div className="md:col-span-4 bg-slate-100 text-slate-800 p-6 border-b border-slate-200 font-extrabold text-base flex items-center justify-between">
                <span>Other Companies / Typical Experience</span>
              </div>
            </div>

            {/* Table Body Rows */}
            {comparisonData.map((row, idx) => {
              const isLast = idx === comparisonData.length - 1;
              return (
                <div key={row.feature} className="contents group">
                  
                  {/* Feature Label Column (Left) */}
                  <div
                    className={`md:col-span-3 bg-slate-50/70 p-5 md:p-6 font-extrabold text-xs md:text-sm text-slate-900 tracking-wide flex items-center border-r border-slate-200/80 ${
                      !isLast ? 'border-b border-slate-200/60' : ''
                    }`}
                  >
                    {row.feature}
                  </div>

                  {/* One Studio Column (Center Highlighted) */}
                  <div
                    className={`md:col-span-5 bg-white p-5 md:p-6 space-y-1.5 border-r border-slate-200/80 ${
                      !isLast ? 'border-b border-slate-200/60' : ''
                    } transition-colors group-hover:bg-amber-50/40`}
                  >
                    {/* Mobile Label Badge */}
                    <div className="md:hidden text-xs font-black text-amber-700 uppercase tracking-wider mb-1">
                      👑 One Studio ({row.feature})
                    </div>
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

                  {/* Typical Experience Column (Right) */}
                  <div
                    className={`md:col-span-4 bg-slate-100/60 p-5 md:p-6 space-y-1.5 ${
                      !isLast ? 'border-b border-slate-200/60' : ''
                    }`}
                  >
                    {/* Mobile Label Badge */}
                    <div className="md:hidden text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                      Typical Experience
                    </div>
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
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-black text-xs md:text-sm uppercase tracking-wider px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            GET FREE CONSULTATION
          </button>
          
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            *15-year warranty on modular woodwork &amp; structural fittings and 45-day guaranteed installation applicable per official One Studio specification agreement.
          </p>
        </div>
      </div>
    </section>
  );
}
