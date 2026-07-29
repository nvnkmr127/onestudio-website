'use client';

import { useState, useEffect } from 'react';
import { openCallModal } from '@/components/CallModal';

export default function StickyQuoteCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center bg-slate-950 border-t border-white/10 px-4 py-3 gap-3 shadow-2xl">
        {/* Phone */}
        <a
          href="tel:+919999999999"
          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-800 text-white shrink-0 text-xl"
          aria-label="Call us"
        >
          📞
        </a>

        {/* CTA Button */}
        <button
          type="button"
          onClick={openCallModal}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider py-3.5 rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95"
        >
          Get Free Quote
        </button>
      </div>
    </div>
  );
}
