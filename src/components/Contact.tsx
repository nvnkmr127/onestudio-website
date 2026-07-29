'use client';

import React, { useState } from 'react';
import { openCallModal } from '@/components/CallModal';
import { submitLeadAction } from '@/app/actions/leadActions';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await submitLeadAction({
        name,
        phone,
        email,
        message,
        sourcePage: 'Contact Form',
      });

      if (res.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(res.error || 'Failed to submit form. Please try calling us directly.');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-20 md:pt-28 pb-32 bg-slate-50 font-sans relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* Main Contact Split Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch relative z-10">
          {/* Left Column: Dark Info Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900 rounded-[36px] md:rounded-[44px] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 bg-[#f2bd19]/15 rounded-full blur-3xl" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2bd19]/20 border border-[#f2bd19]/40 text-[#f2bd19] text-xs font-black uppercase tracking-widest">
                📍 HBR Layout, Bengaluru HQ
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                Build Your Dream Home With Us
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                Visit our HBR Layout Experience Center or speak directly with our senior interior designers and space planners.
              </p>
            </div>

            <div className="my-6 relative z-10">
              <img
                alt="One Studio Hyderabad Interior Design Studio"
                className="w-full h-52 object-cover rounded-3xl border border-white/10 shadow-lg"
                src="/images/bangalore_architect_planning.png"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-sm relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#f2bd19] text-slate-900 flex items-center justify-center font-bold shrink-0">
                  📞
                </div>
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Direct Consultation Line</p>
                  <a href="tel:+919014303409" className="font-extrabold text-white text-base hover:text-[#f2bd19] transition-colors">
                    +91 9014303409
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#f2bd19] flex items-center justify-center font-bold shrink-0">
                  ✉️
                </div>
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Email Support</p>
                  <a href="mailto:reachus@onestudio.co.in" className="font-bold text-slate-200 hover:text-[#f2bd19] transition-colors">
                    reachus@onestudio.co.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#f2bd19] flex items-center justify-center font-bold shrink-0">
                  🏢
                </div>
                <div>
                  <p className="text-[10px] uppercase font-extrabold text-slate-400">Office Location</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-300 text-xs leading-relaxed hover:text-[#f2bd19] hover:underline transition-colors block"
                  >
                    Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033 ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-[36px] md:rounded-[44px] p-8 md:p-12 shadow-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-[3px] bg-[#f2bd19] rounded-full" />
                <span className="text-slate-900 font-black uppercase tracking-widest text-xs">
                  GET IN TOUCH
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                Let's Work Together
              </h2>

              <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                We'd love to share more with you. Please complete this form and our team will get back to you shortly.
              </p>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4 animate-fade-in my-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white font-black text-3xl mx-auto flex items-center justify-center shadow-md">
                    ✓
                  </div>
                  <h4 className="text-2xl font-black text-emerald-950">Thank You, {name}!</h4>
                  <p className="text-emerald-800 text-sm leading-relaxed max-w-md mx-auto">
                    Your message has been received. Our Hyderabad team will contact you at <span className="font-bold text-emerald-950">{phone}</span> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-[#f2bd19] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-[#f2bd19] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-800 focus:outline-none focus:border-[#f2bd19] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your Message..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm text-slate-800 focus:outline-none focus:border-[#f2bd19] focus:bg-white transition-all"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#f2bd19] hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-extrabold text-xs uppercase tracking-wider px-10 py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? 'SENDING...' : 'CONTACT NOW'}{' '}
                    <span className="bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                      →
                    </span>
                  </button>
                </form>
              )}
            </div>

            <p className="text-[11px] text-slate-400 font-medium mt-6 pt-4 border-t border-slate-100">
              🔒 100% Data Confidentiality • Zero Spam Policy
            </p>
          </div>
        </div>

        {/* OVERLAPPING CREATIVE GOOGLE MAPS SHOWCASE CONTAINER */}
        <div className="relative z-30 pt-6">
          <div className="bg-white rounded-[40px] md:rounded-[48px] p-4 sm:p-6 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.25)] border-2 border-[#f2bd19]/30 relative overflow-hidden">
            {/* Top Floating Header Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 px-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#f2bd19] text-slate-900 flex items-center justify-center font-black shadow-md shrink-0">
                  📍
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#f2bd19] block">
                    INTERACTIVE MAP NAVIGATION
                  </span>
                  <h4 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                    One Studio Experience Center — Jubilee Hills
                  </h4>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f2bd19] hover:bg-amber-500 text-slate-900 font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
                >
                  OPEN MAPS APP ↗
                </a>

                <button
                  type="button"
                  onClick={openCallModal}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer w-full sm:w-auto text-center"
                >
                  BOOK VISIT 📞
                </button>
              </div>
            </div>

            {/* Overlapping Embedded Map Frame */}
            <div className="relative w-full h-[380px] sm:h-[480px] rounded-[32px] overflow-hidden border border-slate-200/80 shadow-inner group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5037250998325!2d78.33368999999999!3d17.4355883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93abc0348f15%3A0x94769af9f9ef2991!2sThe%20Lobster%20Kitchen!5e0!3m2!1sen!2sin!4v1785341054090!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full"
              />

              {/* Overlapping Bottom-Left Glass Badge */}
              <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-2xl text-white flex items-center gap-3 pointer-events-none max-w-sm">
                <span className="text-xl shrink-0">🏢</span>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase text-[#f2bd19] block truncate">
                    Jubilee Hills, Hyderabad
                  </span>
                  <span className="text-xs text-slate-200 font-semibold block truncate">
                    Road No. 36, Telangana 500033
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
