'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listImageSeo, updateImageAlt, ImageSeoItem } from '@/app/actions/media';

export default function MediaClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [images, setImages] = useState<ImageSeoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dynamic OG Generator State
  const [ogTitle, setOgTitle] = useState('Turnkey House Construction in HBR Layout Bangalore');
  const [ogCategory, setOgCategory] = useState('HBR Layout 5th Block, Bengaluru');

  // Editing ALT text state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAlt, setEditingAlt] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadImages();
    }
  }, [router]);

  const loadImages = async () => {
    setLoading(true);
    const res = await listImageSeo();
    if (res.ok && res.data) {
      setImages(res.data);
    }
    setLoading(false);
  };

  const handleSaveAlt = async (id: string) => {
    setSavingId(id);
    setStatusMsg(null);
    const res = await updateImageAlt(id, editingAlt);
    setSavingId(null);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to update ALT text' });
    } else {
      setStatusMsg({ type: 'success', text: 'Image ALT text updated successfully!' });
      setEditingId(null);
      loadImages();
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const ogPreviewUrl = `/api/og?title=${encodeURIComponent(ogTitle)}&category=${encodeURIComponent(ogCategory)}`;

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
              <span>Media</span>
              <span>/</span>
              <span className="text-indigo-400 font-medium">Image SEO &amp; Dynamic OG Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Image SEO &amp; Dynamic OpenGraph Studio</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage image ALT text tags and preview dynamic 1200x630 social share cards generated via <code className="bg-slate-900 text-indigo-400 px-1 rounded">next/og</code>.
            </p>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Dynamic OG Image Live Studio Row */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span>🎨</span> Dynamic next/og Social Share Card Generator
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Input Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">OG Card Title</label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Location / Category Badge</label>
                <input
                  type="text"
                  value={ogCategory}
                  onChange={(e) => setOgCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <Link
                  href={ogPreviewUrl}
                  target="_blank"
                  className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                >
                  Open Full Resolution OG Image ↗
                </Link>
              </div>
            </div>

            {/* Live Preview (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block mb-2">LIVE DYNAMIC PREVIEW (1200 x 630)</span>
              <iframe
                title="Dynamic OpenGraph Image Preview"
                src={ogPreviewUrl}
                className="w-full h-56 rounded-lg border border-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Image SEO Alt Text Registry */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <span>🖼️</span> Image SEO ALT Text Registry ({images.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img) => (
              <div key={img.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold">{img.id}</span>
                  <span className="text-slate-500">{img.url}</span>
                </div>

                {editingId === img.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={editingAlt}
                      onChange={(e) => setEditingAlt(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveAlt(img.id)}
                        disabled={savingId === img.id}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded"
                      >
                        Save ALT
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">"{img.alt_text}"</p>
                    <button
                      onClick={() => {
                        setEditingId(img.id);
                        setEditingAlt(img.alt_text);
                      }}
                      className="text-xs text-indigo-400 hover:underline shrink-0 font-bold"
                    >
                      Edit ALT
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
