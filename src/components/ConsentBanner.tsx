'use client';

import React, { useEffect, useState } from 'react';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const choice = localStorage.getItem('onestudio_consent_status');
    if (!choice) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  const handleAcceptAll = () => {
    localStorage.setItem('onestudio_consent_status', 'granted');

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
    }

    if (typeof window.fbq === 'function') {
      window.fbq('consent', 'grant');
      window.fbq('track', 'PageView');
    }

    setShowBanner(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('onestudio_consent_status', 'denied');
    setShowBanner(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[110] bg-slate-900/95 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-2xl text-slate-200 text-xs space-y-3 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="font-extrabold text-sm text-white flex items-center gap-2">
            <span>🍪</span> Privacy &amp; Cookie Preferences
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            We use cookies to analyze site traffic and optimize your turnkey construction experience. Choose your consent level below.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleRejectAll}
          className="w-1/2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition"
        >
          Essential Only
        </button>
        <button
          onClick={handleAcceptAll}
          className="w-1/2 py-2 px-3 bg-[#f2bd19] hover:bg-amber-500 text-slate-900 font-black text-xs rounded-xl shadow-md transition"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
