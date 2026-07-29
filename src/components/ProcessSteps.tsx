'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const STEPS = [
  {
    num: '01',
    title: 'Free Consultation',
    desc: 'Book a no-cost session with our senior designers to discuss your space, style & budget.',
    icon: '📞',
    color: 'from-amber-400 to-amber-500',
  },
  {
    num: '02',
    title: '3D Design & VR Walkthrough',
    desc: 'Get a photorealistic 3D render and immersive VR walkthrough of your home — before anything is built.',
    icon: '🎨',
    color: 'from-amber-500 to-orange-400',
  },
  {
    num: '03',
    title: 'Material Selection & Quote',
    desc: 'Lock in your itemized quote with zero hidden costs. Choose from branded materials at transparent prices.',
    icon: '📋',
    color: 'from-orange-400 to-amber-400',
  },
  {
    num: '04',
    title: 'Factory Precision Build',
    desc: 'Your interiors are precision-manufactured in our in-house factory with 150+ quality checkpoints.',
    icon: '🏭',
    color: 'from-amber-400 to-yellow-400',
  },
  {
    num: '05',
    title: '45-Day Handover',
    desc: 'On-time delivery, flawless installation, and a 15-year warranty handed over with your keys.',
    icon: '🏠',
    color: 'from-yellow-400 to-amber-500',
  },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.55s ease ${index * 0.12}s, transform 0.55s ease ${index * 0.12}s`,
      }}
    >
      {/* Icon circle */}
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-amber-200/60 relative mb-5 group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-3xl">{step.icon}</span>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
          {index + 1}
        </span>
      </div>

      <h3 className="text-slate-900 font-extrabold text-sm md:text-base leading-tight mb-2">
        {step.title}
      </h3>
      <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed max-w-[190px]">
        {step.desc}
      </p>
    </div>
  );
}

export default function ProcessSteps() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-slate-50 font-sans" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 space-y-14">

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center space-y-3 max-w-2xl mx-auto"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest">
            Simple 5-Step Process
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            From Empty Flat to Dream Home
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            We handle everything — design, materials, manufacturing & installation. You just approve and move in.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Animated connecting line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500"
              style={{
                width: headerVisible ? '100%' : '0%',
                transition: 'width 1.4s ease 0.4s',
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 relative z-10">
            {STEPS.map((step, idx) => (
              <StepCard key={step.num} step={step} index={idx} />
            ))}
          </div>
        </div>

        {/* Animated CTA */}
        <div
          className="text-center"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease 0.8s, transform 0.5s ease 0.8s',
          }}
        >
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-md hover:-translate-y-0.5 transition-all"
          >
            See Full Process Details →
          </Link>
        </div>

      </div>
    </section>
  );
}
