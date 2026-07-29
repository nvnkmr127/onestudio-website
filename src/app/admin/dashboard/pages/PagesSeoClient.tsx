'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SerpPreview from '@/components/SerpPreview';
import { listSeoPaths, getPageSeo, savePageSeo, SeoPathOption } from '@/app/actions/page-seo';
import type { SeoMeta } from '@/lib/types';

export default function PagesSeoClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pathsList, setPathsList] = useState<SeoPathOption[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('/');
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<SeoMeta>({
    path: '/',
    title: '',
    meta_desc: '',
    canonical_url: '',
    focus_keyword: 'interior designers hyderabad',
    index: true,
    follow: true,
    og_title: '',
    og_desc: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    schema_ids: [],
    priority: 0.8,
    changefreq: 'weekly',
  });

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadPaths();
    }
  }, [router]);

  const loadPaths = async () => {
    setLoading(true);
    const res = await listSeoPaths();
    if (res.ok && res.data) {
      setPathsList(res.data);
      if (res.data.length > 0) {
        handleSelectPath(res.data[0].path);
      }
    }
    setLoading(false);
  };

  const handleSelectPath = async (path: string) => {
    setSelectedPath(path);
    setStatusMsg(null);
    const res = await getPageSeo(path);

    if (res.ok && res.data) {
      setFormData({
        path,
        title: res.data.title || '',
        meta_desc: res.data.meta_desc || '',
        canonical_url: res.data.canonical_url || '',
        focus_keyword: res.data.focus_keyword || '',
        index: res.data.index ?? true,
        follow: res.data.follow ?? true,
        og_title: res.data.og_title || '',
        og_desc: res.data.og_desc || '',
        og_image: res.data.og_image || '',
        twitter_card: res.data.twitter_card || 'summary_large_image',
        schema_ids: res.data.schema_ids || [],
        priority: res.data.priority ?? 0.5,
        changefreq: res.data.changefreq || 'weekly',
      });
    } else {
      // Default empty state for selected path
      setFormData({
        path,
        title: '',
        meta_desc: '',
        canonical_url: `https://www.onestudio.in${path === '/' ? '' : path}`,
        focus_keyword: '',
        index: true,
        follow: true,
        og_title: '',
        og_desc: '',
        og_image: '',
        twitter_card: 'summary_large_image',
        schema_ids: [],
        priority: 0.5,
        changefreq: 'weekly',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const res = await savePageSeo(selectedPath, formData);
    setSaving(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to save page SEO' });
    } else {
      setStatusMsg({ type: 'success', text: `SEO overrides for ${selectedPath} saved live!` });
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm font-semibold">Loading Universal SEO Editor...</p>
        </div>
      </div>
    );
  }

  // Filter paths for sidebar search
  const filteredPaths = pathsList.filter(
    (p) =>
      p.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Keyword Analysis Checklist Calculations
  const kw = (formData.focus_keyword || '').toLowerCase().trim();
  const currentTitle = formData.title || '';
  const currentDesc = formData.meta_desc || '';
  const currentPath = formData.path.toLowerCase();

  const kwInTitle = kw ? currentTitle.toLowerCase().includes(kw) : false;
  const kwInDesc = kw ? currentDesc.toLowerCase().includes(kw) : false;
  const kwInPath = kw ? currentPath.includes(kw.replace(/\s+/g, '-')) : false;
  const titleOptimal = currentTitle.length >= 45 && currentTitle.length <= 60;
  const descOptimal = currentDesc.length >= 120 && currentDesc.length <= 160;
  const isIndexed = formData.index ?? true;

  let score = 0;
  if (titleOptimal) score += 25;
  if (descOptimal) score += 25;
  if (kwInTitle) score += 20;
  if (kwInDesc) score += 15;
  if (kwInPath) score += 15;

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
            <h1 className="text-xl font-black text-white tracking-tight">🎯 Universal Page SEO Editor</h1>
          </div>
          <Link
            href={selectedPath}
            target="_blank"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-950/40 px-3 py-1.5 rounded-lg border border-orange-900/50"
          >
            Preview Target Page ↗
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR: Route Picker */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 h-[calc(100vh-140px)] flex flex-col">
            <div className="mb-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Select Route ({pathsList.length})
              </h2>
              <input
                type="text"
                placeholder="Search route or keyword..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {filteredPaths.map((p) => {
                const isSelected = selectedPath === p.path;
                return (
                  <button
                    key={p.path}
                    type="button"
                    onClick={() => handleSelectPath(p.path)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/50 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="truncate max-w-[200px] text-white">{p.path}</span>
                      <span
                        className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${
                          p.category === 'core'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : p.category === 'services'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : p.category === 'local'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {p.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{p.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN EDITOR FORM */}
          <div className="lg:col-span-8 space-y-6">
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

            {/* SERP Simulator Component */}
            <SerpPreview
              title={formData.title || ''}
              description={formData.meta_desc || ''}
              url={formData.canonical_url || `https://www.onestudio.in${selectedPath === '/' ? '' : selectedPath}`}
              focusKeyword={formData.focus_keyword || ''}
            />

            {/* Yoast SEO Health & Focus Keyword Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    🎯 SEO Health Score
                  </h3>
                  <p className="text-xs text-slate-400">Targeting route: <code className="text-orange-400">{selectedPath}</code></p>
                </div>
                <div
                  className={`text-2xl font-black px-4 py-1.5 rounded-2xl border ${
                    score >= 80
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : score >= 50
                      ? 'bg-amber-950 text-amber-400 border-amber-800'
                      : 'bg-red-950 text-red-400 border-red-800'
                  }`}
                >
                  {score} / 100
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span>{titleOptimal ? '🟢' : '🔴'}</span>
                  <span className={titleOptimal ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    Title length optimal (45–60 chars)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{descOptimal ? '🟢' : '🔴'}</span>
                  <span className={descOptimal ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    Meta description length optimal (120–160 chars)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{kwInTitle ? '🟢' : '🟡'}</span>
                  <span className={kwInTitle ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    Focus keyword in title tag
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{kwInDesc ? '🟢' : '🟡'}</span>
                  <span className={kwInDesc ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    Focus keyword in meta description
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{kwInPath ? '🟢' : '🟡'}</span>
                  <span className={kwInPath ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    Focus keyword in URL path slug
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{isIndexed ? '🟢' : '⚠️'}</span>
                  <span className={isIndexed ? 'text-emerald-300 font-medium' : 'text-amber-400 font-medium'}>
                    {isIndexed ? 'Robots Indexing Enabled' : 'Noindex directive set (Excluded from Google)'}
                  </span>
                </div>
              </div>
            </div>

            {/* FORM FIELDS */}
            <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Metadata & Directives for <span className="text-orange-400">{selectedPath}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. interior designers hyderabad"
                    value={formData.focus_keyword || ''}
                    onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Canonical URL Override
                  </label>
                  <input
                    type="url"
                    placeholder={`https://www.onestudio.co.in${selectedPath}`}
                    value={formData.canonical_url || ''}
                    onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    SEO Title Tag
                  </label>
                  <span className={`text-xs font-bold ${titleOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {(formData.title || '').length} / 60
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Interior Design in Hyderabad | One Studio"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Meta Description
                  </label>
                  <span className={`text-xs font-bold ${descOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {(formData.meta_desc || '').length} / 160
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Turnkey house construction & luxury interiors in HBR Layout, Bengaluru. High quality, transparent package pricing..."
                  value={formData.meta_desc || ''}
                  onChange={(e) => setFormData({ ...formData, meta_desc: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Robots Directives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Robots Indexing (index)</span>
                    <span className="text-[11px] text-slate-400 block">Allow Googlebot to index this page</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.index ?? true}
                    onChange={(e) => setFormData({ ...formData, index: e.target.checked })}
                    className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Robots Follow Links (follow)</span>
                    <span className="text-[11px] text-slate-400 block">Allow search crawlers to follow links</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.follow ?? true}
                    onChange={(e) => setFormData({ ...formData, follow: e.target.checked })}
                    className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Social OpenGraph Overrides */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  OpenGraph &amp; Twitter Overrides
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">OG Title</label>
                    <input
                      type="text"
                      placeholder="Custom social share title"
                      value={formData.og_title || ''}
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">OG Image URL</label>
                    <input
                      type="text"
                      placeholder="https://www.onestudio.in/images/og-share.jpg"
                      value={formData.og_image || ''}
                      onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">OG Description</label>
                  <input
                    type="text"
                    placeholder="Custom social share description"
                    value={formData.og_desc || ''}
                    onChange={(e) => setFormData({ ...formData, og_desc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Sitemap Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Sitemap Priority (0.0 to 1.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.priority ?? 0.5}
                    onChange={(e) => setFormData({ ...formData, priority: parseFloat(e.target.value) || 0.5 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Sitemap Change Frequency</label>
                  <select
                    value={formData.changefreq || 'weekly'}
                    onChange={(e) => setFormData({ ...formData, changefreq: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="always">always</option>
                    <option value="hourly">hourly</option>
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                    <option value="yearly">yearly</option>
                    <option value="never">never</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg cursor-pointer"
                >
                  {saving ? 'Saving Live Overrides...' : 'Save Live Page SEO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
