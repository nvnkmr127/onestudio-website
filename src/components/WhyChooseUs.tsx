'use client';

import React from 'react';
import { openCallModal } from '@/components/CallModal';

interface WhyChooseItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    id: '1',
    icon: 'local_offer',
    title: 'Made to order',
    description: 'We create personalised spaces that cater to your every requirement.',
  },
  {
    id: '2',
    icon: 'percent',
    title: 'Lowest Prices Guaranteed',
    description: 'We provide the best possible solutions that suit your finances.',
  },
  {
    id: '3',
    icon: 'assignment_turned_in',
    title: 'Quality Checks At Every Step',
    description: 'We guarantee thorough quality checks till project completion',
  },
  {
    id: '4',
    icon: 'timer',
    title: 'Timely Delivery Assurance',
    description: 'We proactively work on commitments to maintain our benchmark of ontime delivery',
  },
  {
    id: '5',
    icon: 'verified_user',
    title: '15-Years Warranty',
    description: 'We invigorate client relationships by offering structural warranties that last 15 years.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white font-sans" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Header with Title, Subtitle, and Top Right Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Why Choose Us
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              With us, you experience the power of ideas, design and craftsmanship come alive.
            </p>
          </div>

          <button
            type="button"
            onClick={openCallModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0 w-full sm:w-auto text-center"
          >
            Book Consultation
          </button>
        </div>

        {/* 5 Cards Row (Swipeable Carousel on Mobile / 5-Col Grid on Desktop) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 md:pb-0 lg:grid lg:grid-cols-5 md:overflow-visible">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="min-w-[240px] sm:min-w-[270px] lg:min-w-0 snap-center bg-slate-50/90 rounded-3xl p-6 border border-slate-100/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 group shrink-0 lg:shrink"
            >
              <div className="space-y-5">
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
