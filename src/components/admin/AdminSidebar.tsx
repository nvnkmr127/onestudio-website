'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: 'Overview & Content',
    items: [
      { label: 'Dashboard & Blog Writer', href: '/admin/dashboard', icon: '📝' },
      { label: 'Universal Page Editor', href: '/admin/dashboard/pages', icon: '📄' },
      { label: 'Image SEO & OG Cards', href: '/admin/dashboard/media', icon: '🖼️' },
    ],
  },
  {
    groupLabel: 'Local & Geo SEO',
    items: [
      { label: 'Geo Pages & NAP Audit', href: '/admin/dashboard/geo', icon: '📍', badge: 'HBR' },
      { label: 'Schema.org Studio', href: '/admin/dashboard/schema', icon: '🧱' },
    ],
  },
  {
    groupLabel: 'Technical & Crawl',
    items: [
      { label: 'Sitemap Control', href: '/admin/dashboard/crawl/sitemap', icon: '🗺️' },
      { label: 'Robots.txt Editor', href: '/admin/dashboard/crawl/robots', icon: '🤖' },
      { label: 'Redirects (301/302)', href: '/admin/dashboard/crawl/redirects', icon: '🔀' },
      { label: 'Technical SEO & Vitals', href: '/admin/dashboard/tech', icon: '⚙️' },
    ],
  },
  {
    groupLabel: 'Analytics & Insights',
    items: [
      { label: 'Search Console Insights', href: '/admin/dashboard/insights', icon: '📈' },
      { label: 'Analytics, Pixel & CAPI', href: '/admin/dashboard/tracking', icon: '📊' },
      { label: 'Health Audits & Drift', href: '/admin/dashboard/audits', icon: '🚨' },
      { label: 'AI Search & llms.txt', href: '/admin/dashboard/ai', icon: '🤖', badge: 'SGE' },
    ],
  },
  {
    groupLabel: 'System & Settings',
    items: [
      { label: 'Global Settings & NAP', href: '/admin/dashboard/settings', icon: '🛠️' },
    ],
  },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('onestudio_admin_token');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-[#f2bd19] selection:text-slate-950">
      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden bg-[#0c101c] border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f2bd19] text-slate-950 font-black flex items-center justify-center text-base shadow-md">
            O
          </div>
          <div>
            <span className="font-black text-sm text-white tracking-tight">ONE STUDIO</span>
            <span className="text-[10px] text-[#f2bd19] font-mono block">SEO CONTROL PLANE</span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-72 bg-[#0c101c] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } h-screen overflow-y-auto shrink-0 shadow-2xl`}
      >
        <div className="p-5 space-y-6">
          {/* Logo Brand Box */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f2bd19] to-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg shadow-[#f2bd19]/10">
                O
              </div>
              <div>
                <span className="font-black text-sm text-white tracking-tight block">ONE STUDIO</span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SEO Control Plane
                </span>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              title="View Public Website"
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-[#f2bd19] rounded-lg border border-slate-800/80 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-6">
            {NAV_GROUPS.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
                  {group.groupLabel}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-[#f2bd19]/20 to-amber-500/10 border-l-4 border-[#f2bd19] text-[#f2bd19] shadow-sm'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm transition-transform group-hover:scale-110">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-slate-950 text-[#f2bd19] border border-[#f2bd19]/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Admin Bar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-[11px]">Admin Authenticated</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Dashboard Workspace Content View */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Sticky Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-[#0c101c]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">CONTROL PLANE</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {pathname?.replace('/admin/dashboard', 'HOME').replace('/', ' → ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded-full text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              NAP Single Source Verified
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 bg-[#f2bd19] hover:bg-amber-500 text-slate-950 font-black text-xs rounded-lg transition shadow-md flex items-center gap-1.5"
            >
              <span>Visit Live Site</span>
              <span>↗</span>
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
