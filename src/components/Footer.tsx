'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { openCallModal } from '@/components/CallModal';

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="relative font-sans bg-black">
      {/* Floating CTA Banner overlapping Footer */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 -mb-32">
        <div className="bg-[#111111] text-white rounded-[32px] md:rounded-[40px] p-8 md:p-14 border border-white/10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest">
                ⚡ Ready To Transform Your Home Interiors?
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Get Free 3D VR Space Plan &amp; Interior Cost Quote
              </h3>
              <p className="text-slate-400 text-sm md:text-base font-normal max-w-2xl">
                Schedule a 1-on-1 consultation with Hyderabad's leading interior designers today.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/estimate"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider py-4 px-6 rounded-2xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                LAUNCH COST ESTIMATOR{' '}
                <span className="bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  →
                </span>
              </Link>

              <button
                type="button"
                onClick={openCallModal}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm uppercase tracking-wider py-4 px-6 rounded-2xl border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                TALK TO AN ADVISOR 📞
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Container */}
      <footer className="bg-[#111111] pt-48 pb-10 text-gray-400 text-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-16">
            {/* Column 1: Brand Info & Social Media Icons */}
            <div className="col-span-1 space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/images/logo.svg"
                  alt="One Studio Logo"
                  className="h-14 w-auto object-contain drop-shadow-md"
                />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm font-normal">
                Hyderabad's premier luxury home interior design studio delivering bespoke homes with 150+ quality checks, escrow payment safety, and 10-year woodwork warranty.
              </p>

              {/* Social Media SVG Icon Row */}
              <div className="flex items-center gap-3 pt-2">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-gray-300 flex items-center justify-center transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-gray-300 flex items-center justify-center transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-gray-300 flex items-center justify-center transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-gray-300 flex items-center justify-center transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* WhatsApp Direct Chat */}
                <a
                  href="https://wa.me/919014303409"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all shadow-sm border border-emerald-500/30"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links (Collapsible on Mobile) */}
            <div className="border-b md:border-none border-white/10 pb-4 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('links')}
                className="w-full flex justify-between items-center text-white font-bold mb-4 md:mb-8 uppercase tracking-widest text-xs cursor-pointer md:cursor-default"
              >
                <span>Quick Links</span>
                <span className="md:hidden text-amber-400 font-black text-lg">
                  {openSection === 'links' ? '−' : '+'}
                </span>
              </button>
              <ul className={`space-y-3.5 text-sm font-medium transition-all ${openSection === 'links' ? 'block' : 'hidden md:block'}`}>
                <li>
                  <Link href="/" className="hover:text-amber-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/estimate" className="text-amber-400 font-bold hover:underline transition-colors">
                    Interior Estimator
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-amber-400 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-amber-400 transition-colors">
                    Interior Services
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-amber-400 transition-colors">
                    Our Projects
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-amber-400 transition-colors">
                    News &amp; Articles
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Services (Collapsible on Mobile) */}
            <div className="border-b md:border-none border-white/10 pb-4 md:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('services')}
                className="w-full flex justify-between items-center text-white font-bold mb-4 md:mb-8 uppercase tracking-widest text-xs cursor-pointer md:cursor-default"
              >
                <span>Services</span>
                <span className="md:hidden text-amber-400 font-black text-lg">
                  {openSection === 'services' ? '−' : '+'}
                </span>
              </button>
              <ul className={`space-y-3.5 text-sm font-medium transition-all ${openSection === 'services' ? 'block' : 'hidden md:block'}`}>
                <li>
                  <Link href="/services" className="hover:text-amber-400 transition-colors">
                    Turnkey Home Interiors
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-amber-400 transition-colors">
                    3D VR Space Planning
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-amber-400 transition-colors">
                    Modular Kitchen Design
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-amber-400 transition-colors">
                    Custom Wardrobes &amp; Living
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Office Location & Contact Info (Sleek Minimalist Ring-Icon List) */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('office')}
                className="w-full flex justify-between items-center text-white font-bold mb-4 md:mb-8 uppercase tracking-widest text-xs cursor-pointer md:cursor-default"
              >
                <span>Hyderabad Office</span>
                <span className="md:hidden text-amber-400 font-black text-lg">
                  {openSection === 'office' ? '−' : '+'}
                </span>
              </button>

              <ul className={`space-y-4 text-xs transition-all ${openSection === 'office' ? 'block' : 'hidden md:block'}`}>
                {/* Address Row */}
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-base">location_on</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      VISIT OUR EXPERIENCE CENTER
                    </span>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 group-hover:text-white font-medium leading-relaxed block group-hover:underline transition-colors"
                    >
                      Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033 ↗
                    </a>
                  </div>
                </li>

                {/* Phone Row */}
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-base">call</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      DIRECT PHONE
                    </span>
                    <a
                      href="tel:+919014303409"
                      className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors block"
                    >
                      +91 9014303409
                    </a>
                  </div>
                </li>

                {/* Email Row */}
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-base">mail</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      EMAIL ADDRESS
                    </span>
                    <a
                      href="mailto:reachus@onestudio.co.in"
                      className="text-xs font-bold text-amber-400 group-hover:underline transition-colors block truncate"
                    >
                      reachus@onestudio.co.in
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase font-bold tracking-widest text-gray-500 text-center md:text-left">
            <p>© {new Date().getFullYear()} One Studio Interior Designs Pvt. Ltd. All Rights Reserved.</p>
            <div className="flex space-x-6">
              <Link href="/contact" className="hover:text-gray-300">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-gray-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
