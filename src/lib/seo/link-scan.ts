import { staticLocalSeoPages } from '@/lib/localSeoData';

export interface BrokenLinkItem {
  sourcePath: string;
  targetUrl: string;
  statusCode: number;
  errorMsg: string;
}

export interface LinkScanResult {
  totalScanned: number;
  brokenCount: number;
  brokenLinks: BrokenLinkItem[];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PUBLIC_SEED_ROUTES = [
  '/',
  '/services',
  '/services/interior-design',
  '/services/commercial-interiors',
  '/news',
  '/contact',
  '/how-it-works',
  '/projects',
  '/estimate',
];

/**
 * On-demand throttled internal link crawler.
 * Respects robots limits by delaying 50ms between requests and skipping external domains.
 */
export async function scanInternalLinks(baseUrl: string = 'https://www.onestudio.in'): Promise<LinkScanResult> {
  const normBaseUrl = baseUrl.replace(/\/$/, '');
  const routesToScan = [...PUBLIC_SEED_ROUTES];

  // Add static local geo routes
  Object.keys(staticLocalSeoPages).forEach((slug) => {
    routesToScan.push(`/${slug}`);
  });

  const visitedUrls = new Set<string>();
  const brokenLinks: BrokenLinkItem[] = [];
  let totalScanned = 0;

  for (const route of routesToScan) {
    const fullUrl = `${normBaseUrl}${route}`;
    if (visitedUrls.has(fullUrl)) continue;

    visitedUrls.add(fullUrl);
    totalScanned++;

    try {
      // Respect origin with a 50ms throttle delay
      await delay(50);

      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'OneStudioLinkChecker/1.0' },
        cache: 'no-store',
      });

      if (!res.ok && res.status >= 400) {
        brokenLinks.push({
          sourcePath: route,
          targetUrl: fullUrl,
          statusCode: res.status,
          errorMsg: `HTTP ${res.status} ${res.statusText}`,
        });
        continue;
      }

      const html = await res.text();

      // Extract href links from HTML body
      const hrefRegex = /href=["'](\/[^"']+|https?:\/\/[^"']+)["']/g;
      let match: RegExpExecArray | null;

      while ((match = hrefRegex.exec(html)) !== null) {
        const href = match[1];

        // Skip non-HTTP links (mailto, tel, javascript, etc.)
        if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
          continue;
        }

        let targetUrl: string;
        let isInternal = false;

        if (href.startsWith('/')) {
          targetUrl = `${normBaseUrl}${href}`;
          isInternal = true;
        } else if (href.includes('onestudio.in') || href.includes('onestudio.co')) {
          targetUrl = href;
          isInternal = true;
        } else {
          continue; // Focus crawler on internal links
        }

        if (visitedUrls.has(targetUrl)) continue;

        visitedUrls.add(targetUrl);
        totalScanned++;

        // Throttle check target internal URL
        await delay(50);

        try {
          const checkRes = await fetch(targetUrl, {
            method: 'HEAD',
            headers: { 'User-Agent': 'OneStudioLinkChecker/1.0' },
          });

          if (!checkRes.ok && checkRes.status >= 400) {
            brokenLinks.push({
              sourcePath: route,
              targetUrl,
              statusCode: checkRes.status,
              errorMsg: `HTTP ${checkRes.status} ${checkRes.statusText}`,
            });
          }
        } catch (err: any) {
          brokenLinks.push({
            sourcePath: route,
            targetUrl,
            statusCode: 0,
            errorMsg: err?.message || 'Network unreachable',
          });
        }
      }
    } catch (err: any) {
      brokenLinks.push({
        sourcePath: route,
        targetUrl: fullUrl,
        statusCode: 0,
        errorMsg: err?.message || 'Failed to fetch page',
      });
    }
  }

  return {
    totalScanned,
    brokenCount: brokenLinks.length,
    brokenLinks,
  };
}
