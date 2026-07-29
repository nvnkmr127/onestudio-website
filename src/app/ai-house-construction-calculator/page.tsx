import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import PageHero from '@/components/PageHero';
import CostEstimator from '@/components/CostEstimator';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import Link from 'next/link';

import { resolveSeo } from "@/lib/seo/resolve";

export async function generateMetadata(): Promise<Metadata> {
  return resolveSeo('/ai-house-construction-calculator');
}

export default function AICalculatorPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Page Hero */}
        <PageHero
          title="AI House Construction Calculator"
          subtitle="Instant plot estimate, built-up area calculations & material brand wallets for Bangalore home builders."
          image="/images/bangalore_architect_planning.png"
        />

        {/* 4 Feature Badges Strip */}
        <section className="bg-[#111111] text-white py-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <span className="text-primary-orange font-black text-lg">⚡</span> 60-Second Instant Price
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <span className="text-primary-orange font-black text-lg">🔒</span> Stage Escrow Protection
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <span className="text-primary-orange font-black text-lg">🛡️</span> 430+ QASCON Checks
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <span className="text-primary-orange font-black text-lg">🏆</span> 10-Year Warranty
            </div>
          </div>
        </section>

        {/* Interactive AI Construction Price Calculator */}
        <CostEstimator />

        {/* PDF BUA Charging Rules Explanation */}
        <section className="py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <span className="text-primary-orange font-black uppercase tracking-widest text-xs">
                TRANSPARENT BUA CHARGING BASIS
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                How Built-Up Area (BUA) Is Calculated
              </h2>
              <p className="text-slate-600 text-sm font-normal">
                Standard Bengaluru charging factors per One Studio commercial basis terms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-slate-800">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-2xl font-black text-primary-orange">100%</span>
                <h4 className="font-extrabold text-base text-slate-900">Fully Covered Area</h4>
                <p className="text-xs text-slate-500">Living rooms, bedrooms, kitchen, and enclosed hall areas.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-2xl font-black text-primary-orange">100%</span>
                <h4 className="font-extrabold text-base text-slate-900">Internal Staircase</h4>
                <p className="text-xs text-slate-500">Internal stairs, headroom, and covered mumty structures.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-2xl font-black text-emerald-600">70%</span>
                <h4 className="font-extrabold text-base text-slate-900">Balcony &amp; Utility</h4>
                <p className="text-xs text-slate-500">Covered balcony, utility space, and service passages.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-2xl font-black text-emerald-600">70%</span>
                <h4 className="font-extrabold text-base text-slate-900">Covered Parking</h4>
                <p className="text-xs text-slate-500">Covered car portico and entrance parking structures.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
