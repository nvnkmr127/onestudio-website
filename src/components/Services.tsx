'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { openCallModal } from '@/components/CallModal';

const SERVICES = [
  {
    id: 'modular-kitchen',
    title: 'Modular Kitchens & Dining',
    badge: '100% BWP Marine Ply',
    desc: 'Bespoke L-shape, U-shape, Island & Parallel modular kitchens with anti-bubble edge-banding, Quartz countertops & soft-close Hettich hardware.',
    image: '/images/luxury_modular_kitchen.png',
    slug: 'interior-design',
  },
  {
    id: 'master-bedroom',
    title: 'Master Bedrooms & Wardrobes',
    badge: 'German Hardware',
    desc: 'Floor-to-ceiling floor sliding wardrobes, acrylic finishes, lacquered glass doors, upholstered bed backdrops & vanity storage.',
    image: '/images/luxury_master_bedroom.png',
    slug: 'interior-design',
  },
  {
    id: 'living-dining',
    title: 'Living Rooms & False Ceilings',
    badge: 'Ambient LED Lighting',
    desc: 'Custom TV console units, fluted louvers, veneer paneling, magnetic track lighting & geometric false ceiling designs.',
    image: '/images/luxury_living_room_hero.png',
    slug: 'interior-design',
  },
  {
    id: 'turnkey-villas',
    title: 'Turnkey Villa Interiors',
    badge: 'End-to-End Execution',
    desc: 'Full-scope luxury villa design & execution: false ceilings, electrical, plumbing, woodwork, wall paneling, and deep cleaning.',
    image: '/images/luxury_living_room_hero.png',
    slug: 'interior-design',
  },
  {
    id: 'commercial-interiors',
    title: 'Commercial Offices & Retail',
    badge: 'Fast-Track Handover',
    desc: 'Modern workplace acoustics, ergonomic workstations, executive suites, reception counters, and conference room fit-outs.',
    image: '/images/luxury_living_room_hero.png',
    slug: 'commercial-interiors',
  },
  {
    id: 'custom-woodwork',
    title: 'Custom Joinery & Foyers',
    badge: '10-Year Warranty',
    desc: 'Shoe racks with seating, decorative partition screens, study units, bar counters, and stone vanity units.',
    image: '/images/luxury_master_bedroom.png',
    slug: 'interior-design',
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollPosition = container.scrollLeft;
    const firstCard = container.firstElementChild as HTMLElement;
    const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 320;
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(Math.min(SERVICES.length - 1, Math.max(0, index)));
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstCard = container.firstElementChild as HTMLElement;
    const cardWidth = firstCard ? firstCard.offsetWidth + 24 : 320;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  return (
    <section className="py-16 md:py-28 bg-slate-50 font-sans" id="services">
      <div className="max-w-7xl mx-auto px-4 space-y-8 md:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-950 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
              ✨ BESPOKE INTERIOR DESIGN SERVICES
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Complete End-To-End Interior Solutions
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-medium">
              From empty apartment to luxury keys handover, we design bespoke modular kitchens, bedrooms, and living spaces across Hyderabad with 150+ quality checks.
            </p>
          </div>

          <Link
            href="/services"
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-md transition-all w-fit shrink-0 flex items-center gap-2 group"
          >
            VIEW ALL SERVICES{' '}
            <span className="bg-amber-400 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <svg className="w-3 h-3 text-slate-950" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Mobile Swipe Navigation Controls (< md) */}
        <div className="md:hidden flex items-center justify-between px-1 text-xs font-black text-slate-700">
          <span className="bg-amber-500/15 text-amber-900 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
            👈 SWIPE SERVICES ({activeIndex + 1} / {SERVICES.length})
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="w-8 h-8 rounded-full bg-slate-200 disabled:opacity-30 text-slate-900 flex items-center justify-center font-black text-sm cursor-pointer"
              aria-label="Previous service"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(Math.min(SERVICES.length - 1, activeIndex + 1))}
              disabled={activeIndex === SERVICES.length - 1}
              className="w-8 h-8 rounded-full bg-amber-500 disabled:opacity-30 text-slate-950 flex items-center justify-center font-black text-sm shadow-md cursor-pointer"
              aria-label="Next service"
            >
              →
            </button>
          </div>
        </div>

        {/* 6 Services Grid / Horizontal Swipe Slider */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 md:pb-0 md:grid md:grid-cols-3 md:overflow-visible scrollbar-none px-1"
        >
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="w-[85vw] max-w-[330px] sm:w-full md:w-full md:max-w-none md:min-w-0 snap-center bg-white rounded-3xl md:rounded-[32px] p-5 sm:p-6 border border-slate-200/90 shadow-md flex flex-col justify-between group hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 shrink-0 md:shrink relative overflow-hidden"
            >
              <div>
                <div className="relative rounded-2xl sm:rounded-[24px] overflow-hidden mb-4 h-[160px] sm:h-[210px]">
                  <img
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={service.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-wider border border-slate-200/50">
                    {service.badge}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium line-clamp-3 md:line-clamp-none">
                    {service.desc}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-black text-slate-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> 150+ Audits
                  </span>
                  <span className="text-slate-900 group-hover:text-amber-600 transition-colors">
                    45-Day Delivery →
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={openCallModal}
                  className="w-full bg-[#f2bd19] hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Book Free Consultation 📞
                </button>

                <Link
                  href="/estimate"
                  className="text-[11px] font-extrabold text-slate-600 hover:text-amber-600 text-center block py-1 transition-colors"
                >
                  Calculate Cost Estimate ⚡ →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination Indicator Dots (< md) */}
        <div className="md:hidden flex justify-center gap-1.5 pt-1">
          {SERVICES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToIndex(dotIdx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === dotIdx ? 'w-6 bg-amber-500' : 'w-2 bg-slate-300'
              }`}
              aria-label={`Go to service ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
