'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { evaluateContentAiCitability } from '@/app/actions/audit';
import type { AiCitabilityResult } from '@/lib/seo/ai-citability';

export default function AiClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [testContent, setTestContent] = useState(
    `## Turnkey Interior Design in HBR Layout Bangalore\n\nOne Studio delivers 10-year craftsmanship guaranteed residential interior design in HBR Layout 5th Block, Bengaluru.\n\n### Why Choose One Studio?\n\nOur team of interior designers handles space planning, modular kitchens, wardrobes, and luxury interior design within 45 days.`
  );
  const [testTitle, setTestTitle] = useState('Turnkey Interior Design HBR Layout');
  const [hasFaq, setHasFaq] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<AiCitabilityResult | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      runEvaluation();
    }
  }, [router]);

  const runEvaluation = async () => {
    setEvaluating(true);
    const res = await evaluateContentAiCitability(testTitle, testContent, hasFaq);
    setEvaluating(false);
    if (res.ok && res.data) {
      setResult(res.data);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
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
              <span>AI Search</span>
              <span>/</span>
              <span className="text-sky-400 font-medium">llms.txt &amp; Citability Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">AI Search Readiness Studio</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage <code className="bg-slate-900 text-sky-400 px-1.5 py-0.5 rounded">/llms.txt</code> site index and test content LLM citability for AI search engines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/llms.txt"
              target="_blank"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-2"
            >
              <span>🤖</span> View Live /llms.txt ↗
            </Link>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-lg border border-slate-800 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Content Citability Tester & Result Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Test Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
              Content AI Citability &amp; Snippet Tester
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Article / Page Title</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Content Body (Markdown Supported)</label>
                <textarea
                  rows={8}
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={hasFaq}
                    onChange={(e) => setHasFaq(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                  />
                  FAQPage Schema Attached
                </label>
                <span className="text-[10px] text-sky-400 font-mono">RECOMMENDED FOR SGE</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={runEvaluation}
                  disabled={evaluating}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition"
                >
                  {evaluating ? 'Evaluating...' : 'Evaluate AI Citability'}
                </button>
              </div>
            </div>
          </div>

          {/* Citability Score Panel (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
              AI Citability Diagnosis
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Readiness Score</span>
                  <div className="text-4xl font-black text-sky-400">{result.citabilityScore} / 100</div>
                  <span
                    className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold ${
                      result.citabilityScore >= 85
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {result.rating}
                  </span>
                </div>

                <div className="space-y-3">
                  {result.checks.map((check) => (
                    <div key={check.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className={check.passed ? 'text-emerald-400' : 'text-amber-400'}>
                          {check.passed ? '✓' : '⚠️'} {check.label}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">+{check.score} pts</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{check.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">Run evaluation to view AI citability score.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
