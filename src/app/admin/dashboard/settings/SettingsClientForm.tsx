'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSettings, updateSettings } from '@/app/actions/settings';
import type { SeoSettings } from '@/lib/types';

export default function SettingsClientForm() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'identity' | 'nap' | 'social' | 'verification' | 'stats'>('identity');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  const [formData, setFormData] = useState<SeoSettings>({
    id: 1,
    site_name: 'One Studio',
    site_url: 'https://www.onestudio.in',
    default_title_template: '%s | One Studio',
    default_meta_desc:
      'Bespoke interior design & luxury home execution in HBR Layout, Bengaluru. Transparent pricing, 150+ quality checks & 10-year warranty.',
    default_og_image: 'https://www.onestudio.in/og-default.jpg',
    business_name: 'One Studio',
    street_address: '38th Cross Rd, 1751, 15th Main Rd, 5th Block, 1st Stage, Telecom Layout',
    locality: 'HBR Layout',
    region: 'Bengaluru, Karnataka',
    postal_code: '560043',
    country: 'IN',
    phone: '+91 90143 03409',
    email: 'reachus@onestudio.in',
    whatsapp: '+91 90143 03409',
    geo_lat: 13.0247,
    geo_lng: 77.6288,
    opening_hours: [{ day: 'Monday-Saturday', opens: '09:00', closes: '19:00' }],
    social_profiles: {
      instagram: '',
      facebook: '',
      youtube: '',
      pinterest: '',
      linkedin: '',
    },
    gsc_verification: '',
    bing_verification: '',
    brand_stats: {
      quality_checks: 415,
      warranty_structural: '10-15 years',
      warranty_workmanship: '1 year',
      delays: 'zero',
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadSettings();
    }
  }, [router]);

  const loadSettings = async () => {
    setLoading(true);
    const res = await getSettings();
    if (res.ok && res.data) {
      setFormData(res.data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const res = await updateSettings(formData);
    setSaving(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to save settings' });
    } else {
      const warningText = (res.data as any)?.warning;
      if (warningText) {
        setStatusMsg({ type: 'warning', text: `Settings saved with warning: ${warningText}` });
      } else {
        setStatusMsg({ type: 'success', text: 'Global SEO settings saved and cache revalidated successfully!' });
      }
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm font-semibold">Loading Global SEO Settings...</p>
        </div>
      </div>
    );
  }

  // NAP exact string preview
  const formattedAddress = `${formData.street_address}, ${formData.locality}, ${formData.region} ${formData.postal_code}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-black text-white tracking-tight">⚙️ Global SEO Settings</h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('onestudio_admin_token');
              router.push('/admin');
            }}
            className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-900/50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {/* Notification Banner */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl border text-sm font-medium flex items-center justify-between ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : statusMsg.type === 'warning'
                ? 'bg-amber-950/60 border-amber-800 text-amber-300'
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

        {/* NAP Single Source of Truth Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-500 text-slate-950 text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-widest">
            SINGLE SOURCE OF TRUTH (NAP)
          </div>
          <h2 className="text-base font-bold text-white mb-2">Verified Business Fact Sheet (Schema & Metadata)</h2>
          <p className="text-xs text-slate-400 mb-4">
            This exact byte-identical NAP feeds Schema.org JSON-LD, site footer, resolve.ts metadata layer, and GSC settings.
          </p>

          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 font-mono text-xs space-y-1.5 text-slate-300">
            <div>
              <span className="text-orange-400 font-bold">Business Name:</span> {formData.business_name}
            </div>
            <div>
              <span className="text-orange-400 font-bold">Address String:</span> {formattedAddress}
            </div>
            <div>
              <span className="text-orange-400 font-bold">Phone / WhatsApp:</span> {formData.phone} / {formData.whatsapp}
            </div>
            <div>
              <span className="text-orange-400 font-bold">Public Email:</span> {formData.email}
            </div>
            <div>
              <span className="text-orange-400 font-bold">Canonical Website:</span> {formData.site_url}
            </div>
          </div>
        </div>

        {/* Tabbed Form Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/50 p-2 gap-2">
            {[
              { id: 'identity', label: '1. Identity & Defaults' },
              { id: 'nap', label: '2. Business / NAP' },
              { id: 'social', label: '3. Social Profiles' },
              { id: 'verification', label: '4. Webmaster Verification' },
              { id: 'stats', label: '5. Brand Stats (Config)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
            {/* TAB 1: IDENTITY */}
            {activeTab === 'identity' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={formData.site_name}
                      onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Site URL (Canonical Base)
                    </label>
                    <input
                      type="url"
                      value={formData.site_url}
                      onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Default Title Template (must contain %s)
                  </label>
                  <input
                    type="text"
                    value={formData.default_title_template}
                    onChange={(e) => setFormData({ ...formData, default_title_template: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    placeholder="%s | One Studio"
                    required
                  />
                  {!formData.default_title_template.includes('%s') && (
                    <p className="text-xs text-amber-400 mt-1 font-medium">
                      ⚠️ Warning: Title template lacks "%s" placeholder. Page titles will not render dynamically.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.default_meta_desc}
                    onChange={(e) => setFormData({ ...formData, default_meta_desc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Target length: 120–160 characters</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Default OpenGraph Social Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.default_og_image}
                    onChange={(e) => setFormData({ ...formData, default_og_image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* TAB 2: BUSINESS / NAP */}
            {activeTab === 'nap' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Legal Business Name
                    </label>
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Public Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.street_address}
                    onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Locality
                    </label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Region / State
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Country Code
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Geo Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.geo_lat}
                      onChange={(e) => setFormData({ ...formData, geo_lat: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Geo Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.geo_lng}
                      onChange={(e) => setFormData({ ...formData, geo_lng: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL PROFILES */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  These social profile URLs are added to the Schema.org LocalBusiness `sameAs` array for Google Knowledge Panel verification.
                </p>
                {['instagram', 'facebook', 'youtube', 'pinterest', 'linkedin'].map((platform) => (
                  <div key={platform}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      {platform} URL
                    </label>
                    <input
                      type="url"
                      placeholder={`https://www.${platform}.com/onestudio`}
                      value={(formData.social_profiles as any)?.[platform] || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social_profiles: {
                            ...formData.social_profiles,
                            [platform]: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: WEBMASTER VERIFICATION */}
            {activeTab === 'verification' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Google Search Console Verification Meta Tag Content
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. google-site-verification-token"
                    value={formData.gsc_verification || ''}
                    onChange={(e) => setFormData({ ...formData, gsc_verification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Bing Webmaster Verification Token
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. msvalidate.01-token"
                    value={formData.bing_verification || ''}
                    onChange={(e) => setFormData({ ...formData, bing_verification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: BRAND STATS */}
            {activeTab === 'stats' && (
              <div className="space-y-5">
                <div className="p-4 bg-orange-950/30 border border-orange-800/40 rounded-2xl text-xs text-orange-200">
                  ⚠️ <strong>Hard Guardrail Enforced:</strong> Review counts and star ratings cannot be hardcoded or manually edited here. AggregateRating MUST come from live Google/Trustpilot APIs.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Quality Checks Count
                    </label>
                    <input
                      type="number"
                      value={formData.brand_stats?.quality_checks ?? 415}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand_stats: {
                            ...formData.brand_stats,
                            quality_checks: parseInt(e.target.value, 10) || 0,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Structural Warranty Term
                    </label>
                    <input
                      type="text"
                      value={formData.brand_stats?.warranty_structural || '10-15 years'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand_stats: {
                            ...formData.brand_stats,
                            warranty_structural: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Workmanship Warranty Term
                    </label>
                    <input
                      type="text"
                      value={formData.brand_stats?.warranty_workmanship || '1 year'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand_stats: {
                            ...formData.brand_stats,
                            warranty_workmanship: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Delays Guarantee Term
                    </label>
                    <input
                      type="text"
                      value={formData.brand_stats?.delays || 'zero'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          brand_stats: {
                            ...formData.brand_stats,
                            delays: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg cursor-pointer"
              >
                {saving ? 'Saving Settings...' : 'Save Global SEO Settings'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
