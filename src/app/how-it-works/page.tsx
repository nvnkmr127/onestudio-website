'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import Link from 'next/link';

const steps = [
  {
    num: '01',
    phase: 'plan',
    title: 'Raise a Request',
    subtitle: 'Share your site location & initial requirements',
    bullets: [
      'Submit your interior request online or call our Hyderabad team at +91 9014303409.',
      'Our senior project consultant connects with you within 2 hours to understand plot size, location, and vision.',
      'Schedule a free 1-on-1 consultation with a technical specialist at your convenient time.',
    ],
    ctaText: 'Raise Request Now',
    ctaHref: '/contact',
    icon: 'assignment_add',
  },
  {
    num: '02',
    phase: 'plan',
    title: 'Meet Our Expert Architect',
    subtitle: 'Personalized package guidance & site inspection',
    bullets: [
      'Meet with our licensed architects to explore package options tailored to your budget and plot dimensions.',
      'Receive initial floor plan options, BBMP/BDA setback guidance, and structural advice.',
      'Clear all doubts regarding material brands, estimated timelines, and sanction approvals.',
    ],
    icon: 'person_search',
  },
  {
    num: '03',
    phase: 'plan',
    title: 'Book with One Studio',
    subtitle: 'Lock in your package & lock down your price',
    bullets: [
      'Pay 10% booking amount to lock your pricing and secure your construction slot.',
      'Get formal contract agreement with zero hidden cost guarantees and strict timeline commitments.',
      'Dedicated Project Manager and Quality Audit Engineer assigned to your project.',
    ],
    icon: 'edit_calendar',
  },
  {
    num: '04',
    phase: 'design',
    title: 'Receive Detailed 2D & 3D Plans',
    subtitle: 'Complete architectural, structural & interior drawings',
    bullets: [
      'Our design team provides exhaustive 2D floor plans, 3D elevation renders, structural diagrams, and electrical & plumbing layouts.',
      'Unlimited revisions until you are 100% satisfied with every detail of your future home.',
      'All technical specifications, milestone schedules, and material brands fed into your digital tracking app.',
    ],
    icon: 'architecture',
  },
  {
    num: '05',
    phase: 'build',
    title: 'Track & Transact (Milestone Safety)',
    subtitle: 'Stage-wise payment release & 150+ quality checks',
    bullets: [
      'Safe stage-wise milestone payment system: money is released to the execution team ONLY after each stage passes quality audit.',
      'Track 3D site progress, view daily site photos, and review inspection reports live on the One Studio app.',
      'Our independent quality auditor performs 150+ quality tests at every key milestone (modular woodwork, electrical, finishing).',
    ],
    icon: 'security',
  },
  {
    num: '06',
    phase: 'build',
    title: 'Settle In & Enjoy 10-Year Warranty',
    subtitle: 'Key handover with zero-defect sign-off',
    bullets: [
      'Final joint inspection and deep cleaning of your newly designed home before key handover.',
      'Receive official 10-Year Modular Woodwork Warranty certificate and maintenance manual.',
      'Our relationship continues with 1-year free post-handover maintenance support.',
    ],
    icon: 'key',
  },
];

const faqs = [
  {
    q: 'How does stage-wise milestone payment protect my money?',
    a: 'Your payments are released per completed stage milestone. Funds are paid to the project team only after our certified quality audit team verifies that the stage meets all 150+ quality benchmarks.',
  },
  {
    q: 'Can I track my site construction progress remotely?',
    a: 'Yes! Our One Studio Customer App provides live 3D site captures, daily photo updates, material test reports, and milestone tracking so you can monitor progress from anywhere in the world.',
  },
  {
    q: 'What architectural drawings are included before construction starts?',
    a: 'You receive complete 2D floor plans, 3D exterior elevations, structural engineering drawings, electrical layouts, plumbing schematics, and 3D interior renders.',
  },
  {
    q: 'What happens if there is a delay in delivery?',
    a: 'We include a strict penalty clause in our contract: if construction is delayed beyond the committed milestone timeline due to our fault, we compensate you per day of delay.',
  },
];

export default function HowItWorksPage() {
  const [activePhase, setActivePhase] = useState<'all' | 'plan' | 'design' | 'build'>('all');
  const [selectedStep, setSelectedStep] = useState<string>('01');
  const [activeAppTab, setActiveAppTab] = useState<'overview' | 'photo' | 'audit' | 'milestone'>('overview');

  // Interactive Calculator State
  const [plotArea, setPlotArea] = useState<number>(1200);
  const [floors, setFloors] = useState<number>(2);
  const [packageTier, setPackageTier] = useState<number>(2049); // price per sqft

  const totalBuiltupArea = plotArea * floors;
  const estimatedCost = totalBuiltupArea * packageTier;
  const estimatedMonths = Math.max(5, Math.ceil(floors * 2.5 + (plotArea > 2000 ? 2 : 0)));

  const filteredSteps = steps.filter(
    (s) => activePhase === 'all' || s.phase === activePhase
  );

  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHero
          title="How Construction Works"
          image="/images/bangalore_architect_planning.png"
        />

        {/* 4 Trust Badges Strip */}
        <section className="bg-slate-900 text-white py-6 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-primary-orange font-black text-lg">✓</span> 100% On-Time Delivery
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-primary-orange font-black text-lg">🔒</span> Stage Payment Safety
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-primary-orange font-black text-lg">🛡️</span> 430+ Quality Checks
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-primary-orange font-black text-lg">🏆</span> 10-Year Warranty
            </div>
          </div>
        </section>

        {/* Overview Header & Phase Selector */}
        <section className="py-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-primary-orange text-xs font-extrabold uppercase tracking-widest mb-6 animate-pulse-subtle">
              Simple 4-Phase Promise
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Plan • Build • Track • Settle In
            </h2>
            <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed mb-10">
              We make luxury interiors transparent, tech-enabled, and stress-free. From 3D space planning to 150+ quality inspections and 10-year warranty, discover how we transform your dream home in Hyderabad step by step.
            </p>

            {/* Interactive Phase Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-fit mx-auto">
              {[
                { id: 'all', label: 'All 6 Steps' },
                { id: 'plan', label: '1. Plan & Consultation' },
                { id: 'design', label: '2. Design & Sanctions' },
                { id: 'build', label: '3. Build & Milestone Track' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePhase(tab.id as any)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${
                    activePhase === tab.id
                      ? 'bg-primary-orange text-white shadow-md scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 6-Step Folding Card Timeline Journey on Scroll */}
        <section className="py-24 relative">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative space-y-12">
              {filteredSteps.map((step, idx) => {
                const isSelected = selectedStep === step.num;
                // Calculate incremental sticky top offset for the folding stack effect
                const stickyTop = 100 + idx * 28;

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
                      className={`bg-white border-2 rounded-3xl p-8 md:p-12 shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                        isSelected
                          ? 'border-primary-orange shadow-2xl bg-gradient-to-r from-orange-50/50 via-white to-orange-50/20'
                          : 'border-slate-200/90 shadow-lg hover:border-orange-300'
                      }`}
                    >
                      {/* Left Icon / Badge Column */}
                      <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
                        <div
                          className={`w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center shadow-lg mb-4 transition-transform duration-300 ${
                            isSelected
                              ? 'bg-primary-orange text-white scale-110 shadow-orange-500/30'
                              : 'bg-slate-900 text-white'
                          }`}
                        >
                          {step.num}
                        </div>
                        <span className="material-symbols-outlined text-6xl text-primary-orange/40 mb-2 animate-float">
                          {step.icon}
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-primary-orange">
                          Step {step.num} of 06
                        </span>
                      </div>

                      {/* Right Details Column */}
                      <div className="lg:col-span-8">
                        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-primary-orange font-bold text-sm mb-6">
                          {step.subtitle}
                        </p>
                        <ul className="space-y-3.5 mb-6">
                          {step.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-3">
                              <span className="material-symbols-outlined text-primary-orange shrink-0 mt-0.5 text-lg">
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
                            className="inline-flex items-center gap-2 bg-primary-orange hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                          >
                            {step.ctaText} <span>→</span>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Milestone Banner between Step 4 & 5 */}
                    {step.num === '04' && activePhase === 'all' && (
                      <div className="my-6 py-6 px-8 bg-slate-900 text-white rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-2xl border border-slate-800 animate-fade-in">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl shadow-inner">
                            ✓
                          </div>
                          <div>
                            <h4 className="font-extrabold text-lg">Phase 1 Complete: Design &amp; Sanctions Approved</h4>
                            <p className="text-slate-400 text-xs font-medium">Actual on-site ground construction &amp; foundation work begins now!</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-primary-orange uppercase tracking-wider bg-orange-950/60 px-4 py-2 rounded-full border border-orange-800/40">
                          100% Transparent Milestone
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live App Tracking Interactive Simulator Section */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-orange/20 text-primary-orange text-xs font-bold uppercase tracking-widest mb-6">
                One Studio App
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                We Build Your Dream Home. You Track Progress Live.
              </h2>
              <p className="text-slate-400 text-base mb-8 leading-relaxed">
                Stay updated at every step with our customer tracking application. Never worry about site visits or contractor delays.
              </p>

              {/* Interactive App Control Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { id: 'overview', label: 'Milestones' },
                  { id: 'photo', label: '3D Photos' },
                  { id: 'audit', label: '430+ Quality Audits' },
                  { id: 'milestone', label: 'Milestone Safe Pay' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAppTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeAppTab === tab.id
                        ? 'bg-primary-orange text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-orange">photo_camera</span>
                  <div>
                    <h5 className="font-bold text-white text-base">3D Site Progress Captures</h5>
                    <p className="text-slate-400 text-sm">View high-resolution 3D site captures and daily construction photos.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-orange">fact_check</span>
                  <div>
                    <h5 className="font-bold text-white text-base">430+ Quality Audit Reports</h5>
                    <p className="text-slate-400 text-sm">Access lab test reports for cement, steel, concrete cube strength, and waterproofing.</p>
                  </div>
                </li>
              </ul>

              <Link
                href="/contact"
                className="bg-primary-orange hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
              >
                Book Free Consultation <span>→</span>
              </Link>
            </div>

            {/* Interactive App Screen Simulator */}
            <div className="relative flex justify-center">
              <div className="bg-slate-800/90 p-8 rounded-[40px] border border-slate-700/60 shadow-2xl max-w-md w-full transition-all duration-300 hover:border-primary-orange/50">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-6 mb-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Live Site Status</p>
                    <h4 className="text-xl font-bold text-white">Whitefield Villa #104</h4>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    On Schedule
                  </span>
                </div>

                {/* Tab 1: Overview */}
                {activeAppTab === 'overview' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-400">Current Milestone</p>
                        <p className="font-bold text-white text-sm">1st Floor Slab Casting</p>
                      </div>
                      <span className="text-xs font-bold text-primary-orange">85% Complete</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-400">Quality Inspection</p>
                        <p className="font-bold text-white text-sm">Steel Reinforcement Audit</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">PASSED ✓</span>
                    </div>
                  </div>
                )}

                {/* Tab 2: Photo */}
                {activeAppTab === 'photo' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="relative rounded-2xl overflow-hidden h-44 border border-slate-700">
                      <img
                        alt="Daily Site Capture"
                        className="w-full h-full object-cover"
                        src="/images/bangalore_hero_building.png"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-lg text-[10px] text-white">
                        📷 Captured Today 09:30 AM
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Audit */}
                {activeAppTab === 'audit' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="text-slate-300">Concrete Cube Test (M25)</span>
                      <span className="text-emerald-400 font-bold">28.5 N/mm² ✓</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                      <span className="text-slate-300">Steel Tensile Strength</span>
                      <span className="text-emerald-400 font-bold">500D Grade ✓</span>
                    </div>
                  </div>
                )}

                {/* Tab 4: Milestone Pay */}
                {activeAppTab === 'milestone' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Stage 3 Milestone Deposit</span>
                        <span className="text-emerald-400 font-bold">Verified Milestone</span>
                      </div>
                      <p className="text-sm font-bold text-white">₹3,50,000 Verified</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Construction Estimator Widget */}
        <section className="py-24 bg-orange-50/50 border-y border-orange-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-orange/10 text-primary-orange text-xs font-bold uppercase tracking-widest mb-4">
                Instant Estimator
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                Estimate Your Construction Cost &amp; Timeline
              </h2>
              <p className="text-slate-600 text-sm font-medium">
                Adjust your plot size, floors, and package to preview your project metrics.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Controls */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                    Plot Dimensions / Area (sq.ft): {plotArea} sq.ft
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1200, 1500, 2400, 4000].map((size) => (
                      <button
                        key={size}
                        onClick={() => setPlotArea(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          plotArea === size
                            ? 'bg-primary-orange text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size} sq.ft {size === 1200 ? '(30x40)' : size === 2400 ? '(40x60)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                    Number of Floors: G + {floors - 1} Floors ({totalBuiltupArea} sq.ft builtup)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFloors(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          floors === f
                            ? 'bg-primary-orange text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        G+{f - 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                    Construction Package Tier
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { rate: 1849, label: 'Essential @ ₹1,849/sq.ft' },
                      { rate: 2049, label: 'Prime @ ₹2,049/sq.ft' },
                      { rate: 2349, label: 'Signature @ ₹2,349/sq.ft' },
                      { rate: 2699, label: 'Elite @ ₹2,699/sq.ft' },
                    ].map((pkg) => (
                      <button
                        key={pkg.rate}
                        onClick={() => setPackageTier(pkg.rate)}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          packageTier === pkg.rate
                            ? 'bg-primary-orange text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {pkg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimation Display Box */}
              <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-between border border-slate-800 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-orange mb-2">
                  Estimated Summary
                </span>
                <div className="my-4">
                  <p className="text-xs text-slate-400 uppercase font-semibold">Total Estimated Cost</p>
                  <h3 className="text-3xl md:text-4xl font-black text-white mt-1">
                    ₹{(estimatedCost / 100000).toFixed(2)} Lacs
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Includes materials, labor &amp; architectural designs
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Builtup Area</p>
                    <p className="font-extrabold text-sm text-white">{totalBuiltupArea} sq.ft</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Timeline</p>
                    <p className="font-extrabold text-sm text-emerald-400">{estimatedMonths} Months</p>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="mt-6 w-full bg-primary-orange hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md text-center"
                >
                  Get Detailed Quote →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 font-medium">
                Everything you need to know about our construction process &amp; safety.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 open:shadow-sm transition-all"
                >
                  <summary className="cursor-pointer font-bold text-base md:text-lg text-slate-900 list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-primary-orange transition-transform group-open:rotate-45 font-bold text-xl ml-4">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 leading-relaxed text-sm md:text-base">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 bg-primary-orange text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Ready to Design Your Dream Home in Hyderabad?
            </h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
              Get 1:1 consultation with Hyderabad's top interior design experts and guaranteed 100% transparent pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
              >
                Talk to an Expert Now
              </Link>
              <Link
                href="/services"
                className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg transition-all"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
