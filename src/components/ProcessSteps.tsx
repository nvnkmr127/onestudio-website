'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const STEPS = [
  {
    num: '01',
    title: 'Free Consultation',
    desc: 'Book a no-cost session with our senior designers to discuss your space, style & budget.',
    image: '/images/process_step1_consultation.png',
    icon: (
      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-.47 0-.94.004-1.41.01A8.966 8.966 0 0112 17.25c-4.97 0-9-3.358-9-7.5s4.03-7.5 9-7.5c2.72 0 5.167 1.006 6.837 2.645" />
        <circle cx="8.5" cy="9.75" r="1" fill="currentColor" />
        <circle cx="12" cy="9.75" r="1" fill="currentColor" />
        <circle cx="15.5" cy="9.75" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: '02',
    title: '3D Design & VR Walkthrough',
    desc: 'Get a photorealistic 3D render and immersive VR walkthrough of your home — before anything is built.',
    image: '/images/process_step2_3ddesign.png',
    icon: (
      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v4m-4 0h8m-5-12l3 2-3 2-3-2 3-2z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Material Selection & Quote',
    desc: 'Lock in your itemized quote with zero hidden costs. Choose from branded materials at transparent prices.',
    image: '/images/process_step3_materials.png',
    icon: (
      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Factory Precision Build',
    desc: 'Your interiors are precision-manufactured in our in-house factory with 150+ quality checkpoints.',
    image: '/images/process_step4_factory.png',
    icon: (
      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    num: '05',
    title: '45-Day Handover',
    desc: 'On-time delivery, flawless installation, and a 15-year warranty handed over with your keys.',
    image: '/images/process_step5_handover.png',
    icon: (
      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
