'use client';

import React, { useState } from 'react';
import { openCallModal } from '@/components/CallModal';

interface Project {
  id: string;
  title: string;
  category: 'kitchens' | 'living' | 'bedrooms';
  location: string;
  bua: string;
  packageTier: string;
  year: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Modern Island Modular Kitchen & Dining',
    category: 'kitchens',
    location: 'Whitefield, Bengaluru',
    bua: '450 sq.ft.',
    packageTier: 'SIGNATURE (₹1,949/sqft)',
    year: 'Delivered 2025',
    image: '/images/luxury_modular_kitchen.png',
  },
  {
    id: '2',
    title: 'Contemporary 3BHK Luxury Living Room',
    category: 'living',
    location: 'HBR Layout, Bengaluru',
    bua: '1,200 sq.ft.',
    packageTier: 'PRIME (₹1,549/sqft)',
    year: 'Delivered 2025',
    image: '/images/luxury_living_room_hero.png',
  },
  {
    id: '3',
    title: 'Custom Master Bedroom & Walk-in Wardrobe',
    category: 'bedrooms',
    location: 'Indiranagar, Bengaluru',
    bua: '650 sq.ft.',
    packageTier: 'ELITE (₹2,449/sqft)',
    year: 'Delivered 2024',
    image: '/images/luxury_master_bedroom.png',
  },
  {
    id: '4',
    title: 'Minimalist L-Shaped Kitchen & Loft Storage',
    category: 'kitchens',
    location: 'Sarjapur Road, Bengaluru',
    bua: '380 sq.ft.',
    packageTier: 'PRIME (₹1,549/sqft)',
    year: 'Delivered 2024',
    image: '/images/luxury_modular_kitchen.png',
  },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState<'all' | 'kitchens' | 'living' | 'bedrooms'>('all');

  const filteredProjects = activeTab === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeTab);

  return (
    <>
      <section className="py-20 md:py-28 bg-white" id="projects">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          {/* Header & Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
                ✨ PORTFOLIO SHOWCASE
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Our Landmark Interior Design Projects
              </h2>
              <p className="text-slate-600 text-sm md:text-base font-medium">
                Explore turnkey modular kitchens, living rooms, and bedroom interiors designed with 150+ quality checks across Bengaluru.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'kitchens', label: 'Modular Kitchens' },
                { id: 'living', label: 'Living & Dining' },
                { id: 'bedrooms', label: 'Master Bedrooms' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Swipeable Grid / Mobile Touch Carousel */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 md:pb-0 md:grid md:grid-cols-2 md:overflow-visible">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-center bg-white rounded-[32px] p-5 md:p-6 border border-slate-200/80 shadow-md flex flex-col justify-between group hover:shadow-2xl hover:border-amber-400/50 hover:-translate-y-1.5 transition-all duration-300 shrink-0 md:shrink"
              >
                {/* Image Container with Badges */}
                <div className="relative rounded-[26px] overflow-hidden mb-5 h-[280px] sm:h-[340px]">
                  <img
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 shadow-md uppercase tracking-wider border border-slate-200/50">
                      {project.packageTier}
                    </span>
                    <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black shadow-md uppercase tracking-wider">
                      {project.year}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Specs */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        📍 {project.location}
                      </span>
                      <span className="text-[10px] font-medium text-slate-300 block">
                        BUA: {project.bua}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={openCallModal}
                      className="bg-white hover:bg-amber-400 text-slate-900 p-3 rounded-2xl shadow-lg transition-colors cursor-pointer"
                      aria-label="View Project Specs"
                    >
                      <span className="text-xs font-black">→</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-primary-orange transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
                    <span>150+ Quality Checked</span>
                    <span className="text-slate-900">45-Day Delivery Guaranteed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Ticker Banner */}
      <div className="bg-amber-500 py-5 overflow-hidden flex whitespace-nowrap border-y border-slate-900/10">
        <div className="flex items-center space-x-12 animate-marquee text-slate-950 font-black text-xl md:text-2xl uppercase tracking-wider">
          <span>Luxury Home Interiors ★ Custom Modular Kitchens ★ 45-Day Delivery ★ 15-Year Woodwork Warranty</span>
          <span>Luxury Home Interiors ★ Custom Modular Kitchens ★ 45-Day Delivery ★ 15-Year Woodwork Warranty</span>
        </div>
      </div>
    </>
  );
}
