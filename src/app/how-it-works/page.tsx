'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import Link from 'next/link';

const steps = [
  {
    num: '01',
    phase: 'plan',
    title: 'Share Your Floor Plan',
    subtitle: 'Upload floor plan or schedule a free site consultation',
    bullets: [
      'Submit your home floor plan online or call our Hyderabad design team at +91 9014303409.',
      'Our senior interior consultant connects within 2 hours to discuss carpet area, style preferences, and budget.',
      'Book a 1-on-1 consultation at your site or visit our Jubilee Hills Experience Center.',
    ],
    ctaText: 'Share Floor Plan Now',
    ctaHref: '/contact',
    icon: 'assignment_add',
  },
  {
    num: '02',
    phase: 'plan',
    title: 'Meet Our Senior Interior Designer',
    subtitle: 'Personalized 3D VR concept guidance & material selection',
    bullets: [
      'Explore live 3D VR layouts, space planning options, and material sample boards.',
      'Choose from premium BWP marine plywood, acrylic finishes, lacquered glass, and Hettich hardware.',
      'Receive instant itemized quote with 100% price lock guarantee and zero hidden costs.',
    ],
    icon: 'person_search',
  },
  {
    num: '03',
    phase: 'design',
    title: '3D VR Layout & Design Freeze',
    subtitle: 'Finalize modular kitchens, wardrobes & lighting layouts',
    bullets: [
      'Our design team crafts detailed 3D VR renders for living rooms, modular kitchens, and bedrooms.',
      'Unlimited design revisions until your dream interior vision is perfectly captured.',
      'Sign off design freeze to trigger instant factory order processing.',
    ],
    icon: 'architecture',
  },
  {
    num: '04',
    phase: 'design',
    title: 'Factory Precision Manufacturing',
    subtitle: 'German CNC automated modular woodwork production',
    bullets: [
      'Woodwork manufactured in state-of-the-art automated factories using high-precision German CNC machinery.',
      '100% BWP marine plywood with anti-termite and moisture-resistant treatment.',
      'Factory edge-banding for flawless finish and maximum durability.',
    ],
    icon: 'precision_manufacturing',
  },
  {
    num: '05',
    phase: 'build',
    title: 'Site Delivery & 150+ Quality Audits',
    subtitle: 'On-site installation & real-time app progress tracking',
    bullets: [
      'Factory-finished modular units delivered to your home and assembled by master craftsmen.',
      'Our dedicated Quality Auditor conducts 150+ checks covering alignment, hardware fitment, and electrical safety.',
      'Track daily site photos, inspection reports, and milestone progress live on the One Studio app.',
    ],
    icon: 'fact_check',
  },
  {
    num: '06',
    phase: 'build',
    title: 'Key Handover & 10-Year Warranty',
    subtitle: 'Deep cleaning & zero-defect handover',
    bullets: [
      'Joint site walk-through and professional deep cleaning before handover.',
      'Receive your official 10-Year Modular Woodwork Warranty certificate.',
      'Enjoy 1-year free post-handover maintenance support and lifetime dedicated assistance.',
    ],
    icon: 'key',
  },
];

export default function HowItWorksPage() {
  const [activePhase, setActivePhase] = useState<'all' | 'plan' | 'design' | 'build'>('all');
  const [selectedStep, setSelectedStep] = useState<string>('01');
  const [activeAppTab, setActiveAppTab] = useState<'overview' | 'photo' | 'audit' | 'milestone'>('overview');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Interactive Interior Estimator State
  const [homeType, setHomeType] = useState<string>('3bhk');
  const [finishTier, setFinishTier] = useState<string>('signature');

  const estimateData: Record<string, Record<string, { cost: string; time: string; items: string }>> = {
    '2bhk': {
      essential: { cost: '₹3.8L - ₹4.5L', time: '35 Days', items: 'Modular Kitchen, Master Wardrobe, TV Unit' },
      signature: { cost: '₹5.5L - ₹6.8L', time: '40 Days', items: 'Full 2BHK Modular Woodwork, False Ceiling, Lighting' },
      luxury: { cost: '₹8.2L - ₹10.5L', time: '45 Days', items: 'Premium Acrylic Kitchen, PU Wardrobes, Designer Wall Paneling' },
    },
    '3bhk': {
      essential: { cost: '₹5.2L - ₹6.5L', time: '40 Days', items: 'Modular Kitchen, 2 Bedrooms Wardrobes, TV Unit' },
      signature: { cost: '₹7.8L - ₹9.5L', time: '45 Days', items: 'Complete 3BHK Woodwork, False Ceiling, Crockery & Foyer' },
      luxury: { cost: '₹12.5L - ₹15.8L', time: '50 Days', items: 'Luxury Villa Grade Finishes, Quartz Countertops, Smart Lighting' },
    },
    'villa': {
      essential: { cost: '₹9.5L - ₹12.0L', time: '50 Days', items: 'Full Villa Modular Storage, Island Kitchen' },
      signature: { cost: '₹14.5L - ₹18.0L', time: '55 Days', items: 'Turnkey Villa Interiors, False Ceiling, Bar & Dressing Rooms' },
      luxury: { cost: '₹22.0L - ₹28.0L', time: '60 Days', items: 'High-End Italian Veneers, Automated Lighting, Custom Furniture' },
    },
  };

  const currentEst = estimateData[homeType][finishTier];
  const filteredSteps = steps.filter((s) => activePhase === 'all' || s.phase === activePhase);

  return (
    <>
      <Header />
      <main className="bg-white font-sans">
        <PageHero
          title="How Luxury Interior Design Works"
          image="/images/bangalore_modern_interior.png"
        />

        {/* 4 Trust Badges Strip - Mobile Responsive */}
        <section className="bg-slate-950 text-white py-4 md:py-6 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-200">
              <span className="text-amber-400 font-black text-base sm:text-lg">⚡</span> 45-Day Delivery
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-200">
              <span className="text-amber-400 font-black text-base sm:text-lg">🔒</span> Stage Payments
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-200">
              <span className="text-amber-400 font-black text-base sm:text-lg">🛡️</span> 150+ Audits
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-200">
              <span className="text-amber-400 font-black text-base sm:text-lg">🏆</span> 10-Yr Warranty
            </div>
          </div>
        </section>

        {/* Overview Header & Phase Selector */}
        <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-extrabold uppercase tracking-widest mb-4 md:mb-6">
              ✨ 6-Step Seamless Experience
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">
              Design • Manufacture • Install • Settle In
            </h2>
            <p className="text-slate-600 text-sm md:text-lg font-medium leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto">
              We make luxury home interiors transparent, tech-enabled, and stress-free. From 3D VR planning to 150+ quality inspections and 10-year warranty, discover how we transform your dream home in Hyderabad.
            </p>

            {/* Interactive Phase Filter Buttons - Mobile Touch Optimized */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
              {[
                { id: 'all', label: 'All 6 Steps' },
                { id: 'plan', label: '1. Plan & Consultation' },
                { id: 'design', label: '2. 3D VR & Factory' },
                { id: 'build', label: '3. Site & Handover' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePhase(tab.id as any)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
                    activePhase === tab.id
                      ? 'bg-slate-900 text-white shadow-md scale-100 sm:scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 6-Step Journey Section - Mobile Responsive Layout while keeping Desktop UNCHANGED */}
        <section className="py-12 md:py-24 relative bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative space-y-6 md:space-y-12 pb-12">
              {filteredSteps.map((step, idx) => {
                const isSelected = selectedStep === step.num;
                const stickyTop = 110 + idx * 28;

                return (
                  <div
                    key={step.num}
                    onClick={() => setSelectedStep(step.num)}
                    style={isDesktop ? ({ '--sticky-top': `${stickyTop}px` } as React.CSSProperties) : undefined}
                    className={`lg:sticky lg:top-[var(--sticky-top)] relative cursor-pointer transition-all duration-300 transform ${
                      isSelected ? 'scale-[1.01]' : 'hover:scale-[1.005]'
                    }`}
                  >
                    {/* Folding Card Container */}
                    <div
                      className={`bg-white border-2 rounded-3xl md:rounded-[36px] p-5 sm:p-8 md:p-12 shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center ${
                        isSelected
                          ? 'border-amber-500 shadow-2xl bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20'
                          : 'border-slate-200/90 shadow-lg hover:border-amber-300'
                      }`}
                    >
                      {/* Left Icon / Badge Column */}
                      <div className="lg:col-span-4 flex flex-row lg:flex-col items-center justify-between lg:items-start border-b lg:border-b-0 border-slate-100 pb-4 lg:pb-0">
                        <div className="flex items-center gap-3 lg:block">
                          <div
                            className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl font-black text-xl md:text-2xl flex items-center justify-center shadow-lg transition-transform duration-300 ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 scale-105 md:scale-110 shadow-amber-500/30'
                                : 'bg-slate-900 text-white'
                            }`}
                          >
                            {step.num}
                          </div>
                          <span className="lg:hidden text-xs font-extrabold uppercase tracking-widest text-amber-600">
                            Step {step.num} of 06
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-4xl md:text-6xl text-amber-500/40 lg:mb-2 lg:mt-4">
                          {step.icon}
                        </span>
                        <span className="hidden lg:block text-xs font-extrabold uppercase tracking-widest text-amber-600">
                          Step {step.num} of 06
                        </span>
                      </div>

                      {/* Right Details Column */}
                      <div className="lg:col-span-8 space-y-3">
                        <div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                            {step.title}
                          </h3>
                          <p className="text-amber-600 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider mt-1">
                            {step.subtitle}
                          </p>
                        </div>
                        <ul className="space-y-2.5 md:space-y-3.5 pt-1">
                          {step.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5 sm:gap-3">
                              <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5 text-base sm:text-lg">
                                check_circle
                              </span>
                              <span className="text-slate-700 font-medium text-xs sm:text-sm leading-relaxed">
                                {b}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {step.ctaText && (
                          <div className="pt-2">
                            <Link
                              href={step.ctaHref!}
                              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl sm:rounded-2xl shadow-md transition-all"
                            >
                              {step.ctaText} <span>→</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Milestone Banner between Step 3 & 4 */}
                    {step.num === '03' && activePhase === 'all' && (
                      <div className="my-6 py-5 px-6 sm:px-8 bg-slate-900 text-white rounded-3xl sm:rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl border border-slate-800 animate-fade-in">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0">
                            ✓
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm sm:text-lg">Phase 1 Complete: Design Freeze</h4>
                            <p className="text-slate-400 text-xs font-medium">Factory precision CNC manufacturing starts now.</p>
                          </div>
                        </div>
                        <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-800/40 shrink-0">
                          100% Price Lock
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Turnkey Interior Space Breakdown Section */}
        <section className="py-16 md:py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest mb-3">
                🏡 COMPLETE TURNKEY INTERIORS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Designed for Every Corner of Your Home
              </h2>
              <p className="text-slate-600 font-medium text-xs sm:text-base mt-3">
                Factory-precision modular woodwork, customized false ceilings, designer ambient lighting, and handpicked wall finishes for Hyderabad residences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  title: 'Modular Kitchens',
                  desc: 'BWP Marine Plywood, Quartz countertops, Tandem drawers & Hettich soft-close hinges.',
                  icon: 'kitchen',
                  tag: 'Factory Modular',
                },
                {
                  title: 'Master Bedrooms',
                  desc: 'Floor-to-ceiling sliding wardrobes, upholstered headboards & integrated study desks.',
                  icon: 'bed',
                  tag: 'Custom Storage',
                },
                {
                  title: 'Living & Dining',
                  desc: 'Geometric false ceilings, fluted louvers, TV console units & ambient LED strip lighting.',
                  icon: 'weekend',
                  tag: 'Luxury Decor',
                },
                {
                  title: 'Foyer & Vanity Units',
                  desc: 'Shoe racks with seating, partition screens, stone vanity units & gold-accent mirrors.',
                  icon: 'door_front',
                  tag: 'Custom Joinery',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl sm:rounded-[32px] p-6 sm:p-8 border border-slate-200/80 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 text-amber-950 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-amber-500 transition-colors">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl">{item.icon}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 bg-amber-500/20 px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-3 sm:mt-4 mb-2 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>Explore Space</span>
                    <span className="group-hover:translate-x-1 transition-transform text-amber-500">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Material & Hardware Guarantee Section */}
        <section className="py-12 md:py-20 bg-amber-500/10 border-t border-b border-amber-500/20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">
                🛡️ PREMIUM BRANDED MATERIALS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                Zero Compromise Materials &amp; Hardware
              </h2>
              <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                We only source factory-certified IS 710 BWP marine grade plywood, HDMR boards, and hardware from top global manufacturers.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-slate-950 font-black text-[11px] sm:text-xs uppercase tracking-wider">
                <span>✓ Hettich</span>
                <span>✓ Blum</span>
                <span>✓ Greenply</span>
                <span>✓ CenturyPly</span>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: '100% BWP Marine Plywood', text: 'Boiling waterproof plywood with 21-year manufacturer guarantee against termites and moisture.' },
                { title: 'German Soft-Close Hinges', text: 'Tested for 200,000+ open-close cycles for silent, effortless door and drawer motion.' },
                { title: 'Anti-Bubble Edge-Banding', text: 'Machine pur edge banding ensuring seamless 0mm joint sealing and zero moisture ingress.' },
                { title: 'High-Gloss Acrylic & PU', text: 'Scratch-resistant, UV-stable surfaces with zero yellowing over decades of daily use.' },
              ].map((m, mIdx) => (
                <div key={mIdx} className="bg-white p-5 sm:p-6 rounded-2xl border border-amber-500/30 shadow-md">
                  <h4 className="font-black text-slate-950 text-xs sm:text-sm mb-1">{m.title}</h4>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Interior Site Tracker Simulator */}
        <section className="py-16 md:py-24 bg-slate-950 text-white border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="lg:col-span-6 space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] sm:text-xs font-black uppercase tracking-widest">
                ✨ 100% TRANSPARENT PROJECT TRACKING
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Real-Time Project Control &amp; Live Updates
              </h2>
              <p className="text-slate-400 text-xs sm:text-base leading-relaxed">
                Experience complete peace of mind. Watch your luxury interior space come together stage by stage with daily HD photo updates and 150+ quality audit certificates.
              </p>

              {/* App Control Tabs - Mobile Scrollable */}
              <div className="flex overflow-x-auto gap-2 pt-2 scrollbar-none">
                {[
                  { id: 'overview', label: 'Milestones' },
                  { id: 'photo', label: 'Daily Photos' },
                  { id: 'audit', label: '150+ Audits' },
                  { id: 'milestone', label: 'Stage Payments' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveAppTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      activeAppTab === tab.id
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <ul className="space-y-3 sm:space-y-4 pt-2">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400 shrink-0">photo_camera</span>
                  <div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">Real-Time Daily Site Captures</h5>
                    <p className="text-slate-400 text-xs">High-definition daily site photos uploaded by your dedicated site engineer.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400 shrink-0">verified</span>
                  <div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">150+ Material Quality Audits</h5>
                    <p className="text-slate-400 text-xs">Certified inspection reports for BWP marine plywood moisture, edge-banding, and hardware alignment.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* App Screen Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="bg-slate-900 p-5 sm:p-8 rounded-3xl sm:rounded-[40px] border border-slate-800 shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-amber-400">Active Interior Project</p>
                    <h4 className="text-base sm:text-lg font-bold text-white">Jubilee Hills Villa #104</h4>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    45-Day Track
                  </span>
                </div>

                {activeAppTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Current Milestone</p>
                        <p className="font-bold text-white text-xs">Modular Kitchen &amp; Wardrobe Assembly</p>
                      </div>
                      <span className="text-xs font-black text-amber-400 shrink-0 ml-2">85% Done</span>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Quality Inspection</p>
                        <p className="font-bold text-white text-xs">BWP Marine Plywood Audit</p>
                      </div>
                      <span className="text-xs font-black text-emerald-400 shrink-0 ml-2">PASSED ✓</span>
                    </div>
                  </div>
                )}

                {activeAppTab === 'photo' && (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden h-40 sm:h-44 border border-slate-800">
                      <img
                        alt="Daily Site Progress"
                        className="w-full h-full object-cover"
                        src="/images/luxury_modular_kitchen.png"
                      />
                      <div className="absolute bottom-2 left-2 bg-slate-950/80 px-3 py-1 rounded-lg text-[10px] text-amber-400 font-bold">
                        📷 Site Progress • Kitchen Assembly Today
                      </div>
                    </div>
                  </div>
                )}

                {activeAppTab === 'audit' && (
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="text-slate-300">Moisture Content Test (&lt;12%)</span>
                      <span className="text-emerald-400 font-bold">8.4% PASSED ✓</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="text-slate-300">Hettich Hardware Audit</span>
                      <span className="text-emerald-400 font-bold">100% PASSED ✓</span>
                    </div>
                  </div>
                )}

                {activeAppTab === 'milestone' && (
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Woodwork Milestone</span>
                        <span className="text-emerald-400 font-bold">Passed Inspection</span>
                      </div>
                      <p className="text-sm font-bold text-white">Stage Payment Verified ✓</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Interior Estimator Quick Widget */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest mb-4">
              ⚡ INSTANT INTERIOR TIMELINE &amp; PRICE GUIDE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-8">
              Estimate Your Home Interior Timeline
            </h2>

            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[32px] border border-slate-200 shadow-xl mb-6 sm:mb-8 text-left">
              <div>
                <label className="block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                  1. Select Home Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '2bhk', label: '2BHK' },
                    { id: '3bhk', label: '3BHK' },
                    { id: 'villa', label: 'Villa' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setHomeType(t.id)}
                      className={`py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        homeType === t.id
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                  2. Select Finish Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'essential', label: 'Essential' },
                    { id: 'signature', label: 'Signature' },
                    { id: 'luxury', label: 'Luxury' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFinishTier(f.id)}
                      className={`py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        finishTier === f.id
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimated Output Result */}
            <div className="bg-slate-900 text-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-amber-400">Estimated Cost Range</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1">{currentEst.cost}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-amber-400">Delivery Timeline</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-400 mt-1">{currentEst.time}</p>
              </div>
              <Link
                href="/estimate"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl transition-all text-center shadow-lg hover:shadow-xl"
              >
                Detailed Itemized Cost →
              </Link>
            </div>
          </div>
        </section>

        {/* Theme Styled FAQ Section */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
