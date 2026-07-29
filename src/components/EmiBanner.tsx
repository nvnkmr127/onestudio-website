'use client';

import Link from 'next/link';
import { openCallModal } from '@/components/CallModal';

const EMI_OPTIONS = [
  { months: 12, amount: '₹8,999', label: 'Easy Start' },
  { months: 24, amount: '₹4,999', label: 'Most Popular' },
  { months: 36, amount: '₹3,499', label: 'Comfortable' },
];

export default function EmiBanner() {
  return (
    <section className="py-14 md:py-16 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 font-sans overflow-hidden relative">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,0,0,.3) 39px,rgba(0,0,0,.3) 40px), repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,0,0,.3) 39px,rgba(0,0,0,.3) 40px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Headline */}
          <div className="text-center lg:text-left space-y-2">
            <p className="text-slate-950/70 text-xs font-extrabold uppercase tracking-widest">
              No-Cost EMI · Zero Down Payment · Instant Approval
            </p>
            <h2 className="text-2xl md:text-4xl font-black text-slate-950 leading-tight">
              Your Dream Interiors,<br className="hidden md:block" /> Starting Just{' '}
              <span className="underline decoration-wavy decoration-slate-950/30">₹8,999/month</span>
            </h2>
            <p className="text-slate-950/70 text-sm font-medium">
              Available on all projects above ₹2.5 Lakhs · 10+ partner banks &amp; NBFCs
            </p>
          </div>

          {/* Middle: EMI Cards */}
          <div className="flex gap-3 flex-wrap justify-center">
            {EMI_OPTIONS.map((opt) => (
              <div
                key={opt.months}
                className="bg-white/25 backdrop-blur-md rounded-2xl px-5 py-4 text-center min-w-[110px] border border-white/40"
              >
                {opt.months === 24 && (
                  <span className="block text-[9px] bg-slate-950 text-amber-400 font-black uppercase tracking-wider rounded-full px-2 py-0.5 mb-1.5 inline-block">
                    Popular
                  </span>
                )}
                <div className="text-slate-950 text-2xl font-black">{opt.amount}</div>
                <div className="text-slate-950/70 text-[10px] font-bold">/month</div>
                <div className="text-slate-950/60 text-[10px] mt-0.5">{opt.months}-month EMI</div>
              </div>
            ))}
          </div>

          {/* Right: CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 items-center">
            <button
              type="button"
              onClick={openCallModal}
              className="bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider px-7 py-3.5 rounded-full shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              Check EMI Eligibility →
            </button>
            <Link
              href="/contact"
              className="text-slate-950 text-xs font-bold underline underline-offset-2 hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              Talk to finance team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
