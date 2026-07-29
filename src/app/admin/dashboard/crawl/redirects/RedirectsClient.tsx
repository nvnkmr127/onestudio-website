'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  listRedirects,
  addRedirect,
  toggleRedirectActive,
  deleteRedirect,
  importRedirectsCsv,
  CsvImportResult,
} from '@/app/actions/redirects';
import type { Redirect } from '@/lib/types';

export default function RedirectsClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Single Add Form state
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [statusCode, setStatusCode] = useState<number>(301);
  const [isRegex, setIsRegex] = useState<boolean>(false);
  const [adding, setAdding] = useState(false);

  // CSV Import state
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<CsvImportResult | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadRedirects();
    }
  }, [router]);

  const loadRedirects = async () => {
    setLoading(true);
    const res = await listRedirects();
    if (res.ok && res.data) {
      setRedirects(res.data);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setAdding(true);

    const res = await addRedirect({
      source,
      destination,
      status_code: statusCode,
      is_regex: isRegex,
      active: true,
    });

    setAdding(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to add redirect' });
    } else {
      setStatusMsg({ type: 'success', text: `Added redirect: ${source} -> ${destination}` });
      setSource('');
      setDestination('');
      setIsRegex(false);
      loadRedirects();
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setStatusMsg(null);
    const res = await toggleRedirectActive(id, !currentActive);
    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to toggle status' });
    } else {
      loadRedirects();
    }
  };

  const handleDelete = async (id: string, srcPath: string) => {
    if (!confirm(`Are you sure you want to delete redirect for "${srcPath}"?`)) return;
    setStatusMsg(null);
    const res = await deleteRedirect(id);
    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to delete' });
    } else {
      setStatusMsg({ type: 'success', text: 'Redirect deleted' });
      loadRedirects();
    }
  };

  const handleImportCsv = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    setImportResult(null);

    const res = await importRedirectsCsv(csvText);
    setImporting(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'CSV import failed' });
    } else if (res.data) {
      setImportResult(res.data);
      setStatusMsg({
        type: 'success',
        text: `CSV Import complete: ${res.data.importedCount} imported, ${res.data.skippedCount} skipped.`,
      });
      loadRedirects();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const filteredRedirects = redirects.filter(
    (r) =>
      r.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple scan for chains/loops in existing active data
  const activeRedirects = redirects.filter((r) => r.active);
  const chainWarnings: string[] = [];
  activeRedirects.forEach((r1) => {
    const destNorm = r1.destination.trim().replace(/\/$/, '') || '/';
    const chainTarget = activeRedirects.find((r2) => {
      const srcNorm = r2.source.trim().replace(/\/$/, '') || '/';
      return r1.id !== r2.id && srcNorm === destNorm;
    });
    if (chainTarget) {
      chainWarnings.push(`Chain detected: "${r1.source}" -> "${r1.destination}" -> "${chainTarget.destination}"`);
    }
  });

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
        {/* Header Nav */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link href="/admin/dashboard" className="hover:text-slate-200">
                Dashboard
              </Link>
              <span>/</span>
              <span>Crawl & Indexing</span>
              <span>/</span>
              <span className="text-emerald-400 font-medium">Redirect Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">301 / 302 Redirect Control Plane</h1>
            <p className="text-slate-400 text-sm mt-1">
              In-memory cached middleware execution with loop/chain prevention and CSV migration import.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowCsvModal(true);
                setImportResult(null);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-lg border border-slate-700 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Bulk CSV Migration
            </button>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-sm rounded-lg border border-slate-800 transition"
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

        {/* Chain Warning Alert Banner */}
        {chainWarnings.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-800/80 text-amber-300 text-sm space-y-1">
            <div className="font-semibold flex items-center gap-2 text-amber-200">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {chainWarnings.length} Redirect Chain(s) Detected in Database:
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-amber-300/90 pl-6">
              {chainWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Single Add Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Redirect Rule
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Source Path <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="/old-service-page or ^/old-(.*)$"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Destination Path / URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="/services/house-construction or $1"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">HTTP Code</label>
              <select
                value={statusCode}
                onChange={(e) => setStatusCode(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={301}>301 Permanent</option>
                <option value={302}>302 Temporary</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300 py-2">
                <input
                  type="checkbox"
                  checked={isRegex}
                  onChange={(e) => setIsRegex(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                />
                Regex Match
              </label>
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm py-2 px-4 rounded-lg transition"
              >
                {adding ? 'Saving...' : 'Add Rule'}
              </button>
            </div>
          </form>
        </div>

        {/* Redirect Rules Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-white">Active Redirect Rules</h2>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
                {redirects.length} rules
              </span>
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter source or destination..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Source Path</th>
                  <th className="py-3 px-4">Destination Path</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Hits</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRedirects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                      No redirect rules found.
                    </td>
                  </tr>
                ) : (
                  filteredRedirects.map((r) => (
                    <tr key={r.id} className={`hover:bg-slate-800/40 transition ${!r.active ? 'opacity-50' : ''}`}>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${
                            r.status_code === 301
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                              : 'bg-sky-950/80 text-sky-400 border border-sky-800/60'
                          }`}
                        >
                          {r.status_code}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-white max-w-xs truncate">{r.source}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-300 max-w-xs truncate">{r.destination}</td>
                      <td className="py-3 px-4">
                        {r.is_regex ? (
                          <span className="bg-purple-950/80 text-purple-300 border border-purple-800/60 text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                            Regex
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
                            Exact
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-400">{r.hits || 0}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => r.id && handleToggleActive(r.id, r.active)}
                          className={`text-xs font-medium px-2.5 py-1 rounded transition ${
                            r.active
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/60'
                          }`}
                        >
                          {r.active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => r.id && handleDelete(r.id, r.source)}
                          className="text-xs font-medium px-2.5 py-1 bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 border border-rose-800/50 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Bulk CSV Redirect Migration
              </h3>
              <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-white text-lg">
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload or paste CSV lines formatted as <code className="bg-slate-950 text-slate-200 px-1 py-0.5 rounded">source,destination,status_code,is_regex</code>.
                Header row is optional. All rows are validated for loops and chains before insertion.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select CSV File</label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Or Paste CSV Content</label>
                <textarea
                  rows={6}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`/old-page,/new-page,301,false\n^/blog/(.*)$,/news/$1,301,true`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {importResult && (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2 max-h-40 overflow-y-auto">
                  <div className="font-semibold text-slate-200">
                    Import Result: <span className="text-emerald-400">{importResult.importedCount} imported</span>,{' '}
                    <span className="text-amber-400">{importResult.skippedCount} skipped</span>.
                  </div>
                  {importResult.errors.length > 0 && (
                    <ul className="list-disc list-inside text-rose-400 space-y-1">
                      {importResult.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={handleImportCsv}
                disabled={importing || !csvText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition"
              >
                {importing ? 'Importing...' : 'Run Bulk Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
