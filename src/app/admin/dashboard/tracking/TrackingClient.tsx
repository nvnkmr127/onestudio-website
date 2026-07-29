'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTrackingConfigAdmin, updateTrackingConfig } from '@/app/actions/tracking';
import type { TrackingConfig } from '@/lib/types';

export default function TrackingClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Config Form State
  const [ga4Id, setGa4Id] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [metaCapiToken, setMetaCapiToken] = useState('');
  const [showCapiToken, setShowCapiToken] = useState(false);
  const [consentDefault, setConsentDefault] = useState('denied');
  const [customHeadScripts, setCustomHeadScripts] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadConfig();
    }
  }, [router]);

  const loadConfig = async () => {
    setLoading(true);
    const res = await getTrackingConfigAdmin();
    if (res.ok && res.data) {
      setGa4Id(res.data.ga4_id || '');
      setGtmId(res.data.gtm_id || '');
      setMetaPixelId(res.data.meta_pixel_id || '');
      setMetaCapiToken(res.data.meta_capi_token || '');
      setConsentDefault(res.data.consent_default || 'denied');
      setCustomHeadScripts(res.data.custom_head_scripts || '');
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setSaving(true);

    const res = await updateTrackingConfig({
      ga4_id: ga4Id.trim() || null,
      gtm_id: gtmId.trim() || null,
      meta_pixel_id: metaPixelId.trim() || null,
      meta_capi_token: metaCapiToken.trim() || null,
      consent_default: consentDefault,
      custom_head_scripts: customHeadScripts.trim() || null,
    });

    setSaving(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to update tracking config' });
    } else {
      setStatusMsg({ type: 'success', text: 'Tracking & Analytics configuration updated successfully!' });
      loadConfig();
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link href="/admin/dashboard" className="hover:text-slate-200">
                Dashboard
              </Link>
              <span>/</span>
              <span>Integrations</span>
              <span>/</span>
              <span className="text-cyan-400 font-medium">Tracking &amp; CAPI Control Plane</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Analytics, Pixel &amp; CAPI Manager</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage GA4, GTM, Meta Pixel, Consent Mode v2, and server-side Meta Conversions API (CAPI).
            </p>
          </div>

          <div>
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

        {/* Security Guardrail Alert Box */}
        <div className="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-cyan-200 text-xs flex items-start gap-3">
          <div className="text-cyan-400 font-bold text-base">🛡️</div>
          <div>
            <div className="font-semibold text-cyan-100 mb-0.5">Strict Security Guardrail Enforced</div>
            <p className="text-cyan-300/90 leading-relaxed">
              Meta CAPI Access Token is isolated server-side inside Supabase and Server Actions. Only public IDs (GA4, GTM, Pixel ID) are exposed to client browser bundles.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GA4 ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google Analytics 4 (GA4) Measurement ID
              </label>
              <input
                type="text"
                value={ga4Id}
                onChange={(e) => setGa4Id(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Fires GA4 `generate_lead`, `contact_call`, and `contact_whatsapp` events.</span>
            </div>

            {/* GTM ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google Tag Manager (GTM) Container ID
              </label>
              <input
                type="text"
                value={gtmId}
                onChange={(e) => setGtmId(e.target.value)}
                placeholder="GTM-XXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Injected via `next/script` after Consent Mode initialization.</span>
            </div>

            {/* Meta Pixel ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Meta (Facebook) Pixel ID
              </label>
              <input
                type="text"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                placeholder="123456789012345"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Client-side pixel tracking for PageView, Lead, and Contact events.</span>
            </div>

            {/* Consent Mode v2 Default */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google Consent Mode v2 Default State
              </label>
              <select
                value={consentDefault}
                onChange={(e) => setConsentDefault(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="denied">🔒 Denied by Default (GDPR &amp; DPDP Compliant)</option>
                <option value="granted">🔓 Granted by Default</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">Sets initial consent categories prior to user banner interaction.</span>
            </div>
          </div>

          {/* Meta CAPI Token (Server-Side Only) */}
          <div className="border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <span>🔑</span> Meta Conversions API (CAPI) Access Token
              </label>
              <button
                type="button"
                onClick={() => setShowCapiToken(!showCapiToken)}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                {showCapiToken ? 'Hide Token' : 'Show Token'}
              </button>
            </div>
            <textarea
              rows={3}
              value={showCapiToken ? metaCapiToken : (metaCapiToken ? '••••••••••••••••••••••••••••••••••••••••' : '')}
              onChange={(e) => setMetaCapiToken(e.target.value)}
              placeholder="EAAG..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-white placeholder-slate-700 focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Server-only token used to dispatch SHA-256 hashed lead events directly to Meta Graph API. Never exposed to browser.
            </span>
          </div>

          {/* Custom Head Scripts */}
          <div className="border-t border-slate-800 pt-5">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom Head Scripts (Sanitized Admin Scripts)
            </label>
            <textarea
              rows={4}
              value={customHeadScripts}
              onChange={(e) => setCustomHeadScripts(e.target.value)}
              placeholder={`<!-- Additional tracking or verification scripts -->`}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition shadow-lg"
            >
              {saving ? 'Saving Config...' : 'Save Tracking Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
