'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function WebVitals() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    function sendVital(metricName: string, metricVal: number, id?: string) {
      const body = JSON.stringify({
        name: metricName,
        value: metricVal,
        id: id || 'v4',
        path: pathname || '/',
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/vitals', body);
      } else {
        fetch('/api/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    }

    // 1. Observe Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          sendVital('LCP', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}

    // 2. Observe Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        sendVital('CLS', clsValue);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch {}

    // 3. Observe First Input Delay / INP
    try {
      const inpObserver = new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        if (firstInput) {
          sendVital('INP', (firstInput as any).duration || (firstInput as any).processingStart - firstInput.startTime);
        }
      });
      inpObserver.observe({ type: 'first-input', buffered: true });
    } catch {}
  }, [pathname]);

  return null;
}
