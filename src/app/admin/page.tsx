'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAdminPasscodeAction } from '@/app/actions/adminActions';

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await verifyAdminPasscodeAction(passcode);
      if (res.success && res.token) {
        localStorage.setItem('onestudio_admin_token', res.token);
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(res.error || 'Incorrect passcode.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden text-white">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-[#f2bd19]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#f2bd19] text-slate-900 mx-auto flex items-center justify-center font-black text-2xl shadow-lg">
            🔑
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">One Studio Admin</h1>
          <p className="text-xs text-slate-400 font-medium">
            Enter your admin passcode to access leads &amp; content studio
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Admin Passcode
            </label>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:border-[#f2bd19] transition-all"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#f2bd19] hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            {isLoading ? 'VERIFYING...' : 'ENTER DASHBOARD →'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Default Passcode: <code className="text-[#f2bd19] bg-slate-950 px-2 py-0.5 rounded">onestudio2025</code>
          </p>
        </div>
      </div>
    </main>
  );
}
