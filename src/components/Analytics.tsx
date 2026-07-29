'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import type { PublicTrackingConfig } from '@/app/actions/tracking';

interface AnalyticsProps {
  config: PublicTrackingConfig | null;
}

export default function Analytics({ config }: AnalyticsProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if consent was previously granted in localStorage
    const savedConsent = localStorage.getItem('onestudio_consent_status');
    if (savedConsent === 'granted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
      if (typeof window.fbq === 'function') {
        window.fbq('consent', 'grant');
      }
    }
  }, []);

  if (!config) return null;

  const { ga4_id, gtm_id, meta_pixel_id, custom_head_scripts } = config;

  return (
    <>
      {/* 1. Google Consent Mode v2 Default Denied Init */}
      <Script
        id="consent-mode-v2-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
          `,
        }}
      />

      {/* 2. Google Analytics 4 (GA4) */}
      {ga4_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4_id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4_id}', { page_path: window.location.pathname });
              `,
            }}
          />
        </>
      )}

      {/* 3. Google Tag Manager (GTM) */}
      {gtm_id && (
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtm_id}');
            `,
          }}
        />
      )}

      {/* 4. Meta Pixel */}
      {meta_pixel_id && (
        <Script
          id="meta-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${meta_pixel_id}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* 5. Custom Head Scripts (Sanitized Admin Scripts) */}
      {custom_head_scripts && (
        <Script
          id="custom-head-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: custom_head_scripts }}
        />
      )}
    </>
  );
}
