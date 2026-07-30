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

  const LOCALITIES = ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Financial District', 'Hitec City'];
  const PROPERTY_TYPES = ['Luxury Villa', 'Sky Penthouse', 'Duplex Residence', '4BHK+ Estate'];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in font-sans"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-black rounded-[40px] border border-amber-500/50 shadow-[0_0_80px_rgba(212,175,55,0.3)] p-6 sm:p-10 text-white overflow-hidden max-h-[92vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-neutral-950 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-neutral-900 flex items-center justify-center font-black text-sm transition-all cursor-pointer z-10"
          aria-label="Close modal"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center text-3xl mx-auto shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              👑
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-serif-luxe italic text-gold-foil">
                VVIP Consultation Reserved
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto">
                Thank you, <span className="text-amber-300 font-bold">{formData.name}</span>. Your Senior Principal Architect has been notified for your confidential Jubilee Hills appointment.
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
                Connect via WhatsApp Concierge 💬
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-neutral-950 hover:bg-neutral-900 text-slate-300 font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl border border-neutral-800"
              >
                Return to Luxe Gallery
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                👑 PRIVATE VVIP APPOINTMENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif-luxe italic text-white tracking-tight">
                Studio Consultation
              </h2>
              <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">
                Closed-door Jubilee Hills appointment with Lead Principal Architect.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 text-left pt-2">
              {/* Floating Underline Input: Name */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Maharajah / Dr. Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-amber-500/40 focus:border-amber-300 pb-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors font-medium"
                />
              </div>

              {/* Floating Underline Input: Phone */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
                  PHONE / WHATSAPP NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-amber-500/40 focus:border-amber-300 pb-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors font-medium"
                />
              </div>

              {/* Locality Pill Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 block">
                  HYDERABAD LOCALITY
                </label>
                <div className="flex flex-wrap gap-2">
                  {LOCALITIES.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setFormData({ ...formData, location: loc })}
                      className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                        formData.location === loc
                          ? 'bg-gold-foil text-black font-black shadow-md scale-105'
                          : 'bg-neutral-950 text-slate-400 border border-neutral-800 hover:border-amber-500/40'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type Pill Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 block">
                  RESIDENCE MODEL
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROPERTY_TYPES.map((prop) => (
                    <button
                      key={prop}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: prop })}
                      className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all text-center cursor-pointer ${
                        formData.propertyType === prop
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black shadow-md'
                          : 'bg-neutral-950 text-slate-300 border border-neutral-800 hover:border-amber-500/40'
                      }`}
                    >
                      {prop}
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
                  {isSubmitting ? 'Reserving Appointment...' : 'Request Private VVIP Appointment 👑 →'}
                </button>
                <p className="text-[10px] font-semibold text-slate-500 text-center mt-2.5">
                  🔒 Strictly protected by Non-Disclosure Agreement (NDA).
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
