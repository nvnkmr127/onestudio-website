'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getSearchAnalytics,
  inspectUrl,
  submitSitemap,
  listAuditSnapshots,
  saveDailyAuditSnapshot,
  SearchInsightsResult,
} from '@/app/actions/insights';
import type { SeoAudit } from '@/lib/types';

export default function InsightsClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [range, setRange] = useState<'7d' | '28d' | '90d'>('28d');
  const [insights, setInsights] = useState<SearchInsightsResult | null>(null);
  const [snapshots, setSnapshots] = useState<SeoAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // URL Inspection Tool State
  const [inspectPath, setInspectPath] = useState('/');
  const [inspecting, setInspecting] = useState(false);
  const [inspectResult, setInspectResult] = useState<any | null>(null);

  // Sitemap Submission State
  const [submittingSitemap, setSubmittingSitemap] = useState(false);

  // Active View Tab (Top Queries vs Top Pages)
  const [activeTab, setActiveTab] = useState<'queries' | 'pages' | 'snapshots'>('queries');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadDashboardData(range);
    }
  }, [router, range]);

  const loadDashboardData = async (selectedRange: '7d' | '28d' | '90d') => {
    setLoading(true);
    const [analyticsRes, snapshotsRes] = await Promise.all([
      getSearchAnalytics(selectedRange),
      listAuditSnapshots(),
    ]);

    if (analyticsRes.ok && analyticsRes.data) {
      setInsights(analyticsRes.data);
    }
    if (snapshotsRes.ok && snapshotsRes.data) {
      setSnapshots(snapshotsRes.data);
    }
    setLoading(false);
  };

  const handleSubmitSitemap = async () => {
    setSubmittingSitemap(true);
    setStatusMsg(null);
    const res = await submitSitemap();
    setSubmittingSitemap(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to submit sitemap to GSC' });
    } else {
      setStatusMsg({ type: 'success', text: res.data?.message || 'Sitemap submitted successfully to GSC!' });
    }
  };

  const handleInspectUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectPath.trim()) return;

    setInspecting(true);
    setInspectResult(null);
    setStatusMsg(null);

    const res = await inspectUrl(inspectPath);
    setInspecting(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to inspect URL' });
    } else {
      setInspectResult(res.data);
      setStatusMsg({ type: 'success', text: `URL Inspection complete for "${inspectPath}"` });
    }
  };

  const handleSaveSnapshot = async () => {
    if (!insights) return;
    setStatusMsg(null);
    const res = await saveDailyAuditSnapshot({
      range,
      totalClicks: insights.topQueries.totalClicks,
      totalImpressions: insights.topQueries.totalImpressions,
      avgCtr: insights.topQueries.avgCtr,
      avgPosition: insights.topQueries.avgPosition,
      ga4Organic: insights.ga4Organic,
    });

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to save snapshot' });
    } else {
      setStatusMsg({ type: 'success', text: 'Daily performance snapshot recorded in seo_audits!' });
      const snapRes = await listAuditSnapshots();
      if (snapRes.ok && snapRes.data) setSnapshots(snapRes.data);
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f2bd19]"></div>
      </div>
    );
  }

  const queriesRows = insights?.topQueries.rows || [];
  const pagesRows = insights?.topPages.rows || [];

  const filteredQueries = queriesRows.filter((r) =>
    r.keys.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredPages = pagesRows.filter((r) =>
    r.keys.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              <span>Performance</span>
              <span>/</span>
              <span className="text-[#f2bd19] font-medium">GSC &amp; GA4 Insights</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Google Search &amp; Organic Insights</h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time Google Search Console (GSC) &amp; GA4 Data API organic performance analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Range Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-bold">
              {(['7d', '28d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded transition ${
                    range === r ? 'bg-[#f2bd19] text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmitSitemap}
              disabled={submittingSitemap}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-[#f2bd19]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Submit Sitemap to GSC
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

        {/* Connection Status Banner */}
        {insights && !insights.isConfigured && (
          <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl text-amber-200 text-xs flex items-start gap-3">
            <div className="text-amber-400 font-bold text-base">ℹ️</div>
            <div>
              <div className="font-semibold text-amber-100 mb-0.5">GSC / GA4 Service Account Not Connected</div>
              <p className="text-amber-300/90 leading-relaxed">
                Connect your Google Service Account by setting <code className="bg-slate-950 text-slate-200 px-1 py-0.5 rounded">GSC_SERVICE_ACCOUNT_JSON</code> and <code className="bg-slate-950 text-slate-200 px-1 py-0.5 rounded">GA4_PROPERTY_ID</code> in environment variables. Currently rendering structured benchmark data.
              </p>
            </div>
          </div>
        )}

        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Organic Clicks</span>
            <p className="text-2xl font-black text-[#f2bd19]">{insights?.topQueries.totalClicks.toLocaleString() || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">GSC ({range})</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Impressions</span>
            <p className="text-2xl font-black text-cyan-400">{insights?.topQueries.totalImpressions.toLocaleString() || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">GSC ({range})</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow">
            <span className="text-[10px] font-bold uppercase text-slate-400">Average CTR</span>
            <p className="text-2xl font-black text-emerald-400">{insights?.topQueries.avgCtr || 0}%</p>
            <span className="text-[10px] text-slate-500 font-mono">GSC ({range})</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow">
            <span className="text-[10px] font-bold uppercase text-slate-400">Average Position</span>
            <p className="text-2xl font-black text-purple-400">{insights?.topQueries.avgPosition || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">GSC ({range})</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow">
            <span className="text-[10px] font-bold uppercase text-slate-400">GA4 Organic Sessions</span>
            <p className="text-2xl font-black text-sky-400">{insights?.ga4Organic.sessions.toLocaleString() || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">GA4 ({range})</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 shadow">
            <span className="text-[10px] font-bold uppercase text-slate-400">Organic Conversions</span>
            <p className="text-2xl font-black text-emerald-400">{insights?.ga4Organic.conversions.toLocaleString() || 0}</p>
            <span className="text-[10px] text-slate-500 font-mono">GA4 ({range})</span>
          </div>
        </div>

        {/* URL Inspection & Action Studio Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* URL Inspection Tool (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-[#f2bd19]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              GSC Live URL Inspection Studio
            </h2>
            <form onSubmit={handleInspectUrl} className="flex gap-3 items-center">
              <input
                type="text"
                value={inspectPath}
                onChange={(e) => setInspectPath(e.target.value)}
                placeholder="/construction-company-hbr-layout"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#f2bd19] font-mono"
              />
              <button
                type="submit"
                disabled={inspecting}
                className="px-4 py-2 bg-[#f2bd19] hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition shrink-0"
              >
                {inspecting ? 'Inspecting...' : 'Inspect Index Status'}
              </button>
            </form>

            {inspectResult && (
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-300 max-h-40 overflow-y-auto">
                {JSON.stringify(inspectResult, null, 2)}
              </pre>
            )}
          </div>

          {/* Daily Snapshot Recorder (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <span>📸</span> Record Daily SEO Snapshot
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save current search performance metrics into <code className="bg-slate-950 text-slate-200 px-1 py-0.5 rounded">seo_audits</code> to track ranking trends over time.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400">{snapshots.length} snapshots stored</span>
              <button
                onClick={handleSaveSnapshot}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow"
              >
                Save Performance Snapshot
              </button>
            </div>
          </div>
        </div>

        {/* Top Queries & Pages Data Tables */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('queries')}
                className={`text-sm font-bold pb-1 border-b-2 transition ${
                  activeTab === 'queries' ? 'border-[#f2bd19] text-[#f2bd19]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Top Search Queries ({queriesRows.length})
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`text-sm font-bold pb-1 border-b-2 transition ${
                  activeTab === 'pages' ? 'border-[#f2bd19] text-[#f2bd19]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Top Performing Pages ({pagesRows.length})
              </button>
              <button
                onClick={() => setActiveTab('snapshots')}
                className={`text-sm font-bold pb-1 border-b-2 transition ${
                  activeTab === 'snapshots' ? 'border-[#f2bd19] text-[#f2bd19]' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Snapshot History ({snapshots.length})
              </button>
            </div>

            {activeTab !== 'snapshots' && (
              <div className="w-full md:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter query or page path..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#f2bd19]"
                />
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'queries' && (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Search Query / Keyword</th>
                    <th className="py-3 px-4 text-center">Clicks</th>
                    <th className="py-3 px-4 text-center">Impressions</th>
                    <th className="py-3 px-4 text-center">CTR %</th>
                    <th className="py-3 px-4 text-right">Avg Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredQueries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                        No search query rows found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredQueries.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-bold text-white font-mono text-xs">{r.keys[0]}</td>
                        <td className="py-3 px-4 text-center font-mono text-xs text-[#f2bd19] font-bold">
                          {r.clicks.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs text-cyan-400">
                          {r.impressions.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs text-emerald-400">{r.ctr}%</td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-purple-400 font-bold">{r.position}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'pages' && (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">URL Path</th>
                    <th className="py-3 px-4 text-center">Clicks</th>
                    <th className="py-3 px-4 text-center">Impressions</th>
                    <th className="py-3 px-4 text-center">CTR %</th>
                    <th className="py-3 px-4 text-right">Avg Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                        No page rows found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-bold text-emerald-400 font-mono text-xs max-w-xs truncate">
                          {r.keys[0]}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs text-[#f2bd19] font-bold">
                          {r.clicks.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs text-cyan-400">
                          {r.impressions.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs text-emerald-400">{r.ctr}%</td>
                        <td className="py-3 px-4 text-right font-mono text-xs text-purple-400 font-bold">{r.position}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'snapshots' && (
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Recorded Date</th>
                    <th className="py-3 px-4">Health Score</th>
                    <th className="py-3 px-4">Target Path</th>
                    <th className="py-3 px-4 text-right">Snapshot Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {snapshots.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 text-xs">
                        No performance snapshots saved in seo_audits yet.
                      </td>
                    </tr>
                  ) : (
                    snapshots.map((s) => (
                      <tr key={s.id || s.created_at} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono text-xs text-white">
                          {s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs font-bold text-[#f2bd19]">{s.score} / 100</td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-300">{s.path}</td>
                        <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-400">
                          {JSON.stringify(s.snapshot || {})}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
