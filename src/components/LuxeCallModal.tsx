'use client';

import React, { useState, useEffect } from 'react';

// Custom event dispatcher to trigger Luxe VIP Modal globally or per page
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
    propertyType: 'Luxury Villa (4,500+ sq.ft)',
    handoverDate: 'Immediate / Within 3 Months',
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
    }, 800);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in font-sans">
      <div
        className="relative w-full max-w-lg bg-black rounded-[36px] border border-amber-500/50 shadow-[0_0_60px_rgba(212,175,55,0.3)] p-6 sm:p-10 text-white overflow-hidden max-h-[92vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center font-black text-lg transition-all cursor-pointer z-10"
          aria-label="Close modal"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center text-3xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              👑
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-serif-luxe italic text-gold-foil">
                VVIP Request Received
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-sm mx-auto">
                Thank you, <span className="text-amber-300 font-bold">{formData.name}</span>. Your Senior Principal Architect has been notified and will contact you directly within 30 minutes.
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
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-slate-300 font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl border border-neutral-800"
              >
                Return to Luxe Gallery
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-[0.25em]">
                👑 VVIP LUXE APPOINTMENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif-luxe italic text-white tracking-tight">
                Book Private Studio Session
              </h2>
              <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">
                Closed-door appointment at Jubilee Hills Studio with a Senior Principal Architect.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharajah Rao / Dr. Ananya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-amber-500/30 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-neutral-950 border border-amber-500/30 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                    Hyderabad Locality
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-neutral-950 border border-amber-500/30 rounded-2xl px-3 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Jubilee Hills">Jubilee Hills</option>
                    <option value="Banjara Hills">Banjara Hills</option>
                    <option value="Gachibowli">Gachibowli</option>
                    <option value="Financial District">Financial District</option>
                    <option value="Hitec City">Hitec City</option>
                    <option value="Other Hyderabad Locality">Other Hyderabad</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                    Residence Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full bg-neutral-950 border border-amber-500/30 rounded-2xl px-3 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Luxury Villa (4,500+ sq.ft)">Luxury Villa (4.5k+ sqft)</option>
                    <option value="Sky Penthouse (3,500+ sq.ft)">Sky Penthouse (3.5k+ sqft)</option>
                    <option value="Duplex Apartment (2,800+ sq.ft)">Duplex Apartment</option>
                    <option value="4BHK+ Premium Residence">4BHK+ Premium Residence</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-foil text-black font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Confirming VVIP Appointment...' : 'Request Private VVIP Appointment 👑 →'}
                </button>
                <p className="text-[10px] font-semibold text-slate-500 text-center mt-2">
                  🔒 Protected by strict VVIP Non-Disclosure Agreement (NDA).
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
