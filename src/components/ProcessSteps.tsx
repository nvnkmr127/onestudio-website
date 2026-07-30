'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const STEPS = [
  {
    num: '01',
    title: 'Free Consultation',
    desc: 'Book a no-cost session with our senior designers to discuss your space, style & budget.',
    image: '/images/bangalore_architect_planning.png',
    icon: (
      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: '3D Design & VR Walkthrough',
    desc: 'Get a photorealistic 3D render and immersive VR walkthrough of your home — before anything is built.',
    image: '/images/luxury_living_room_hero.png',
    icon: (
      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Material Selection & Quote',
    desc: 'Lock in your itemized quote with zero hidden costs. Choose from branded materials at transparent prices.',
    image: '/images/luxury_master_bedroom.png',
    icon: (
      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Factory Precision Build',
    desc: 'Your interiors are precision-manufactured in our in-house factory with 150+ quality checkpoints.',
    image: '/images/luxury_modular_kitchen.png',
    icon: (
      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    num: '05',
    title: '45-Day Handover',
    desc: 'On-time delivery, flawless installation, and a 15-year warranty handed over with your keys.',
    image: '/images/luxury_living_room_hero.png',
    icon: (
      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
];

export default function ProcessSteps() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#FAF8F5] font-sans overflow-hidden" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center space-y-3 max-w-2xl mx-auto"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <span className="inline-block px-5 py-1.5 rounded-full bg-[#FFF4E8] text-amber-700 border border-[#FDE0C2] text-xs font-black uppercase tracking-widest">
            SIMPLE 5-STEP PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            From Empty Flat to Dream Home
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
            We handle everything — design, materials, manufacturing &amp; installation. <br className="hidden sm:inline" />
            You just approve and move in.
          </p>
        </div>

        {/* 5 Steps Layout Container */}
        <div className="relative pt-4">
          {/* Dashed Connecting Line — Desktop Only */}
          <div className="hidden lg:block absolute top-[110px] left-[8%] right-[8%] border-t-2 border-dashed border-amber-500/40 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-5 relative z-10">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex flex-col space-y-4 group transition-all duration-300"
              >
                {/* Image Container with Floating Number Badge */}
                <div className="relative rounded-[22px] overflow-hidden shadow-md border border-slate-200/80 bg-white h-[180px] sm:h-[190px]">
                  {/* Step Badge */}
                  <div className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shadow-lg border-2 border-white">
                    {step.num}
                  </div>
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                </div>

                {/* Title Box with Icon */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-sm group-hover:shadow-md group-hover:border-amber-400/60 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4E8] border border-[#FDE0C2] flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <h3 className="text-slate-900 font-extrabold text-xs sm:text-sm leading-tight text-left">
                    {step.title}
                  </h3>
                </div>

                {/* Step Description */}
                <p className="text-slate-500 text-xs font-normal leading-relaxed text-center px-1">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-4">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all"
          >
            See Full Process Details →
          </Link>
        </div>
      </div>
    </section>
  );
}
