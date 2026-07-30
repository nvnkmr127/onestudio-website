'use client';

import React, { useState } from 'react';
import { openCallModal } from '@/components/CallModal';

interface FAQItem {
  id: number;
  category: 'General' | 'Pricing & Milestones' | 'Quality & Warranty' | 'Approvals';
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'Quality & Warranty',
    question: 'What kind of warranty does One Studio offer on home interiors?',
    answer: 'We provide a 10-Year Woodwork & Hardware Warranty backed by quality audit certificates, a 1-Year Free Maintenance Guarantee post-handover, and lifetime service support.',
  },
  {
    id: 2,
    category: 'General',
    question: 'What is the step-by-step process for working with One Studio?',
    answer: 'Our process is simple and transparent: 1) Free 3D VR Space Plan & Instant Cost Estimate, 2) Material Selection & Moodboards, 3) Stage-wise Milestone Payment Setup, 4) Real-Time App Tracking with 150+ Quality Checks, 5) 45-Day Guaranteed Handover.',
  },
  {
    id: 3,
    category: 'General',
    question: 'What types of interior design projects do you specialize in?',
    answer: 'We specialize in turnkey residential home interiors in Hyderabad, including bespoke modular kitchens, living room false ceilings, floor-to-ceiling wardrobes, and corporate office fitouts.',
  },
  {
    id: 4,
    category: 'Pricing & Milestones',
    question: 'How are payment milestones handled to prevent cost overruns?',
    answer: 'All payments are linked to clear stage milestones. You never pay upfront lump sums. Funds for each stage (Design, Factory Production, Woodwork Delivery, Assembly, Finishing) are paid only after our certified designers inspect and pass 150+ quality checks.',
  },
  {
    id: 5,
    category: 'Approvals',
    question: 'How long does a 3BHK home interior project take to complete in Hyderabad?',
    answer: 'A standard 3BHK home interior project is completed within a guaranteed 45 days from design freeze to keys handover, backed by a strict delay penalty clause.',
  },
  {
    id: 6,
    category: 'Approvals',
    question: 'Do you assist with custom woodwork and electrical/plumbing modifications?',
    answer: 'Yes! Our turnkey interior team handles complete end-to-end execution including factory modular woodwork, false ceilings, electrical lighting layouts, plumbing modifications, and painting.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Quality & Warranty', 'General', 'Pricing & Milestones', 'Approvals'];

  const filteredFaqs = activeCategory === 'All'
    ? faqData
    : faqData.filter(f => f.category === activeCategory);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-12 md:py-24 bg-slate-50 border-t border-slate-200/60" id="faq">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Title & Support Person Card */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-[3px] bg-amber-500 rounded-full" />
              <span className="text-amber-600 font-black uppercase tracking-widest text-xs">
                HELP &amp; ADVICE CENTER
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
              Your Interior Design<br />FAQ For Customers
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              Everything you need to know about interior estimation, stage payment safety, 45-day delivery, and 10-year warranties in Hyderabad.
            </p>
          </div>

          {/* Support Representative Card */}
          <div className="bg-slate-900 p-7 rounded-[32px] text-white shadow-2xl flex items-center gap-5 border border-slate-800 relative overflow-hidden">
            <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl" />
            <img
              alt="Senior Interior Advisor"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-lg"
              src="/images/indian_professional_man_1.png"
            />
            <div>
              <h4 className="font-extrabold text-base text-white">Rahul Verma</h4>
              <p className="text-amber-400 text-xs font-semibold">Chief Design Specialist • One Studio</p>
              <p className="text-slate-400 text-xs mt-1">Have custom questions? Call +91 9014303409</p>
            </div>
          </div>
        </div>

        {/* Right Column: Category Filters & Accordion List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Filter Pills - Mobile Horizontal Scrollable */}
          <div className="flex overflow-x-auto md:flex-wrap gap-2 pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-amber-500/50 shadow-xl ring-1 ring-amber-500/20'
                      : 'border-slate-200/80 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-extrabold text-slate-900 text-base md:text-lg leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-amber-500 text-slate-950 rotate-180'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      ↓
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Help Box */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">Still have questions?</h4>
              <p className="text-slate-600 text-xs font-medium">Get a personalized answer for your home floor plan.</p>
            </div>
            <button
              type="button"
              onClick={openCallModal}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer shrink-0"
            >
              Ask an Expert 📞
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
