'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { executeFullSeoAuditAndDriftCheck, AuditRunResponse } from '@/app/actions/audit';

export default function AuditsClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [auditing, setAuditing] = useState(false);
  const [auditData, setAuditData] = useState<AuditRunResponse | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      handleRunAudit();
    }
  }, [router]);

  const handleRunAudit = async () => {
    setAuditing(true);
    setStatusMsg(null);
    const res = await executeFullSeoAuditAndDriftCheck();
    setAuditing(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Full site audit failed' });
    } else if (res.data) {
      setAuditData(res.data);
      if (res.data.drift.hasDrift) {
        setStatusMsg({ type: 'error', text: `🚨 Alert: Found ${res.data.drift.driftCount} baseline drift regression(s)!` });
      } else {
        setStatusMsg({ type: 'success', text: `✅ Audit Complete: Health Score ${res.data.audit.score}/100. Zero drift regressions!` });
      }
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
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
              <span>Monitoring</span>
              <span>/</span>
              <span className="text-rose-400 font-medium">SEO Health &amp; Drift Monitor</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">SEO Health &amp; Baseline Drift Monitor</h1>
            <p className="text-slate-400 text-sm mt-1">
              Automated audit crawler and baseline regression monitor with Resend email alert integration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAudit}
              disabled={auditing}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {auditing ? 'Running Full Site Audit...' : 'Run Full Site Audit &amp; Drift Check'}
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

        {/* Audit Metric Cards */}
        {auditData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">SEO Health Score</span>
                <p className="text-3xl font-black text-emerald-400">{auditData.audit.score} / 100</p>
                <span className="text-xs text-slate-500 font-mono">{auditData.audit.totalRoutesChecked} public routes checked</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">Baseline Drift Status</span>
                <p className={auditData.drift.hasDrift ? 'text-3xl font-black text-rose-400' : 'text-3xl font-black text-emerald-400'}>
                  {auditData.drift.hasDrift ? `${auditData.drift.driftCount} Regressions` : 'Zero Drift'}
                </p>
                <span className="text-xs text-slate-500 font-mono">
                  {auditData.drift.scoreDifference >= 0 ? `+${auditData.drift.scoreDifference} pts` : `${auditData.drift.scoreDifference} pts`} vs baseline
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1 shadow">
                <span className="text-[10px] font-bold uppercase text-slate-400">Routes Requiring Attention</span>
                <p className="text-3xl font-black text-amber-400">{auditData.audit.routesWithIssues}</p>
                <span className="text-xs text-slate-500 font-mono">Title/Meta/Canonical issues</span>
              </div>
            </div>

            {/* Baseline Drift Issues Box */}
            {auditData.drift.hasDrift && (
              <div className="bg-rose-950/40 border border-rose-800 rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <span>🚨</span> Flagged Baseline Regressions ({auditData.drift.driftCount})
                </h2>

                <div className="space-y-2">
                  {auditData.drift.issues.map((issue, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-rose-900/80 text-xs font-mono flex items-center justify-between">
                      <div>
                        <span className="text-rose-400 font-bold">[{issue.type.toUpperCase()}]</span> Route: {issue.path}
                        <div className="text-slate-300 text-[11px] mt-0.5">{issue.details}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-rose-950 text-rose-300 rounded border border-rose-800 font-bold uppercase text-[10px]">
                        {issue.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Route Health Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">
                Detailed Route Health Breakdown ({auditData.audit.routeDetails.length} Routes)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Route Path</th>
                      <th className="py-2.5 px-4 text-center">Title Tag</th>
                      <th className="py-2.5 px-4 text-center">Meta Description</th>
                      <th className="py-2.5 px-4 text-center">Canonical Tag</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {auditData.audit.routeDetails.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-mono font-bold text-white">{r.path}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={r.hasTitle ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {r.hasTitle ? '✓ Present' : '✗ Missing'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={r.hasMetaDesc ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {r.hasMetaDesc ? '✓ Present' : '✗ Missing'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={r.hasCanonical ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {r.hasCanonical ? '✓ Valid' : '✗ Missing'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono">
                          {r.issues.length === 0 ? (
                            <span className="text-emerald-400 font-bold">100% Pass</span>
                          ) : (
                            <span className="text-amber-400 font-bold">{r.issues.length} issue(s)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
