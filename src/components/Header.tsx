'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { openCallModal } from '@/components/CallModal';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Interior Estimator', href: '/estimate' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'News', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 py-4 transition-all duration-300">
      <nav
        className={`max-w-7xl mx-auto flex justify-between items-center rounded-full px-6 md:px-8 py-3.5 transition-all duration-300 backdrop-blur-md ${
          isScrolled
            ? 'bg-white/80 border border-slate-200/80 shadow-2xl text-slate-900'
            : 'bg-white/10 border border-white/20 shadow-lg text-white'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <img
            src={isScrolled ? '/images/logo-dark.svg' : '/images/logo.svg'}
            alt="One Studio Logo"
            className="h-10 md:h-11 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center space-x-7 text-xs lg:text-sm font-semibold">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? 'text-amber-500 font-black'
                      : isScrolled
                      ? 'text-slate-900 hover:text-amber-600'
                      : 'text-slate-200 hover:text-amber-400'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={openCallModal}
            className="flex bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full font-extrabold text-[11px] sm:text-xs uppercase tracking-wider items-center gap-1.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">Get a Quote</span>
            <span className="sm:hidden">Quote 📞</span>
            <span className="bg-black/20 rounded-full p-0.5 text-[10px] hidden sm:inline-block">→</span>
          </button>

          {/* Hamburger Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg focus:outline-none transition-colors ${
              isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-slate-800'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto mt-2 bg-[#111111]/95 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <ul className="space-y-3 text-slate-200 font-semibold text-base">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 rounded-xl hover:bg-slate-800 hover:text-amber-400 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-2xl uppercase tracking-wider text-sm shadow-md"
          >
            Get a Quote →
          </Link>
        </div>
      )}
    </header>
  );
}
