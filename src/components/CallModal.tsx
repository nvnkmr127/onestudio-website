'use client';

import React, { useEffect, useState } from 'react';
import { submitLeadAction } from '@/app/actions/leadActions';

export function openCallModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-call-modal'));
  }
}

export default function CallModal() {
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

    window.addEventListener('open-call-modal', handleOpen);
    return () => window.removeEventListener('open-call-modal', handleOpen);
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
        message: address ? `Plot Location / Address: ${address}` : undefined,
        sourcePage: 'Call Modal Consultation',
      });

      if (res.success) {
        setIsSubmitted(true);
        try {
          const { trackLeadSubmit } = await import('@/lib/track');
          trackLeadSubmit({
            name,
            phone,
            sourcePage: 'Call Modal Consultation',
          });
        } catch {
          // Ignore analytics dispatch error
        }
      } else {
        setErrorMsg(res.error || 'Submission failed. Please call +91 9014303409');
      }
    } catch (err) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      {/* Outer Split Card Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl md:rounded-[36px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 text-slate-800">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center text-lg font-bold transition-all"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left Column: Image with Curved Arch Boundary */}
        <div className="md:col-span-6 relative hidden md:block min-h-[460px] overflow-hidden">
          <img
            src="/images/bangalore_architect_planning.png"
            alt="Architect planning material samples"
            className="w-full h-full object-cover"
          />
          {/* Curved Oval Arch Boundary Overlay */}
          <div className="absolute inset-y-0 right-0 w-24 bg-white [clip-path:ellipse(100%_100%_at_100%_50%)]" />
        </div>

        {/* Right Column: Form & Highlights */}
        <div className="md:col-span-6 p-8 md:p-10 flex flex-col justify-between">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4 my-auto animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 font-black text-3xl mx-auto flex items-center justify-center border border-emerald-200">
                ✓
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Callback Requested!
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
                Thank you <span className="text-primary-orange font-bold">{name || 'there'}</span>! Our senior Hyderabad interior design advisor will call you at{' '}
                <span className="text-primary-orange font-bold">+91 {phone}</span> regarding property at <span className="text-slate-900 font-semibold">{address || 'Hyderabad'}</span> within 2 hours.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 bg-primary-orange hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md transition-all"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              {/* Header Title & Subtitle */}
              <div className="space-y-1 mt-1">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Get Free Consultation
                </h3>
                <p className="text-slate-500 text-xs font-medium">
                  Enter your details to receive personalized quote &amp; 3D floor plan
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
                    placeholder="Enter Your Full Name"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange transition-all bg-white shadow-sm"
                  />
                </div>

                {/* Phone Input with Country Code */}
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:border-primary-orange focus-within:ring-1 focus-within:ring-primary-orange transition-all bg-white shadow-sm">
                  <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-50 border-r border-slate-200 text-slate-700 font-extrabold text-sm shrink-0">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                    <span className="text-[10px] text-slate-400">▾</span>
                  </div>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter Mobile Number"
                    className="w-full px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                {/* Address / Location Input */}
                <div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Property Address / Location (e.g. Jubilee Hills, Gachibowli)"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange transition-all bg-white shadow-sm"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-orange hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-sm tracking-wide py-3.5 rounded-xl shadow-md transition-all uppercase cursor-pointer mt-1"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'CONTINUE'}
                </button>
              </form>

              {/* Divider & 4 Benefit Highlights */}
              <div>
                <div className="relative flex items-center justify-center mb-3">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-slate-400 whitespace-nowrap">
                    Why choose One Studio?
                  </span>
                  <div className="border-t border-slate-200 w-full" />
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px] font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500">✏️</span> Personalised Designs.
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500">₹</span> Transparent Pricing.
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500">🎖️</span> Flat 10-year warranty.
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500">📅</span> On Time Completion.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
