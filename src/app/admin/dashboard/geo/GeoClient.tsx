'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listGeoPages, saveGeoPage, auditNapDrift, GeoPageItem } from '@/app/actions/local';
import type { NapAuditReport } from '@/lib/seo/nap-check';

export default function GeoClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pages, setPages] = useState<GeoPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // NAP Audit state
  const [auditReport, setAuditReport] = useState<NapAuditReport | null>(null);
  const [auditing, setAuditing] = useState(false);

  // Form State
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contentPara, setContentPara] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isServed, setIsServed] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadData();
    }
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    const [pagesRes, auditRes] = await Promise.all([listGeoPages(), auditNapDrift()]);
    if (pagesRes.ok && pagesRes.data) {
      setPages(pagesRes.data);
    }
    if (auditRes.ok && auditRes.data) {
      setAuditReport(auditRes.data);
    }
    setLoading(false);
  };

  const handleRunAudit = async () => {
    setAuditing(true);
    const res = await auditNapDrift();
    setAuditing(false);
    if (res.ok && res.data) {
      setAuditReport(res.data);
      if (res.data.isCompliant) {
        setStatusMsg({ type: 'success', text: '✅ NAP Audit Complete: ZERO drift detected across all surfaces!' });
      } else {
        setStatusMsg({ type: 'error', text: `⚠️ NAP Audit Complete: Found ${res.data.driftCount} mismatch(es).` });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!isServed) {
      setStatusMsg({
        type: 'error',
        text: 'HARD GUARDRAIL: Cannot publish geo page for unserved area. "Confirmed Serviceable Area (is_served)" must be checked.',
      });
      return;
    }

    setSaving(true);

    const contentArray = contentPara
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const featuresArray = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const res = await saveGeoPage({
      slug,
      title,
      heading,
      description,
      location,
      content: contentArray.length > 0 ? contentArray : [description],
      features: featuresArray.length > 0 ? featuresArray : ['100% Transparent Pricing', '10-Year Structural Guarantee'],
      is_served: isServed,
    });

    setSaving(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to save geo page' });
    } else {
      setStatusMsg({ type: 'success', text: `Published geo landing page for ${location} (/${slug})!` });
      resetForm();
      loadData();
    }
  };

  const resetForm = () => {
    setSlug('');
    setTitle('');
    setHeading('');
    setDescription('');
    setLocation('');
    setContentPara('');
    setFeaturesText('');
    setIsServed(true);
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link href="/admin/dashboard" className="hover:text-slate-200">
                Dashboard
              </Link>
              <span>/</span>
              <span>Local SEO</span>
              <span>/</span>
              <span className="text-emerald-400 font-medium">Geo Landing Pages &amp; NAP Audit</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Geo Landing Pages &amp; NAP Drift Auditor</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage serviceable area pages (Jubilee Hills, Gachibowli & Hyderabad) and audit NAP consistency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAudit}
              disabled={auditing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {auditing ? 'Running NAP Audit...' : 'Run NAP Drift Audit'}
            </button>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-lg border border-slate-800 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Global Notifications */}
        {statusMsg && (
          <div
            className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/60 border-rose-800 text-rose-300'
            }`}
          >
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-white ml-4">
              &times;
            </button>
          </div>
        )}

        {/* NAP Drift Audit Report Card */}
        {auditReport && (
          <div
            className={`p-5 rounded-xl border space-y-3 ${
              auditReport.isCompliant
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>{auditReport.isCompliant ? '✅' : '⚠️'}</span>
                <span>
                  NAP Drift Status:{' '}
                  {auditReport.isCompliant
                    ? '100% Compliant (Zero Mismatches)'
                    : `${auditReport.driftCount} Mismatch(es) Flagged`}
                </span>
              </div>
              <span className="text-xs font-mono opacity-80">{auditReport.totalSurfacesChecked} surfaces scanned</span>
            </div>

            {!auditReport.isCompliant && (
              <div className="space-y-2 pt-2 border-t border-rose-800/60">
                <div className="text-xs font-semibold text-rose-300">Flagged NAP Mismatches:</div>
                <div className="space-y-1.5">
                  {auditReport.issues.map((issue, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg text-xs font-mono border border-rose-900/60 flex items-start justify-between gap-4">
                      <div>
                        <span className="text-rose-400 font-bold">[{issue.surface}]</span> Field: {issue.field}
                        <div className="text-slate-400 text-[11px]">
                          Expected: <span className="text-emerald-400">{issue.expected}</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          Found: <span className="text-rose-400">{issue.found}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Geo Page Builder & List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add / Edit Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
              Publish Serviceable Area Landing Page
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Area / Location Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. HBR Layout 5th Block"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    URL Slug <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="construction-company-hbr-layout"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  SEO Title Tag <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Best Interior Design Company in Jubilee Hills Hyderabad"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Page H1 Heading <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Turnkey Luxury Interiors in Jubilee Hills"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Meta Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Top rated interior designers in Jubilee Hills, Hyderabad. Custom luxury home interiors..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Content Paragraphs (Double Line Separated)</label>
                <textarea
                  rows={4}
                  value={contentPara}
                  onChange={(e) => setContentPara(e.target.value)}
                  placeholder={`Operating directly from our Experience Center on 38th Cross Rd, HBR Layout...\n\nOur local expertise ensures full compliance with BBMP setback norms...`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Feature Bullet Points (One per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder={`Headquartered in HBR Layout 5th Block\nLocal BBMP Sanction Expertise\nDedicated Site Supervisor`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Compulsory Guardrail Checkbox */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={isServed}
                    onChange={(e) => setIsServed(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  Confirmed Serviceable Area (is_served)
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">REQUIRED FOR PUBLISH</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !isServed}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition shadow-md"
                >
                  {saving ? 'Publishing...' : 'Publish Geo Landing Page'}
                </button>
              </div>
            </form>
          </div>

          {/* Geo Pages List (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
              Active Geo Landing Pages ({pages.length})
            </h2>

            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
              {pages.map((p) => (
                <div key={p.slug} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      📍 {p.location}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">is_served: true</span>
                  </div>

                  <h3 className="text-xs font-bold text-white">{p.heading}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="font-mono text-slate-500">/{p.slug}</span>
                    <Link href={`/${p.slug}`} target="_blank" className="text-emerald-400 hover:underline font-bold">
                      View Page ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
