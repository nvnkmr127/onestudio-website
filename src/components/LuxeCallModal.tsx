'use client';

import React, { useEffect, useState } from 'react';
import { submitLeadAction } from '@/app/actions/leadActions';

export function openLuxeCallModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-luxe-modal'));
  }
}

export default function LuxeCallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSubmitted(false);
      setErrorMsg('');
    };

    window.addEventListener('open-luxe-modal', handleOpen);
    return () => window.removeEventListener('open-luxe-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await submitLeadAction({
        name,
        phone,
        message: address ? `Luxe Location / Address: ${address}` : undefined,
        sourcePage: 'One Studio Luxe Consultation',
      });

      if (res.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(res.error || 'Submission failed. Please call +91 9014303409');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in font-sans">
      {/* Outer Split Card Modal Container (Exact layout as CallModal) */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-black rounded-2xl sm:rounded-3xl md:rounded-[36px] border border-amber-500/40 shadow-[0_0_80px_rgba(212,175,55,0.3)] grid grid-cols-1 md:grid-cols-12 text-white">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center text-lg font-bold transition-all cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left Column: Luxe Image with Curved Arch Boundary */}
        <div className="md:col-span-6 relative hidden md:block min-h-[460px] overflow-hidden">
          <img
            src="/images/luxury_living_room_hero.png"
            alt="One Studio Luxe Interior"
            className="w-full h-full object-cover brightness-75"
          />
          {/* Curved Oval Arch Boundary Overlay */}
          <div className="absolute inset-y-0 right-0 w-24 bg-black [clip-path:ellipse(100%_100%_at_100%_50%)]" />
        </div>

        {/* Right Column: Form & Highlights */}
        <div className="md:col-span-6 p-5 sm:p-8 md:p-10 flex flex-col justify-between">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4 my-auto animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-300 font-black text-3xl mx-auto flex items-center justify-center border border-amber-500/50 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                👑
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-serif-luxe italic text-gold-foil">
                VVIP Request Received!
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto">
                Thank you <span className="text-amber-300 font-bold">{name}</span>! Our Senior Principal Architect will call you at{' '}
                <span className="text-amber-300 font-bold">+91 {phone}</span> regarding your residence in <span className="text-white font-semibold">{address || 'Hyderabad'}</span>.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <a
                  href={`https://wa.me/919014303409?text=${encodeURIComponent(
                    `Hello One Studio Luxe, I have requested a VVIP appointment.\nName: ${name}\nPhone: ${phone}\nLocation: ${address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Connect via WhatsApp Concierge 💬
                </a>
                <button
                  onClick={handleClose}
                  className="bg-neutral-900 hover:bg-neutral-800 text-slate-300 font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full border border-neutral-800 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header Title & Subtitle */}
              <div className="space-y-1.5 mt-1">
                <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-[0.25em]">
                  👑 VVIP LUXE APPOINTMENT
                </span>
                <h3 className="text-2xl md:text-3xl font-black font-serif-luxe italic text-white tracking-tight">
                  Book Studio Session
                </h3>
                <p className="text-slate-400 text-xs font-medium">
                  Closed-door Jubilee Hills appointment with Lead Principal Architect.
                </p>
              </div>

              {/* Form Input Box */}
              <form onSubmit={handleSubmit} className="my-4 space-y-3">
                {/* Name Input */}
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Your Full Name *"
                    className="w-full border border-amber-500/30 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all bg-neutral-950 shadow-sm"
                  />
                </div>

                {/* Phone Input with Country Code */}
                <div className="flex items-center border border-amber-500/30 rounded-xl overflow-hidden focus-within:border-amber-400 transition-all bg-neutral-950 shadow-sm">
                  <div className="flex items-center gap-1.5 px-3 py-3 bg-neutral-900 border-r border-neutral-800 text-amber-300 font-extrabold text-sm shrink-0">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter Mobile Number *"
                    className="w-full px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:outline-none bg-transparent"
                  />
                </div>

                {/* Address / Location Input */}
                <div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Property Address / Location (e.g. Jubilee Hills, Gachibowli) *"
                    className="w-full border border-amber-500/30 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all bg-neutral-950 shadow-sm"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold rounded-xl">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2 relative">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full bg-gold-foil text-black font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 group overflow-hidden"
                  >
                    <span>{isSubmitting ? 'Reserving Session...' : 'Confirm VVIP Session 👑'}</span>
                    <span className="bg-slate-950 text-amber-300 rounded-full w-5 h-5 flex items-center justify-center group-hover:translate-x-1 transition-transform text-xs font-black">
                      →
                    </span>
                  </button>
                </div>
              </form>

              {/* 3 Highlights */}
              <div className="pt-3 border-t border-neutral-900 grid grid-cols-3 gap-2 text-center">
                <div className="space-y-0.5">
                  <div className="text-amber-400 text-xs font-black">100% NDA</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Strict Privacy</div>
                </div>
                <div className="space-y-0.5 border-x border-neutral-900">
                  <div className="text-amber-400 text-xs font-black">15-Yr Warranty</div>
                  <div className="text-[10px] text-slate-400 font-semibold">BWP Plywood</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-amber-400 text-xs font-black">Principal Architect</div>
                  <div className="text-[10px] text-slate-400 font-semibold">1-on-1 Assigned</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
