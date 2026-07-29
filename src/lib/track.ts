import { sendMetaCapiLeadEvent } from '@/app/actions/tracking';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Dispatch generic conversion/analytics event to dataLayer, GA4 (gtag), and Meta Pixel (fbq).
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;

  // 1. Push to GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  // 2. Dispatch to GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // 3. Dispatch to Meta Pixel
  if (typeof window.fbq === 'function') {
    if (eventName === 'Lead' || eventName === 'Contact' || eventName === 'PageView') {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('trackCustom', eventName, params);
    }
  }
}

/**
 * Fire GA4 generate_lead + Meta Lead + server-side Meta Conversions API (CAPI).
 */
export function trackLeadSubmit(data: {
  name?: string;
  phone?: string;
  email?: string;
  sourcePage?: string;
}): void {
  trackEvent('generate_lead', {
    event_category: 'Lead',
    event_label: data.sourcePage || 'Form Submission',
    ...data,
  });

  trackEvent('Lead', {
    content_name: data.sourcePage || 'Form Submission',
    currency: 'INR',
  });

  // Asynchronous Meta CAPI dispatch (server-side, non-blocking)
  sendMetaCapiLeadEvent(data).catch(() => {});
}

/**
 * Track WhatsApp CTA click.
 */
export function trackWhatsAppClick(sourcePage: string = 'Website'): void {
  trackEvent('contact_whatsapp', {
    event_category: 'CTA',
    event_label: sourcePage,
  });

  trackEvent('Contact', {
    contact_method: 'WhatsApp',
    source_page: sourcePage,
  });
}

/**
 * Track Phone Call CTA click.
 */
export function trackCallClick(phone: string = '+91 90143 03409', sourcePage: string = 'Website'): void {
  trackEvent('contact_call', {
    event_category: 'CTA',
    event_label: sourcePage,
    phone_number: phone,
  });

  trackEvent('Contact', {
    contact_method: 'Call',
    phone_number: phone,
    source_page: sourcePage,
  });
}

/**
 * Track AI Construction Calculator completion.
 */
export function trackCalculatorComplete(calculatorData: Record<string, any> = {}): void {
  trackEvent('calculator_complete', {
    event_category: 'Tool',
    event_label: 'AI House Construction Calculator',
    ...calculatorData,
  });
}
