import { getGoogleServiceAccountToken } from './auth';

export interface GscQueryRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscAnalyticsResult {
  rows: GscQueryRow[];
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
}

/**
 * Query GSC Search Analytics API for top queries or top pages.
 */
export async function fetchSearchAnalyticsGsc(params: {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: ('query' | 'page')[];
  rowLimit?: number;
}): Promise<{ data: GscAnalyticsResult | null; error?: string }> {
  const { token, error } = await getGoogleServiceAccountToken();
  if (!token) return { data: null, error: error || 'Service account not configured' };

  try {
    const encodedSite = encodeURIComponent(params.siteUrl);
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`;

    const body = {
      startDate: params.startDate,
      endDate: params.endDate,
      dimensions: params.dimensions || ['query'],
      rowLimit: params.rowLimit || 25,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: `GSC API Error (${res.status}): ${errText}` };
    }

    const json = await res.json();
    const rows: GscQueryRow[] = json.rows || [];

    let totalClicks = 0;
    let totalImpressions = 0;
    let sumCtr = 0;
    let sumPosition = 0;

    rows.forEach((r) => {
      totalClicks += r.clicks || 0;
      totalImpressions += r.impressions || 0;
      sumCtr += r.ctr || 0;
      sumPosition += r.position || 0;
    });

    const count = Math.max(1, rows.length);

    return {
      data: {
        rows,
        totalClicks,
        totalImpressions,
        avgCtr: Math.round((sumCtr / count) * 10000) / 100, // percentage
        avgPosition: Math.round((sumPosition / count) * 10) / 10,
      },
    };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to query GSC API' };
  }
}

/**
 * Submit XML sitemap to Google Search Console API.
 */
export async function submitSitemapGsc(
  siteUrl: string,
  sitemapUrl: string = 'https://www.onestudio.in/sitemap.xml'
): Promise<{ ok: boolean; message: string }> {
  const { token, error } = await getGoogleServiceAccountToken();
  if (!token) return { ok: false, message: error || 'Service account not configured' };

  try {
    const encodedSite = encodeURIComponent(siteUrl);
    const encodedSitemap = encodeURIComponent(sitemapUrl);
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedSitemap}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, message: `Sitemap submission failed (${res.status}): ${errText}` };
    }

    return { ok: true, message: `Successfully submitted ${sitemapUrl} to Google Search Console!` };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Failed to submit sitemap' };
  }
}

/**
 * Query GSC URL Inspection API for indexing status.
 */
export async function inspectUrlGsc(
  siteUrl: string,
  inspectionUrl: string
): Promise<{ data: any; error?: string }> {
  const { token, error } = await getGoogleServiceAccountToken();
  if (!token) return { data: null, error: error || 'Service account not configured' };

  try {
    const url = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
    const body = {
      inspectionUrl,
      siteUrl,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: `URL Inspection API Error (${res.status}): ${errText}` };
    }

    const json = await res.json();
    return { data: json.inspectionResult || json, error: undefined };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to inspect URL' };
  }
}
