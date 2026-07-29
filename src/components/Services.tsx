'use client';

import React from 'react';
import Link from 'next/link';
import { openCallModal } from '@/components/CallModal';

interface ServiceItem {
  id: string;
  title: string;
  category?: string;
  desc: string;
  icon?: string;
  image: string;
  badge: string;
  slug: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'Modular Kitchen & Dining Interiors',
    desc: 'Bespoke factory-finished modular kitchens with BWP marine ply, quartz countertops, and Hettich/Blum soft-close hardware.',
    image: '/images/luxury_modular_kitchen.png',
    badge: '45-Day Delivery',
    slug: 'interior-design',
  },
  {
    id: '2',
    title: 'Luxury Living & False Ceiling',
    desc: 'Contemporary TV units, acoustic false ceilings, designer wall paneling, and automated ambient lighting layouts.',
    image: '/images/luxury_living_room_hero.png',
    badge: 'Popular Choice',
    slug: 'interior-design',
  },
  {
    id: '3',
    title: 'Custom Master Bedroom & Wardrobes',
    desc: 'Floor-to-ceiling customized wardrobes, walk-in closets, upholstered bed backrests, and ergonomic study tables.',
    image: '/images/luxury_master_bedroom.png',
    badge: '15-Yr Warranty',
    slug: 'interior-design',
  },
  {
    id: '4',
    title: '3D VR Space Planning & Visualization',
    desc: 'Interactive 3D VR walkthroughs and detailed material moodboards before execution begins.',
    image: '/images/bangalore_architect_planning.png',
    badge: 'Free Consultation',
    slug: 'interior-design',
  },
  {
    id: '5',
    title: 'Commercial & Office Interiors',
    desc: 'Turnkey corporate office fitouts, retail stores, reception lobbies, and acoustic glass partition systems.',
    image: '/images/bangalore_commercial_complex.png',
    badge: 'Fast-Track',
    slug: 'interior-design',
  },
  {
    id: '6',
    title: 'Turnkey Full-Home Interior Execution',
    desc: 'End-to-end interior project management from electrical plumbing modifications to final styling and handover.',
    image: '/images/bangalore_modern_interior.png',
    badge: 'Turnkey Studio',
    slug: 'interior-design',
  },
];

export default function Services() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 font-sans" id="services">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
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
            VIEW ALL SERVICES <span className="bg-amber-400 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center text-[10px] group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* 6 Services Grid Skeleton */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 md:pb-0 md:grid md:grid-cols-3 md:overflow-visible">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center bg-white rounded-[32px] p-5 md:p-6 border border-slate-200/80 shadow-md flex flex-col justify-between group hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 shrink-0 md:shrink relative overflow-hidden"
            >
              <div>
                <div className="relative rounded-[24px] overflow-hidden mb-5 h-[200px] sm:h-[220px]">
                  <img
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={service.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-black text-slate-900 shadow-sm uppercase tracking-wider border border-slate-200/50">
                    {service.badge}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 150+ Quality Audits
                  </span>
                  <span className="text-slate-900 group-hover:text-amber-600 transition-colors">
                    45-Day Delivery →
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-6">
                <button
                  type="button"
                  onClick={openCallModal}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:bg-amber-500 group-hover:text-slate-950"
                >
                  Schedule Designer Consultation 📞
                </button>

                <Link
                  href="/estimate"
                  className="w-full bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl border border-slate-200/80 shadow-sm transition-all flex items-center justify-center gap-2 text-center hover:border-amber-400"
                >
                  Calculate Interior Design Cost ⚡
                </Link>
                <p className="text-[11px] font-semibold text-slate-400 text-center">
                  Get instant sq.ft estimate for your home interiors in Hyderabad.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
