'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import { openCallModal } from '@/components/CallModal';
import Link from 'next/link';

const LUXE_ESTATES = [
  {
    num: '01',
    title: 'The Jubilee Hills Italian Veneer Villa',
    subtitle: '6,500 Sq.Ft Private Residence',
    location: 'Jubilee Hills, Hyderabad',
    image: '/images/luxury_living_room_hero.png',
    architectQuote: 'Smoked eucalyptus veneers paired with double-height brass inlay walls.',
    tags: ['Italian Smoked Veneer', 'PU High Gloss', 'Blum Legrabox', 'Automated Lighting'],
    highlights: [
      'Handcrafted smoked eucalyptus veneer wall paneling with brushed brass inlays',
      'Floor-to-ceiling motorized sliding glass wardrobes with motion sensor illumination',
      'Custom quartz island kitchen with concealed wine cellar & Miele appliances',
      'Acoustically engineered private home theater paneling with acoustic felt backing',
    ],
  },
  {
    num: '02',
    title: 'The Banjara Hills Sky Penthouse',
    subtitle: '4,800 Sq.Ft Duplex Penthouse',
    location: 'Banjara Hills, Hyderabad',
    architectQuote: 'Lacquered glass minimalism combined with book-matched Calacatta marble.',
    image: '/images/luxury_modular_kitchen.png',
    tags: ['Quartz Countertops', 'Lacquered Glass', 'Hettich AvanTech', 'Fluted Louvers'],
    highlights: [
      'Lacquered glass modular kitchen with integrated Sub-Zero cooling drawers',
      'Double-height living room chandelier wall with 24K gold foil accent trim',
      'Master bedroom walk-in closet with velvet-lined jewelry drawers & digital lock boxes',
      'Custom vanity units with book-matched Italian Calacatta marble',
    ],
  },
  {
    num: '03',
    title: 'The Financial District Signature Estate',
    subtitle: '5,200 Sq.Ft Luxury Apartment',
    location: 'Gachibowli, Hyderabad',
    architectQuote: 'Zero-joint German CNC joinery with smart magnetic track dimming.',
    image: '/images/luxury_master_bedroom.png',
    tags: ['100% BWP Marine Ply', 'Custom Metal Inlay', 'Smart Home Integration'],
    highlights: [
      'Custom brass-inlaid fluted wood partitions in private foyer & formal lounge',
      'Zero-VOC anti-bacterial PU polish finishes on all bespoke woodwork',
      'Concealed magnetic architectural track LED lighting with automated scene dimming',
      '100% factory precision German CNC modular joinery with zero edge seams',
    ],
  },
];

const LUXE_MATERIALS = [
  {
    num: 'I',
    name: 'Italian Smoked Veneer',
    tier: 'Hand-Selected European Wood',
    desc: 'Deep grain texture imported from Northern Italy, cured with zero-yellowing matte lacquer.',
    tag: 'Veneer Finish',
  },
  {
    num: 'II',
    name: 'High-Gloss PU Polish',
    tier: '7-Coat Mirror Lacquer',
    desc: 'Polyurethane polish baked in dust-free spray chambers for flawless mirror reflection.',
    tag: 'Ultra-Gloss',
  },
  {
    num: 'III',
    name: 'Calacatta Gold Quartz',
    tier: 'Book-Matched Stone',
    desc: 'Stain-resistant, scratch-proof Quartz surfaces with dramatic gold and warm gray veining.',
    tag: 'Countertop',
  },
  {
    num: 'IV',
    name: 'Brushed Champagne Brass',
    tier: 'Solid Brass Profiles',
    desc: 'Custom extruded aluminum and solid brass profiles for door frames, louvers, and ceiling accents.',
    tag: 'Metal Accent',
  },
];

const ROYAL_PILLARS = [
  {
    badge: 'CONCIERGE',
    title: 'Private Executive Concierge',
    desc: '24/7 direct priority access to your Senior Principal Architect & Private Site Director with zero-waiting response.',
  },
  {
    badge: 'AUTHENTICITY',
    title: 'Certified Italian Origin',
    desc: 'Stamped certificate of origin for all imported smoked eucalyptus veneers, Italian Calacatta quartz & lacquered glass.',
  },
  {
    badge: 'PRIVACY',
    title: 'Strict VVIP Privacy & NDA',
    desc: '100% confidential project execution with zero public site photography or publishing without owner written consent.',
  },
  {
    badge: 'CRAFTSMANSHIP',
    title: '24K Gold Inlay & Brass Detailing',
    desc: 'Hand-burnished solid brass profiles, gold foil moldings, and micro-precision flush joint trims engineered to 0.2mm tolerance.',
  },
  {
    badge: 'GUARANTEE',
    title: 'Zero-Delay Financial Clause',
    desc: 'Strict 45 to 55-day completion contract backed by a ₹10,000/day penalty payout directly credited for any handover delay.',
  },
  {
    badge: 'WELLNESS',
    title: 'Zero-VOC Bio-Safe Polish',
    desc: 'Eco-certified non-toxic Italian PU polishes ensuring 100% pure indoor air quality for your family from Day 1.',
  },
  {
    badge: 'ROYAL CARE',
    title: 'Lifetime Royal Maintenance',
    desc: 'Complementary semi-annual architectural polish, hardware alignment, and LED health checkups for lifetime peace of mind.',
  },
];

const LUXE_SPECS = [
  {
    num: '01',
    title: 'Master Craftsmen Finish',
    desc: 'Hand-selected European veneers, high-gloss PU polish, and precision brass inlays engineered to 0.5mm tolerance.',
  },
  {
    num: '02',
    title: 'Ultra-Luxury German Hardware',
    desc: 'Blum Legrabox, Hettich AvanTech, and Salice concealed hinges tested for 300,000+ silent cycles.',
  },
  {
    num: '03',
    title: 'Private Principal Architect',
    desc: 'Dedicated Senior Principal Architect and Site Director overseeing every single millimeter of your space.',
  },
  {
    num: '04',
    title: '15-Year Structural Warranty',
    desc: 'Extended 15-year warranty on BWP marine plywood woodwork with lifetime dedicated after-sales concierge care.',
  },
];

export default function LuxePage() {
  const [activeEstate, setActiveEstate] = useState(LUXE_ESTATES[0]);
  const [vibeTier, setVibeTier] = useState<'villa' | 'penthouse' | 'duplex'>('villa');

  const luxeEst: Record<string, { price: string; timeline: string; sqft: string }> = {
    villa: { price: '₹22L - ₹35L+', timeline: '55 Days', sqft: '4,500 - 8,000 sq.ft' },
    penthouse: { price: '₹18L - ₹28L', timeline: '45 Days', sqft: '3,500 - 5,500 sq.ft' },
    duplex: { price: '₹15L - ₹22L', timeline: '40 Days', sqft: '2,800 - 4,200 sq.ft' },
  };

  return (
    <>
      <Header />
      <main className="bg-black text-white font-sans overflow-x-hidden selection:bg-amber-400 selection:text-black">
        {/* Ultra-Luxury Full-Bleed Obsidian Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 border-b border-amber-500/30">
          {/* Ambient Lighting & Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/luxury_living_room_hero.png"
              alt="One Studio Luxe Interior"
              className="w-full h-full object-cover brightness-[0.22] scale-105 filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0,transparent_75%)]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
            {/* Shimmering Crest Badge */}
            <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-black/90 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(212,175,55,0.25)]">
              <span>👑</span>
              <span className="text-gold-foil">ONE STUDIO LUXE COLLECTION</span>
            </div>

            {/* Serif Luxury Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-white">
              Bespoke Architectural Mastery <br className="hidden sm:inline" />
              <span className="font-serif-luxe italic text-gold-foil font-bold block mt-2">
                Designed for Royalty
              </span>
            </h1>

            <p className="text-slate-300 text-base md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              Uncompromising craftsmanship, Italian veneers, automated lighting, and bespoke joinery engineered for Hyderabad’s most exclusive addresses in Jubilee Hills, Banjara Hills &amp; Gachibowli.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={openCallModal}
                className="bg-gold-foil text-black font-black text-xs md:text-sm uppercase tracking-[0.2em] px-9 py-4 rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.35)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 group"
              >
                <span>Book VIP Studio Session</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <Link
                href="/estimate"
                className="bg-black/90 hover:bg-neutral-950 text-amber-300 font-extrabold text-xs md:text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-2xl border border-amber-500/40 shadow-xl transition-all hover:border-amber-400"
              >
                Luxe Cost Calculator ⚡
              </Link>
            </div>

            {/* 4 Luxe Highlights Strip */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-amber-500/20 max-w-4xl mx-auto text-left">
              {[
                { label: 'Craftsmanship', val: 'Italian Veneer & PU' },
                { label: 'Hardware', val: 'Blum & Hettich German' },
                { label: 'Warranty', val: '15-Year Structural' },
                { label: 'Execution', val: 'Guaranteed 45-55 Days' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1 bg-neutral-950/80 p-4 rounded-2xl border border-amber-500/30 shadow-inner">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">{item.label}</p>
                  <p className="text-sm font-black text-white">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Manifesto Quote Section */}
        <section className="py-20 bg-neutral-950 border-b border-amber-500/20 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <span className="text-4xl text-amber-400 font-serif-luxe block">“</span>
            <blockquote className="text-xl sm:text-3xl md:text-4xl font-serif-luxe italic font-extrabold text-slate-100 leading-relaxed max-w-4xl mx-auto">
              Architecture is not merely about space; it is the art of sculpting your family legacy. Every veneer grain, every concealed light, every brass joint is engineered with zero compromise.
            </blockquote>
            <div className="pt-2">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gold-foil">
                PRINCIPAL ARCHITECT • ONE STUDIO LUXE
              </p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                Jubilee Hills Experience Studio • Hyderabad
              </p>
            </div>
          </div>
        </section>

        {/* Staggered Editorial Showcase of Master Residences */}
        <section className="py-24 max-w-7xl mx-auto px-4 space-y-20">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
              🏛️ EDITORIAL ARCHITECTURAL SHOWCASE
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Master Residences <span className="font-serif-luxe italic text-gold-foil">Collection</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Explore bespoke architectural executions crafted for ultra-HNW homeowners in Hyderabad.
            </p>
          </div>

          {/* Interactive Asymmetric Editorial Grid */}
          <div className="space-y-16">
            {LUXE_ESTATES.map((estate, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={estate.num}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 md:p-12 rounded-[44px] bg-neutral-950 border border-amber-500/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-500 ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Image Column */}
                  <div className={`lg:col-span-7 relative h-[360px] md:h-[480px] rounded-[32px] overflow-hidden border border-amber-500/40 shadow-2xl group ${isEven ? '' : 'lg:order-2'}`}>
                    <img
                      src={estate.image}
                      alt={estate.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {/* Oversized Roman Numeral Overlay */}
                    <div className="absolute top-6 left-6 font-serif-luxe text-5xl font-extrabold text-gold-foil opacity-90 drop-shadow-lg">
                      {estate.num}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                      <span className="bg-gold-foil text-black font-black text-xs uppercase px-4 py-1.5 rounded-full tracking-wider shadow-lg">
                        📍 {estate.location}
                      </span>
                      <span className="text-amber-300 font-bold text-xs bg-black/90 px-4 py-1.5 rounded-full border border-amber-500/40">
                        {estate.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-5 space-y-6 ${isEven ? '' : 'lg:order-1'}`}>
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                        ESTATE EDITION {estate.num}
                      </span>
                      <h3 className="text-2xl md:text-4xl font-black text-white leading-tight font-serif-luxe italic">
                        {estate.title}
                      </h3>
                      <p className="text-xs text-amber-300 font-serif-luxe italic border-l-2 border-amber-400 pl-3 py-1">
                        “{estate.architectQuote}”
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-black text-amber-400 uppercase tracking-widest">
                        Architectural Highlights:
                      </p>
                      <ul className="space-y-2.5">
                        {estate.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                            <span className="text-amber-400 font-bold shrink-0 mt-0.5">✦</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={openCallModal}
                        className="bg-gold-foil text-black font-black text-xs uppercase tracking-[0.18em] px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      >
                        Request Private Floor Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Asymmetric Material Swatches & Finishes Grid */}
        <section className="py-24 bg-neutral-950/90 border-t border-b border-amber-500/30">
          <div className="max-w-7xl mx-auto px-4 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
                🎨 HANDPICKED LUXURY MATERIALS
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Imported Finishes &amp; <span className="font-serif-luxe italic text-gold-foil">Metals</span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-medium">
                Every surface is crafted using authentic European wood veneers, Italian natural quartz, and solid brass architectural trims.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {LUXE_MATERIALS.map((mat, mIdx) => (
                <div
                  key={mIdx}
                  className="bg-black p-7 rounded-[32px] border border-amber-500/30 hover:border-amber-400/80 shadow-2xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/15 border border-amber-500/40 px-3 py-1 rounded-full">
                        {mat.tag}
                      </span>
                      <span className="font-serif-luxe text-xl font-bold text-amber-400">{mat.num}</span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-1 group-hover:text-amber-300 transition-colors font-serif-luxe italic">
                      {mat.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-400/80 mb-3">{mat.tier}</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {mat.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs font-black text-amber-400">
                    <span>Luxe Grade</span>
                    <span>100% Certified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7 Royal VVIP Pillars of One Studio Luxe */}
        <section className="py-24 max-w-7xl mx-auto px-4 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              👑 THE 7 ROYAL GUARANTEES
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Royale Standards of <span className="font-serif-luxe italic text-gold-foil">Excellence</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Every One Studio Luxe project is governed by strict VVIP protocols, certified authenticity, and guaranteed financial penalties for any delivery delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROYAL_PILLARS.map((pillar, pIdx) => (
              <div
                key={pIdx}
                className="bg-neutral-950 p-8 rounded-[36px] border border-amber-500/30 hover:border-amber-400/80 shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 bg-amber-500/15 border border-amber-500/40 px-3.5 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                    <span className="text-amber-400 font-serif-luxe text-xl font-bold">0{pIdx + 1}</span>
                  </div>
                  <h3 className="text-xl font-black text-white font-serif-luxe italic group-hover:text-amber-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs font-black text-amber-400">
                  <span>Royal Standard</span>
                  <span>✦ ✦ ✦</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Luxe Technical Specifications Grid */}
        <section className="py-24 max-w-7xl mx-auto px-4 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
              ⚙️ ARCHITECTURAL BENCHMARKS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Engineering Perfection in <span className="font-serif-luxe italic text-gold-foil">Every Detail</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              We combine imported European materials with German CNC precision to deliver unmatched luxury finishes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LUXE_SPECS.map((spec, sIdx) => (
              <div
                key={sIdx}
                className="bg-neutral-950 p-8 rounded-[32px] border border-amber-500/30 hover:border-amber-400/80 shadow-2xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif-luxe text-2xl font-black text-amber-400">{spec.num}</span>
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full uppercase">
                      LUXE SPEC
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {spec.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {spec.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs font-extrabold text-amber-400">
                  <span>Luxe Certified</span>
                  <span>✓</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Luxe Estimator Widget */}
        <section className="py-24 max-w-4xl mx-auto px-4 text-center space-y-10">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
              💎 LUXE INVESTMENT GUIDE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Estimate Your Villa / Penthouse Project
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Select your luxury residence layout for instant ballpark investment estimates.
            </p>
          </div>

          {/* Vibe Selection Tabs */}
          <div className="flex flex-wrap justify-center gap-3 p-1.5 bg-neutral-950 rounded-2xl border border-neutral-800 max-w-fit mx-auto">
            {[
              { id: 'villa', label: 'Luxury Villa (4,500+ sq.ft)' },
              { id: 'penthouse', label: 'Sky Penthouse (3,500+ sq.ft)' },
              { id: 'duplex', label: 'Duplex Apartment (2,800+ sq.ft)' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVibeTier(v.id as any)}
                className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  vibeTier === v.id
                    ? 'bg-gold-foil text-black shadow-lg font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-r from-black via-neutral-950 to-black p-8 md:p-10 rounded-[36px] border border-amber-500/40 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Estimated Investment</p>
              <p className="text-3xl font-black text-white mt-1">{luxeEst[vibeTier].price}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Handover Timeline</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{luxeEst[vibeTier].timeline}</p>
            </div>
            <button
              type="button"
              onClick={openCallModal}
              className="bg-gold-foil text-black font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl shadow-xl transition-all cursor-pointer"
            >
              Request Custom Itemized BOQ →
            </button>
          </div>
        </section>

        {/* Theme Styled FAQ */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
