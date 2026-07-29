'use client';

import React, { useState } from 'react';
import { openCallModal } from '@/components/CallModal';

interface FAQItem {
  id: number;
  category: 'General' | 'Pricing & Escrow' | 'Quality & Warranty' | 'Approvals';
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
    answer: 'Our process is simple and transparent: 1) Free 3D VR Space Plan & Instant Cost Estimate, 2) Material Selection & Moodboards, 3) Stage-wise Escrow Payment Setup, 4) Real-Time App Tracking with 150+ Quality Checks, 5) 45-Day Guaranteed Handover.',
  },
  {
    id: 3,
    category: 'General',
    question: 'What types of interior design projects do you specialize in?',
    answer: 'We specialize in turnkey residential home interiors in Bangalore, including bespoke modular kitchens, living room false ceilings, floor-to-ceiling wardrobes, and corporate office fitouts.',
  },
  {
    id: 4,
    category: 'Pricing & Escrow',
    question: 'How are payment milestones handled to prevent cost overruns?',
    answer: 'All payments are linked to escrow stage milestones. You never pay upfront lump sums. Funds for each stage (Design, Factory Production, Woodwork Delivery, Assembly, Finishing) are released only after our certified designers inspect and pass 150+ quality checks.',
  },
  {
    id: 5,
    category: 'Approvals',
    question: 'How long does a 3BHK home interior project take to complete in Bangalore?',
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

  const categories = ['All', 'Quality & Warranty', 'General', 'Pricing & Escrow', 'Approvals'];

  const filteredFaqs = activeCategory === 'All'
    ? faqData
    : faqData.filter(f => f.category === activeCategory);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200/60" id="faq">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Title & Support Person Card */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
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
              Everything you need to know about interior estimation, escrow stage safety, 45-day delivery, and 15-year warranties in Bangalore.
            </p>
          </div>

          {/* Support Representative Card */}
          <div className="bg-slate-900 p-7 rounded-[32px] text-white shadow-2xl flex items-center gap-5 border border-slate-800 relative overflow-hidden">
            <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl" />

            <img
              alt="Kiran - Senior Support Advisor"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shrink-0 shadow-md"
              src="/images/indian_professional_man_1.png"
            />
            <div className="space-y-1">
              <p className="font-extrabold text-base text-white">Hello, I'm Kiran From Support</p>
              <p className="text-slate-400 text-xs font-normal">
                Have specific design or budget questions? Talk to our designers directly.
              </p>
              <button
                type="button"
                onClick={openCallModal}
                className="mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                Ask a Question <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Category Filter Pills & Accordion */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-3xl transition-all duration-200 overflow-hidden border ${
                    isOpen
                      ? 'bg-[#1C1C1C] text-white border-white/10 shadow-2xl'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base md:text-lg cursor-pointer select-none"
                  >
                    <span className="leading-snug">{faq.question}</span>
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-amber-500 text-slate-950 rotate-180'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 text-slate-600 text-sm leading-relaxed">
                      <p className="mb-3">{faq.answer}</p>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-t border-slate-200/60 pt-3">
                        <span className="text-amber-600 font-bold">Category: {faq.category}</span>
                        <button
                          type="button"
                          onClick={openCallModal}
                          className="hover:text-slate-900 underline transition-colors cursor-pointer"
                        >
                          Need more details? Talk to Advisor →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
