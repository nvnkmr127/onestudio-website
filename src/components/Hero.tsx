'use client';

import { useState } from 'react';
import LocationAutocomplete from '@/components/LocationAutocomplete';

const INTERIOR_THEMES = [
  { id: 'living',  label: 'Living Room',    image: '/images/luxury_living_room_hero.png' },
  { id: 'kitchen', label: 'Modular Kitchen', image: '/images/luxury_modular_kitchen.png' },
  { id: 'bedroom', label: 'Bedroom',         image: '/images/luxury_master_bedroom.png' },
  { id: 'villa',   label: 'Complete Villa',  image: '/images/luxury_living_room_hero.png' },
];

export default function Hero() {
  const [activeTheme, setActiveTheme] = useState(INTERIOR_THEMES[0]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 font-sans">

      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <img
          key={activeTheme.image}
          alt={activeTheme.label}
          src={activeTheme.image}
          className="w-full h-full object-cover animate-in fade-in duration-700"
          style={{ filter: 'brightness(0.45)' }}
        />
        {/* Dark left gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Headline + CTA minimal ── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-amber-400 block" />
              <span className="text-amber-400 text-xs font-black uppercase tracking-[0.2em]">
                Hyderabad&apos;s Luxury Interior Studio
              </span>
            </div>

            {/* Main headline — large & clean */}
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight">
              Bespoke Interiors<br />
              <span className="text-amber-400">Crafted for You.</span>
            </h1>

            {/* One short supporting line */}
            <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed max-w-lg">
              End-to-end luxury interiors — 45-day delivery, 150+ quality checks &amp; 15-year warranty.
            </p>

            {/* Room-type switcher — minimal pill tabs */}
            <div className="flex flex-wrap gap-2">
              {INTERIOR_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setActiveTheme(theme)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTheme.id === theme.id
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>

            {/* Three trust stats — clean horizontal row */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { value: '1,500+', label: 'Homes Delivered' },
                { value: '4.9★',   label: 'Google Rating' },
                { value: '15-Yr',  label: 'Warranty' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-white text-2xl font-black">{stat.value}</div>
                  <div className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Consultation Form ── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-2xl w-full max-w-md mx-auto lg:ml-auto border border-slate-100">
              <div className="text-center space-y-1 mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest border border-amber-200">
                  Free Designer Consultation
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
                  Book a Studio Visit
                </h3>
                <p className="text-slate-500 text-xs font-medium">
                  Get a custom 3D design &amp; itemized quote — free.
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="Your full name"
                  type="text"
                  required
                />
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="Mobile number"
                  type="tel"
                  required
                />
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-semibold focus:outline-none focus:border-amber-500 transition-all"
                  defaultValue="3 BHK / 4 BHK Apartment"
                >
                  <option>2 BHK Apartment</option>
                  <option>3 BHK / 4 BHK Apartment</option>
                  <option>Independent Luxury Villa</option>
                  <option>Penthouse / Duplex</option>
                  <option>Commercial Office Space</option>
                </select>
                <LocationAutocomplete />

                <button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer mt-1 flex items-center justify-center gap-2 group"
                  type="submit"
                >
                  <span>Talk to a Designer</span>
                  <svg className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  🔒 Zero spam. Instant callback.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
