'use client';

import { useState } from 'react';
import Link from 'next/link';

const BHK_OPTIONS = [
  { label: '1 BHK', sqft: 600 },
  { label: '2 BHK', sqft: 900 },
  { label: '3 BHK', sqft: 1350 },
  { label: '4 BHK', sqft: 1800 },
  { label: 'Villa', sqft: 3000 },
];

// ₹ per sqft estimate ranges
const TIER = {
  essential: { rate: 1200, label: 'Essential' },
  premium:   { rate: 1600, label: 'Premium' },
  luxury:    { rate: 2200, label: 'Luxury' },
};

function fmt(n: number) {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

export default function CostCalculatorTeaser() {
  const [selectedBhk, setSelectedBhk] = useState(BHK_OPTIONS[1]);

  return (
    <section className="py-20 md:py-24 bg-white font-sans" id="cost-estimate">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Headline */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
              💡 Instant Cost Estimate
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              How Much Will Your<br />
              <span className="text-amber-500">Interior Cost?</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed max-w-md">
              Get a rough ballpark in seconds. Select your apartment size to see tier-wise estimates. For a detailed itemized quote, use our full calculator.
            </p>
            <Link
              href="/estimate"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider px-7 py-3.5 rounded-full shadow-md hover:-translate-y-0.5 transition-all"
            >
              Detailed Interior Estimator →
            </Link>
          </div>

          {/* Right: Quick Estimator Card */}
          <div className="bg-slate-950 rounded-3xl p-7 md:p-8 space-y-6 shadow-2xl border border-slate-800">
            {/* BHK selector */}
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Select Apartment Size</p>
              <div className="flex flex-wrap gap-2">
                {BHK_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedBhk(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                      selectedBhk.label === opt.label
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {opt.label}
                    <span className="block text-[9px] font-normal opacity-70">{opt.sqft} sqft</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tier estimates */}
            <div className="space-y-3">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Estimated Range</p>
              {Object.values(TIER).map((tier) => {
                const low = selectedBhk.sqft * tier.rate;
                const high = selectedBhk.sqft * tier.rate * 1.2;
                const isMiddle = tier.label === 'Premium';
                return (
                  <div
                    key={tier.label}
                    className={`flex items-center justify-between rounded-2xl px-5 py-3.5 ${
                      isMiddle
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-black uppercase tracking-wider ${isMiddle ? 'text-slate-950' : 'text-slate-300'}`}>
                        {tier.label}
                        {isMiddle && <span className="ml-2 text-[9px] bg-slate-950/20 px-1.5 py-0.5 rounded-full">Most Chosen</span>}
                      </div>
                      <div className={`text-[10px] font-medium ${isMiddle ? 'text-slate-950/70' : 'text-slate-400'}`}>
                        ₹{tier.rate}/sqft
                      </div>
                    </div>
                    <div className={`text-xl font-black ${isMiddle ? 'text-slate-950' : 'text-white'}`}>
                      {fmt(low)} – {fmt(high)}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-slate-500 text-[10px] font-medium text-center leading-relaxed">
              Estimates are indicative. Final price depends on materials, add-ons &amp; site conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
