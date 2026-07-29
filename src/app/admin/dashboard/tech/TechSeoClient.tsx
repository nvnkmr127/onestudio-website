'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  runBrokenLinkScan,
  getCoreWebVitalsSummary,
  updateCanonicalAndHreflang,
  CwvSummaryItem,
} from '@/app/actions/tech-seo';
import type { LinkScanResult } from '@/lib/seo/link-scan';

export default function TechSeoClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Link Scanner state
  const [scanResult, setScanResult] = useState<LinkScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  // CWV state
  const [vitals, setVitals] = useState<CwvSummaryItem[]>([]);

  // Canonical Form state
  const [targetPath, setTargetPath] = useState('/');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [savingCanonical, setSavingCanonical] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, [router]);

  const loadDashboardData = async () => {
    setLoading(true);
    const vitalsRes = await getCoreWebVitalsSummary();
    if (vitalsRes.ok && vitalsRes.data) {
      setVitals(vitalsRes.data);
    }
    setLoading(false);
  };

  const handleRunLinkScan = async () => {
    setScanning(true);
    setStatusMsg(null);
    const res = await runBrokenLinkScan();
    setScanning(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Broken link scan failed' });
    } else if (res.data) {
      setScanResult(res.data);
      if (res.data.brokenCount === 0) {
        setStatusMsg({ type: 'success', text: `✅ Scan Complete: Scanned ${res.data.totalScanned} links with ZERO broken 4xx/5xx URLs!` });
      } else {
        setStatusMsg({ type: 'error', text: `⚠️ Scan Complete: Found ${res.data.brokenCount} broken link(s) across ${res.data.totalScanned} scanned URLs.` });
      }
    }
  };

  const handleSaveCanonical = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPath.trim()) return;

    setSavingCanonical(true);
    setStatusMsg(null);

    const res = await updateCanonicalAndHreflang({
      path: targetPath,
      canonical_url: canonicalUrl.trim() || null,
    });

    setSavingCanonical(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to update canonical URL' });
    } else {
      setStatusMsg({ type: 'success', text: `Updated canonical URL for "${targetPath}"!` });
      setCanonicalUrl('');
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
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
              <span>Technical SEO</span>
              <span>/</span>
              <span className="text-purple-400 font-medium">Link Scanner &amp; Core Web Vitals</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Technical SEO &amp; Core Web Vitals Studio</h1>
            <p className="text-slate-400 text-sm mt-1">
              On-demand 4xx/5xx internal link crawler, real-time Core Web Vitals (LCP, INP, CLS) reporter, and canonical manager.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunLinkScan}
              disabled={scanning}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {scanning ? 'Crawling Internal Links...' : 'Run Broken Link Scan'}
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

        {/* Link Scan Result Box */}
        {scanResult && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🔍</span> Broken Link Scan Results
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Total Scanned: {scanResult.totalScanned}</span>
                <span className={scanResult.brokenCount === 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  Broken 4xx/5xx: {scanResult.brokenCount}
                </span>
              </div>
            </div>

            {scanResult.brokenCount === 0 ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs font-medium text-center">
                🎉 No broken internal links found across {scanResult.totalScanned} scanned URLs.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Source Route</th>
                      <th className="py-2.5 px-3">Target URL</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Error Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {scanResult.brokenLinks.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono text-white">{item.sourcePath}</td>
                        <td className="py-2.5 px-3 font-mono text-rose-400 max-w-xs truncate">{item.targetUrl}</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-mono font-bold">
                            HTTP {item.statusCode || 'ERR'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-400">{item.errorMsg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Section Grid: Core Web Vitals & Canonical Override Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Core Web Vitals Summary (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⚡</span> Core Web Vitals (LCP / INP / CLS)
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Live RUM Performance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Path</th>
                    <th className="py-2.5 px-3 text-center">LCP (ms)</th>
                    <th className="py-2.5 px-3 text-center">INP (ms)</th>
                    <th className="py-2.5 px-3 text-center">CLS</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {vitals.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{v.path}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-cyan-400">{v.lcp !== null ? `${v.lcp} ms` : '—'}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-purple-400">{v.inp !== null ? `${v.inp} ms` : '—'}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-emerald-400">{v.cls !== null ? v.cls : '—'}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.status === 'Good'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Canonical & Hreflang Manager (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <span>🔗</span> Canonical URL Override Manager
            </h2>

            <form onSubmit={handleSaveCanonical} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Target Route Path</label>
                <input
                  type="text"
                  required
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder="/services/house-construction"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Canonical URL Override</label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://www.onestudio.in/services/interior-design"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Leave empty to use self-referencing canonical default.</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingCanonical}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition"
                >
                  {savingCanonical ? 'Saving...' : 'Save Canonical Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
