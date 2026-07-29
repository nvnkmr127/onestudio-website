'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listSitemapEntries, updateSitemapItem, pingSearchEngines, SitemapItemAdmin } from '@/app/actions/sitemapActions';

export default function SitemapClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [items, setItems] = useState<SitemapItemAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadEntries();
    }
  }, [router]);

  const loadEntries = async () => {
    setLoading(true);
    const res = await listSitemapEntries();
    if (res.ok && res.data) {
      setItems(res.data);
    }
    setLoading(false);
  };

  const handleUpdate = async (path: string, priority: number, changefreq: string, index: boolean) => {
    setStatusMsg(null);
    const res = await updateSitemapItem(path, { priority, changefreq, index });
    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to update sitemap entry' });
    } else {
      setStatusMsg({ type: 'success', text: `Updated ${path} priority to ${priority} & changefreq to ${changefreq}` });
      loadEntries();
    }
  };

  const handlePing = async () => {
    setPinging(true);
    setStatusMsg(null);
    const res = await pingSearchEngines();
    setPinging(false);
    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Ping failed' });
    } else {
      setStatusMsg({ type: 'success', text: res.data?.message || 'Pings dispatched!' });
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm font-semibold">Loading XML Sitemap Manager...</p>
        </div>
      </div>
    );
  }

  const filteredItems = items.filter((item) => (categoryFilter === 'all' ? true : item.category === categoryFilter));
  const indexedCount = items.filter((i) => i.index).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-black text-white tracking-tight">🗺️ XML Sitemap Engine</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePing}
              disabled={pinging}
              className="text-xs font-black uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {pinging ? 'Pinging Search Engines...' : '📡 Ping Google & Bing Sitemaps'}
            </button>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-950/40 px-3 py-1.5 rounded-lg border border-orange-900/50"
            >
              View Live /sitemap.xml ↗
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        {/* Status Alert */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl border text-sm font-medium flex items-center justify-between ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-red-950/60 border-red-800 text-red-300'
            }`}
          >
            <span>{statusMsg.text}</span>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-xs opacity-70 hover:opacity-100 font-bold uppercase tracking-wider ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-500">Indexed Sitemap URLs</span>
            <p className="text-3xl font-black text-emerald-400">{indexedCount}</p>
            <p className="text-[10px] text-slate-400">Included in /sitemap.xml</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-500">Excluded (Noindex)</span>
            <p className="text-3xl font-black text-amber-400">{items.length - indexedCount}</p>
            <p className="text-[10px] text-slate-400">Omitted from XML sitemap</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-500">Admin Paths Excluded</span>
            <p className="text-3xl font-black text-red-400">0 in Sitemap</p>
            <p className="text-[10px] text-slate-400">Hard guardrail enforced</p>
          </div>
        </div>

        {/* Filter Controls & Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">Sitemap URL Registry ({filteredItems.length})</h2>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {['all', 'core', 'services', 'local', 'blogs'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                    categoryFilter === cat ? 'bg-orange-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Path</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Change Freq</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Modified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredItems.map((item) => (
                  <tr key={item.path} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white truncate max-w-[240px]">
                      <Link href={item.path} target="_blank" className="hover:text-orange-400">
                        {item.path} ↗
                      </Link>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={item.priority}
                        onChange={(e) =>
                          handleUpdate(item.path, parseFloat(e.target.value), item.changefreq, item.index)
                        }
                        className="bg-slate-950 border border-slate-800 text-orange-400 font-bold px-2 py-1 rounded-lg text-xs"
                      >
                        <option value={1.0}>1.0</option>
                        <option value={0.9}>0.9</option>
                        <option value={0.85}>0.85</option>
                        <option value={0.8}>0.8</option>
                        <option value={0.7}>0.7</option>
                        <option value={0.5}>0.5</option>
                        <option value={0.3}>0.3</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={item.changefreq}
                        onChange={(e) =>
                          handleUpdate(item.path, item.priority, e.target.value, item.index)
                        }
                        className="bg-slate-950 border border-slate-800 text-slate-200 px-2 py-1 rounded-lg text-xs"
                      >
                        <option value="always">always</option>
                        <option value="hourly">hourly</option>
                        <option value="daily">daily</option>
                        <option value="weekly">weekly</option>
                        <option value="monthly">monthly</option>
                        <option value="yearly">yearly</option>
                        <option value="never">never</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(item.path, item.priority, item.changefreq, !item.index)
                        }
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer ${
                          item.index
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {item.index ? 'Indexed' : 'Noindex'}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {new Date(item.lastmod).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
