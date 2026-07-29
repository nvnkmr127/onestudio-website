import React from 'react';

const track1 = [
  { name: 'Hettich', desc: 'German Soft-Close Hardware', category: 'Hardware', icon: 'door_sliding' },
  { name: 'Blum', desc: 'Precision Kitchen Runners', category: 'Modular', icon: 'kitchen' },
  { name: 'Merino', desc: 'High-Gloss Acrylic Laminates', category: 'Finishing', icon: 'layers' },
  { name: 'CenturyPly', desc: 'BWP Marine 710 Plywood', category: 'Woodwork', icon: 'table_restaurant' },
  { name: 'Saint-Gobain', desc: 'Acoustic Glass & Mirrors', category: 'Glass', icon: 'window' },
  { name: 'Hafele', desc: 'Ergonomic Kitchen Systems', category: 'Fittings', icon: 'handyman' },
];

const track2 = [
  { name: 'Jaquar', desc: 'Luxury Bath & Lighting', category: 'Bathware', icon: 'water_drop' },
  { name: 'Kohler', desc: 'Premium Sanitaryware', category: 'Sanitary', icon: 'bathtub' },
  { name: 'Asian Paints', desc: 'Royale Luxury Emulsions', category: 'Finishing', icon: 'format_paint' },
  { name: 'Philips', desc: 'Automated Cove LED Lighting', category: 'Electrical', icon: 'lightbulb' },
  { name: 'Schneider', desc: 'Smart Home Automation', category: 'Automation', icon: 'power' },
  { name: 'Greenply', desc: 'Termite-Proof Interior Plywood', category: 'Woodwork', icon: 'carpenter' },
];

export default function Brands() {
  return (
    <section className="py-16 bg-white border-y border-slate-100 text-slate-900 overflow-hidden relative">
      {/* Edge Gradient Fades for Seamless Vignette Effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold uppercase tracking-widest mb-3 shadow-sm">
          ✨ 100% Genuine Materials &amp; Hardware Guarantee
        </span>
        <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
          Luxury Interior Brand Partners We Build With
        </h3>
        <p className="text-slate-600 text-sm font-medium max-w-xl mx-auto">
          We source directly from trusted global interior &amp; woodwork manufacturers to ensure 150+ quality benchmarks on every square foot.
        </p>
      </div>

      {/* Dual Track Marquees */}
      <div className="space-y-6">
        {/* Track 1 (Scrolls Left) */}
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max space-x-6 animate-marquee-slow hover:[animation-play-state:paused]">
            {[...track1, ...track1].map((b, i) => (
              <div
                key={`t1-${i}`}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[260px] hover:border-amber-500 hover:bg-white transition-all hover:scale-[1.02] shadow-sm hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-2xl">{b.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                      {b.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      {b.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2 (Scrolls Right - Reverse) */}
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max space-x-6 animate-marquee-reverse hover:[animation-play-state:paused]">
            {[...track2, ...track2].map((b, i) => (
              <div
                key={`t2-${i}`}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[260px] hover:border-amber-500 hover:bg-white transition-all hover:scale-[1.02] shadow-sm hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-2xl">{b.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                      {b.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                      {b.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
