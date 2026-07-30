'use client';

import React, { useState, useEffect } from 'react';

export function openLuxeCallModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('open-luxe-modal'));
  }
}

export default function LuxeCallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-luxe-modal', handleOpen);
    return () => window.removeEventListener('open-luxe-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in font-sans"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-[#080B12] rounded-[40px] border border-amber-500/40 shadow-[0_0_80px_rgba(212,175,55,0.25)] p-6 sm:p-9 text-white overflow-hidden max-h-[92vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#0E1320] border border-amber-500/30 text-amber-300 hover:text-white hover:bg-neutral-900 flex items-center justify-center font-black text-sm transition-all cursor-pointer z-20"
          aria-label="Close modal"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center text-3xl mx-auto shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              👑
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-serif-luxe italic text-gold-foil">
                VVIP Request Received
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto">
                Thank you, <span className="text-amber-300 font-bold">{formData.name}</span>. Your Principal Architect will contact you directly within 30 minutes.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <a
                href={`https://wa.me/919014303409?text=${encodeURIComponent(
                  `Hello One Studio Luxe, I have requested a VVIP appointment.\nName: ${formData.name}\nPhone: ${formData.phone}\nLocation: ${formData.location}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Connect via WhatsApp Concierge 💬
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-[#0E1320] hover:bg-[#121829] text-slate-300 font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl border border-neutral-800"
              >
                Return to Luxe Gallery
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E1320] border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-[0.25em]">
                <span>👑</span>
                <span>VVIP PRIVATE CONSULTATION</span>
              </div>
              <h2 className="text-2xl font-black font-serif-luxe italic text-white tracking-tight">
                Book Studio Session
              </h2>
              <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">
                Closed-door Jubilee Hills appointment with Lead Principal Architect.
              </p>
            </div>

            {/* Simple 3-Field Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Field 1: Full Name */}
              <div className="bg-[#0E1320]/90 p-3.5 rounded-2xl border border-amber-500/30 focus-within:border-amber-400 transition-colors">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharajah Rao / Dr. Ananya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none font-medium"
                />
              </div>

              {/* Field 2: Phone Number */}
              <div className="bg-[#0E1320]/90 p-3.5 rounded-2xl border border-amber-500/30 focus-within:border-amber-400 transition-colors">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-1">
                  PHONE / WHATSAPP NUMBER *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Field 3: Property Location */}
              <div className="bg-[#0E1320]/90 p-3.5 rounded-2xl border border-amber-500/30 focus-within:border-amber-400 transition-colors">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-1">
                  PROPERTY LOCATION *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jubilee Hills, Gachibowli, Banjara Hills"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-foil text-black font-black text-xs uppercase tracking-[0.25em] py-4 rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Reserving Session...' : 'Confirm VVIP Session 👑 →'}
                </button>
                <p className="text-[10px] font-semibold text-slate-500 text-center mt-2.5">
                  🔒 Strictly protected under Non-Disclosure Agreement (NDA).
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
