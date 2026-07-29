'use client';

import React, { useState } from 'react';
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

        {/* 4 Trust Badges Strip */}
        <section className="bg-slate-950 text-white py-6 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-amber-400 font-black text-lg">⚡</span> 45-Day Delivery Guarantee
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-amber-400 font-black text-lg">🔒</span> Stage Milestone Payment
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-amber-400 font-black text-lg">🛡️</span> 150+ Quality Audits
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-amber-400 font-black text-lg">🏆</span> 10-Year Woodwork Warranty
            </div>
          </div>
        </section>

        {/* Overview Header & Phase Selector */}
        <section className="py-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-extrabold uppercase tracking-widest mb-6">
              ✨ 6-Step Seamless Experience
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Design • Manufacture • Install • Settle In
            </h2>
            <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed mb-10">
              We make luxury home interiors transparent, tech-enabled, and stress-free. From 3D VR planning to 150+ quality inspections and 10-year warranty, discover how we transform your dream home in Hyderabad.
            </p>

            {/* Interactive Phase Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-fit mx-auto">
              {[
                { id: 'all', label: 'All 6 Steps' },
                { id: 'plan', label: '1. Plan & Consultation' },
                { id: 'design', label: '2. 3D VR Design & Factory' },
                { id: 'build', label: '3. Site Assembly & Handover' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePhase(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
                    activePhase === tab.id
                      ? 'bg-slate-900 text-white shadow-md scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 6-Step Folding Sticky Card Stack Journey on Scroll */}
        <section className="py-24 relative bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative space-y-12 pb-12">
              {filteredSteps.map((step, idx) => {
                const isSelected = selectedStep === step.num;
                const stickyTop = 110 + idx * 28;

                return (
                  <div
                    key={step.num}
                    onClick={() => setSelectedStep(step.num)}
                    style={{ top: `${stickyTop}px` }}
                    className={`sticky cursor-pointer transition-all duration-300 transform ${
                      isSelected ? 'scale-[1.01]' : 'hover:scale-[1.005]'
                    }`}
                  >
                    {/* Folding Card Container */}
                    <div
                      className={`bg-white border-2 rounded-[36px] p-8 md:p-12 shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                        isSelected
                          ? 'border-amber-500 shadow-2xl bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20'
                          : 'border-slate-200/90 shadow-lg hover:border-amber-300'
                      }`}
                    >
                      {/* Left Icon / Badge Column */}
                      <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                        <div
                          className={`w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center shadow-lg mb-4 transition-transform duration-300 ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 scale-110 shadow-amber-500/30'
                              : 'bg-slate-900 text-white'
                          }`}
                        >
                          {step.num}
                        </div>
                        <span className="material-symbols-outlined text-6xl text-amber-500/40 mb-2 animate-float">
                          {step.icon}
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
                          Step {step.num} of 06
                        </span>
                      </div>

                      {/* Right Details Column */}
                      <div className="lg:col-span-8">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-amber-600 font-extrabold text-xs uppercase tracking-wider mb-6">
                          {step.subtitle}
                        </p>
                        <ul className="space-y-3.5 mb-6">
                          {step.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-3">
                              <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5 text-lg">
                                check_circle
                              </span>
                              <span className="text-slate-700 font-medium text-sm leading-relaxed">
                                {b}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {step.ctaText && (
                          <Link
                            href={step.ctaHref!}
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all"
                          >
                            {step.ctaText} <span>→</span>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Milestone Banner between Step 3 & 4 */}
                    {step.num === '03' && activePhase === 'all' && (
                      <div className="my-6 py-6 px-8 bg-slate-900 text-white rounded-[32px] flex flex-wrap items-center justify-between gap-4 shadow-2xl border border-slate-800 animate-fade-in">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl shadow-inner">
                            ✓
                          </div>
                          <div>
                            <h4 className="font-extrabold text-lg">Phase 1 Complete: 3D VR Design &amp; Order Freeze</h4>
                            <p className="text-slate-400 text-xs font-medium">Factory precision CNC manufacturing begins now!</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider bg-amber-950/60 px-4 py-2 rounded-full border border-amber-800/40">
                          100% Guaranteed Price Lock
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Interior Site Tracker Simulator */}
        <section className="py-24 bg-slate-950 text-white border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black uppercase tracking-widest">
                📱 ONE STUDIO LIVE APP TRACKER
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Track Every Stage From Your Mobile Phone
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Stay updated on daily 3D site captures, material inspection reports, and milestone approvals without visiting the site every day.
              </p>

              {/* App Control Tabs */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { id: 'overview', label: 'Milestones' },
                  { id: 'photo', label: 'Daily Photos' },
                  { id: 'audit', label: '150+ Audits' },
                  { id: 'milestone', label: 'Stage Payments' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAppTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeAppTab === tab.id
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <ul className="space-y-4 pt-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400">photo_camera</span>
                  <div>
                    <h5 className="font-bold text-white text-sm">Real-Time Daily Site Captures</h5>
                    <p className="text-slate-400 text-xs">High-definition daily site photos uploaded by your dedicated site engineer.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-400">verified</span>
                  <div>
                    <h5 className="font-bold text-white text-sm">150+ Material Quality Audits</h5>
                    <p className="text-slate-400 text-xs">Certified inspection reports for BWP marine plywood moisture, edge-banding, and hardware alignment.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* App Screen Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase text-amber-400">Active Interior Project</p>
                    <h4 className="text-lg font-bold text-white">Jubilee Hills Villa #104</h4>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    45-Day Track
                  </span>
                </div>

                {activeAppTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Current Milestone</p>
                        <p className="font-bold text-white text-xs">Modular Kitchen &amp; Wardrobe Assembly</p>
                      </div>
                      <span className="text-xs font-black text-amber-400">85% Complete</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Quality Inspection</p>
                        <p className="font-bold text-white text-xs">BWP Marine Plywood Audit</p>
                      </div>
                      <span className="text-xs font-black text-emerald-400">PASSED ✓</span>
                    </div>
                  </div>
                )}

                {activeAppTab === 'photo' && (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden h-44 border border-slate-800">
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
                      <span className="text-slate-300">Hettich Soft-Close Hardware Audit</span>
                      <span className="text-emerald-400 font-bold">100% PASSED ✓</span>
                    </div>
                  </div>
                )}

                {activeAppTab === 'milestone' && (
                  <div className="space-y-3">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Woodwork Delivery Milestone</span>
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
        <section className="py-24 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30 text-xs font-black uppercase tracking-widest mb-4">
              ⚡ INSTANT INTERIOR TIMELINE &amp; PRICE GUIDE
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-8">
              Estimate Your Home Interior Timeline
            </h2>

            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-xl mb-8 text-left">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
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
                      className={`py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
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
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
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
                      className={`py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
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
            <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-amber-400">Estimated Cost Range</p>
                <p className="text-2xl md:text-3xl font-black text-white mt-1">{currentEst.cost}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-amber-400">Delivery Timeline</p>
                <p className="text-2xl md:text-3xl font-black text-emerald-400 mt-1">{currentEst.time}</p>
              </div>
              <Link
                href="/estimate"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider py-4 px-6 rounded-2xl transition-all text-center shadow-lg hover:shadow-xl"
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
