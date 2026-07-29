'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listSchemaBlocks, saveSchemaBlock, deleteSchemaBlock, syncGlobalSchemasFromSettings } from '@/app/actions/schema';
import { validateSchemaBlock } from '@/lib/seo/build-schema';
import type { SchemaBlock } from '@/lib/types';

export default function SchemaClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [blocks, setBlocks] = useState<SchemaBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockName, setBlockName] = useState('');
  const [blockType, setBlockType] = useState('FAQPage');
  const [isGlobal, setIsGlobal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // FAQ Preset builder helper state
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>([
    { question: 'What craftsmanship warranty does One Studio provide?', answer: 'We provide a 10-year craftsmanship warranty on all turnkey interior projects.' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadBlocks();
    }
  }, [router]);

  const loadBlocks = async () => {
    setLoading(true);
    const res = await listSchemaBlocks();
    if (res.ok && res.data) {
      setBlocks(res.data);
    }
    setLoading(false);
  };

  const handleSyncGlobal = async () => {
    setStatusMsg(null);
    const res = await syncGlobalSchemasFromSettings();
    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to sync global schemas' });
    } else {
      setStatusMsg({ type: 'success', text: 'Regenerated Global Organization & GeneralContractor schemas from NAP!' });
      loadBlocks();
    }
  };

  const handleTypePreset = (type: string) => {
    setBlockType(type);
    setValidationErrors([]);
    if (type === 'FAQPage') {
      const template = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };
      setJsonText(JSON.stringify(template, null, 2));
    } else if (type === 'Service') {
      const template = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Turnkey Luxury Interiors',
        serviceType: 'Interior Design',
        provider: {
          '@type': 'InteriorDesign',
          name: 'One Studio',
          telephone: '+91 90143 03409',
        },
        areaServed: {
          '@type': 'City',
          name: 'Bengaluru',
        },
      };
      setJsonText(JSON.stringify(template, null, 2));
    } else if (type === 'BlogPosting') {
      const template = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: 'Guide to BBMP Construction Approvals in 2025',
        author: {
          '@type': 'Organization',
          name: 'One Studio Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'One Studio',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.onestudio.in/og-default.jpg',
          },
        },
      };
      setJsonText(JSON.stringify(template, null, 2));
    } else if (type === 'BreadcrumbList') {
      const template = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.onestudio.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: 'https://www.onestudio.in/services',
          },
        ],
      };
      setJsonText(JSON.stringify(template, null, 2));
    }
  };

  const handleValidate = () => {
    try {
      const obj = JSON.parse(jsonText);
      const res = validateSchemaBlock(blockType, obj);
      if (res.isValid) {
        setValidationErrors([]);
        setStatusMsg({ type: 'success', text: '✅ Schema JSON-LD is valid and complies with Google guidelines!' });
      } else {
        setValidationErrors(res.errors);
        setStatusMsg({ type: 'error', text: '⚠️ Schema validation issues found.' });
      }
    } catch {
      setValidationErrors(['Invalid JSON string syntax.']);
      setStatusMsg({ type: 'error', text: 'Syntax error in JSON string.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setSaving(true);

    let parsedObj: any;
    try {
      parsedObj = JSON.parse(jsonText);
    } catch {
      setStatusMsg({ type: 'error', text: 'JSON syntax is invalid.' });
      setSaving(false);
      return;
    }

    const validation = validateSchemaBlock(blockType, parsedObj);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setStatusMsg({ type: 'error', text: 'Validation failed: ' + validation.errors.join(' ') });
      setSaving(false);
      return;
    }

    const res = await saveSchemaBlock({
      id: selectedBlockId || undefined,
      name: blockName,
      type: blockType,
      json_ld: parsedObj,
      is_global: isGlobal,
    });

    setSaving(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to save schema block' });
    } else {
      setStatusMsg({ type: 'success', text: `Saved schema block "${blockName}"` });
      resetForm();
      loadBlocks();
    }
  };

  const handleEdit = (block: SchemaBlock) => {
    setSelectedBlockId(block.id || null);
    setBlockName(block.name);
    setBlockType(block.type);
    setIsGlobal(block.is_global);
    setJsonText(JSON.stringify(block.json_ld, null, 2));
    setValidationErrors([]);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete schema block "${name}"?`)) return;
    setStatusMsg(null);
    const res = await deleteSchemaBlock(id);
    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to delete schema block' });
    } else {
      setStatusMsg({ type: 'success', text: 'Deleted schema block' });
      loadBlocks();
    }
  };

  const resetForm = () => {
    setSelectedBlockId(null);
    setBlockName('');
    setBlockType('FAQPage');
    setIsGlobal(false);
    setJsonText('');
    setValidationErrors([]);
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
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
              <span>SEO Control Plane</span>
              <span>/</span>
              <span className="text-amber-400 font-medium">JSON-LD Schema Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Schema.org JSON-LD Studio</h1>
            <p className="text-slate-400 text-sm mt-1">
              Build global Organization/LocalBusiness &amp; page-attached schema blocks with strict validation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncGlobal}
              className="px-4 py-2 bg-[#f2bd19] hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate Global NAP Schemas
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

        {/* Builder & Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-white">
                {selectedBlockId ? 'Edit Schema Block' : 'Create New Schema Block'}
              </h2>
              {selectedBlockId && (
                <button onClick={resetForm} className="text-xs text-amber-400 hover:underline">
                  + Create New Block
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Block Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    placeholder="e.g. Turnkey FAQ Schema"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Schema @type</label>
                  <select
                    value={blockType}
                    onChange={(e) => handleTypePreset(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="FAQPage">FAQPage</option>
                    <option value="Service">Service</option>
                    <option value="BlogPosting">BlogPosting</option>
                    <option value="HowTo">HowTo</option>
                    <option value="BreadcrumbList">BreadcrumbList</option>
                    <option value="Organization">Organization</option>
                    <option value="GeneralContractor">GeneralContractor</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={isGlobal}
                    onChange={(e) => setIsGlobal(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
                  />
                  Inject Globally on Every Page (is_global)
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-400">JSON-LD Code</label>
                  <button
                    type="button"
                    onClick={handleValidate}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    🔍 Validate JSON-LD
                  </button>
                </div>
                <textarea
                  rows={10}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "${blockType}",\n  ...\n}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {validationErrors.length > 0 && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-xs space-y-1">
                  <div className="font-semibold">Validation Errors:</div>
                  <ul className="list-disc list-inside">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !blockName || !jsonText}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition shadow-md"
                >
                  {saving ? 'Saving...' : selectedBlockId ? 'Update Block' : 'Save Schema Block'}
                </button>
              </div>
            </form>
          </div>

          {/* Right List (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
              Schema Library ({blocks.length})
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {blocks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No schema blocks found.</p>
              ) : (
                blocks.map((b) => (
                  <div key={b.id || b.name} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                        {b.type}
                      </span>
                      {b.is_global && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                          GLOBAL
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-white">{b.name}</h3>

                    <pre className="p-2 bg-slate-900 rounded text-[10px] font-mono text-slate-400 max-h-24 overflow-y-auto">
                      {JSON.stringify(b.json_ld, null, 2)}
                    </pre>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleEdit(b)}
                        className="text-xs text-slate-300 hover:text-white px-2 py-1 bg-slate-800 rounded"
                      >
                        Edit
                      </button>
                      {!b.is_global && b.id && (
                        <button
                          onClick={() => handleDelete(b.id!, b.name)}
                          className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-950/60 border border-rose-800/60 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
