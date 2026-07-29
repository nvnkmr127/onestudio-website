'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listRobotsRules, addRule, deleteRule, toggleAiCrawler, AI_CRAWLERS } from '@/app/actions/robots';
import type { RobotsRule } from '@/lib/types';

export default function RobotsClient() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [rules, setRules] = useState<RobotsRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [newUserAgent, setNewUserAgent] = useState('*');
  const [newRuleType, setNewRuleType] = useState<'allow' | 'disallow'>('disallow');
  const [newPath, setNewPath] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadRules();
    }
  }, [router]);

  const loadRules = async () => {
    setLoading(true);
    const res = await listRobotsRules();
    if (res.ok && res.data) {
      setRules(res.data);
    }
    setLoading(false);
  };

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPath.trim()) return;

    setIsSubmitting(true);
    setStatusMsg(null);

    const res = await addRule({
      user_agent: newUserAgent.trim() || '*',
      rule_type: newRuleType,
      path: newPath.trim().startsWith('/') || newPath.trim().startsWith('*') ? newPath.trim() : `/${newPath.trim()}`,
      sort_order: rules.length + 1,
    });

    setIsSubmitting(false);

    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to add rule' });
    } else {
      setStatusMsg({ type: 'success', text: 'Rule added and /robots.txt revalidated!' });
      setNewPath('');
      loadRules();
    }
  };

  const handleDeleteRule = async (id: string) => {
    setStatusMsg(null);
    const res = await deleteRule(id);
    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to delete rule' });
    } else {
      setStatusMsg({ type: 'success', text: 'Rule deleted!' });
      loadRules();
    }
  };

  const handleAiToggle = async (userAgent: string, currentlyBlocked: boolean) => {
    setStatusMsg(null);
    const shouldBlock = !currentlyBlocked;
    const res = await toggleAiCrawler(userAgent, shouldBlock);
    if (!res.ok) {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to update AI crawler policy' });
    } else {
      setStatusMsg({
        type: 'success',
        text: `${userAgent} ${shouldBlock ? 'BLOCKED (Disallow: /)' : 'ALLOWED (Allow: /)'}!`,
      });
      loadRules();
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm font-semibold">Loading robots.txt Crawl Manager...</p>
        </div>
      </div>
    );
  }

  // Check which AI crawlers are currently blocked
  const isAiBlocked = (ua: string) => {
    const r = rules.find((item) => item.user_agent === ua);
    return r ? r.rule_type === 'disallow' && r.path === '/' : false;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-black text-white tracking-tight">🤖 robots.txt Crawl Manager</h1>
          </div>
          <Link
            href="/robots.txt"
            target="_blank"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 bg-orange-950/40 px-3 py-1.5 rounded-lg border border-orange-900/50"
          >
            View Live /robots.txt ↗
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
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

        {/* AI CRAWLER POLICY TOGGLES */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">🤖 AI &amp; LLM Crawler Control Panel</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle access for AI scrapers and Search LLMs without redeploying.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              ZERO REDEPLOY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {AI_CRAWLERS.map((crawler) => {
              const blocked = isAiBlocked(crawler.name);
              return (
                <div
                  key={crawler.name}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    blocked
                      ? 'bg-red-950/20 border-red-900/60 text-red-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{crawler.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">{crawler.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAiToggle(crawler.name, blocked)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      blocked
                        ? 'bg-red-600 text-white hover:bg-red-500 shadow-md'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
                    }`}
                  >
                    {blocked ? '🚫 Blocked' : '✅ Allowed'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ADD RULE & RULES TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form: Add Rule */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 h-fit">
            <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-slate-800 pb-3">
              ➕ Add Custom Crawl Rule
            </h2>

            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  User Agent
                </label>
                <input
                  type="text"
                  placeholder="e.g. * or Googlebot"
                  value={newUserAgent}
                  onChange={(e) => setNewUserAgent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Rule Type
                </label>
                <select
                  value={newRuleType}
                  onChange={(e) => setNewRuleType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="disallow">Disallow (Block Path)</option>
                  <option value="allow">Allow (Permit Path)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Path Pattern
                </label>
                <input
                  type="text"
                  placeholder="e.g. /private or /*?*"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isSubmitting ? 'Saving Rule...' : 'Save & Publish Rule'}
              </button>
            </form>
          </div>

          {/* Table: Active Rules */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                📋 Active Crawl Rules ({rules.length})
              </h2>
              <span className="text-[11px] text-slate-400">
                🔒 Security Guardrail: <code className="text-red-400">/admin</code> is permanently disallowed.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">User Agent</th>
                    <th className="py-3 px-3">Directive</th>
                    <th className="py-3 px-3">Path Pattern</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500 font-sans">
                        No rules configured. Defaulting to standard robots policies.
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule.id || Math.random()} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-3 font-bold text-white">{rule.user_agent}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase ${
                              rule.rule_type === 'allow'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-red-950 text-red-300 border border-red-800'
                            }`}
                          >
                            {rule.rule_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300">{rule.path}</td>
                        <td className="py-3.5 px-3 text-right">
                          {rule.id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRule(rule.id!)}
                              className="text-xs text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
