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
    location: 'Jubilee Hills',
    propertyType: 'Luxury Villa',
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
    }, 700);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
  };

  const LOCALITIES = ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Financial District'];
  const RESIDENCES = [
    { title: 'Luxury Villa', sub: '4,500+ Sq.Ft' },
    { title: 'Sky Penthouse', sub: '3,500+ Sq.Ft' },
    { title: 'Duplex Residence', sub: '2,800+ Sq.Ft' },
    { title: 'Custom Estate', sub: 'Full Turnkey' },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in font-sans"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#080B12] rounded-[44px] border border-amber-500/40 shadow-[0_0_80px_rgba(212,175,55,0.25)] p-6 sm:p-9 text-white overflow-hidden max-h-[94vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />

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
              <h3 className="text-2xl sm:text-3xl font-black font-serif-luxe italic text-gold-foil">
                VVIP Passport Issued
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto">
                Thank you, <span className="text-amber-300 font-bold">{formData.name}</span>. Your Principal Architect has reserved your private Jubilee Hills consultation.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <a
                href={`https://wa.me/919014303409?text=${encodeURIComponent(
                  `Hello One Studio Luxe, I have booked a VVIP Studio appointment.\nName: ${formData.name}\nLocation: ${formData.location}\nProperty: ${formData.propertyType}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Open WhatsApp Concierge 💬
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E1320] border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <span>👑</span>
                <span>VVIP PRIVATE PASSPORT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif-luxe italic text-white tracking-tight">
                Reserved Consultation
              </h2>
              <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">
                Private Jubilee Hills appointment with Lead Principal Architect.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Form Input Card: Name */}
              <div className="bg-[#0E1320]/80 p-3.5 rounded-2xl border border-amber-500/25 focus-within:border-amber-400 transition-colors">
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

              {/* Form Input Card: Phone */}
              <div className="bg-[#0E1320]/80 p-3.5 rounded-2xl border border-amber-500/25 focus-within:border-amber-400 transition-colors">
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

              {/* Locality Selector Tiles */}
              <div className="space-y-2 pt-1">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block">
                  SELECT HYDERABAD LOCALITY
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LOCALITIES.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setFormData({ ...formData, location: loc })}
                      className={`px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all text-center cursor-pointer ${
                        formData.location === loc
                          ? 'bg-gold-foil text-black font-black shadow-md scale-[1.02]'
                          : 'bg-[#0E1320] text-slate-400 border border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      📍 {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Residence Model Keycards */}
              <div className="space-y-2 pt-1">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block">
                  RESIDENCE MODEL
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {RESIDENCES.map((res) => (
                    <button
                      key={res.title}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: res.title })}
                      className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                        formData.propertyType === res.title
                          ? 'bg-gradient-to-br from-amber-500 via-amber-400 to-amber-500 text-black shadow-lg scale-[1.02]'
                          : 'bg-[#0E1320] text-slate-300 border border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      <span className="text-xs font-black">{res.title}</span>
                      <span className="text-[9px] font-extrabold opacity-75">{res.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-foil text-black font-black text-xs uppercase tracking-[0.25em] py-4 rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Issuing VVIP Passport...' : 'Confirm VVIP Consultation 👑 →'}
                </button>
                <p className="text-[10px] font-semibold text-slate-500 text-center mt-2.5">
                  🔒 Protected under strict VVIP Non-Disclosure Agreement (NDA).
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
