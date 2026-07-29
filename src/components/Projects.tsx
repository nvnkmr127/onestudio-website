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
    location: 'Jubilee Hills, Hyderabad',
    bua: '450 sq.ft.',
    packageTier: 'SIGNATURE (₹1,949/sqft)',
    year: 'Delivered 2025',
    image: '/images/luxury_modular_kitchen.png',
  },
  {
    id: '2',
    title: 'Contemporary 3BHK Luxury Living Room',
    category: 'living',
    location: 'Gachibowli, Hyderabad',
    bua: '1,200 sq.ft.',
    packageTier: 'PRIME (₹1,549/sqft)',
    year: 'Delivered 2025',
    image: '/images/luxury_living_room_hero.png',
  },
  {
    id: '3',
    title: 'Custom Master Bedroom & Walk-in Wardrobe',
    category: 'bedrooms',
    location: 'Banjara Hills, Hyderabad',
    bua: '650 sq.ft.',
    packageTier: 'ELITE (₹2,449/sqft)',
    year: 'Delivered 2024',
    image: '/images/luxury_master_bedroom.png',
  },
  {
    id: '4',
    title: 'Minimalist L-Shaped Kitchen & Loft Storage',
    category: 'kitchens',
    location: 'Hitec City, Hyderabad',
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
                Explore turnkey modular kitchens, living rooms, and bedroom interiors designed with 150+ quality checks across Hyderabad.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'kitchens', label: 'Modular Kitchens' },
                { id: 'living', label: 'Living & Dining' },
                { id: 'bedrooms', label: 'Bedrooms' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-slate-50 rounded-[36px] overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-amber-500/40 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative h-[260px] sm:h-[320px] overflow-hidden">
                  <img
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-white/10 text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full tracking-wider shadow-sm">
                    {project.packageTier}
                  </span>

                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm">
                    {project.year}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-1">
                      📍 {project.location}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 bg-white flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                    <span>📐 {project.bua}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-extrabold">✓ 100% Handover On Time</span>
                  </div>

                  <button
                    type="button"
                    onClick={openCallModal}
                    className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    View Layout 📞
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
