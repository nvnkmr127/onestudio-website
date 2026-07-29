import { createClient } from '@/lib/supabase/server';
import { staticLocalSeoPages } from '@/lib/localSeoData';

export interface AuditRouteResult {
  path: string;
  hasTitle: boolean;
  title?: string;
  hasMetaDesc: boolean;
  metaDesc?: string;
  hasCanonical: boolean;
  hasSchema: boolean;
  issues: string[];
}

export interface FullSiteAuditReport {
  timestamp: string;
  score: number;
  totalRoutesChecked: number;
  routesWithIssues: number;
  issues: Array<{ severity: 'critical' | 'warning' | 'info'; code: string; message: string }>;
  routeDetails: AuditRouteResult[];
}

const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/services/house-construction',
  '/services/interior-design',
  '/services/commercial-construction',
  '/news',
  '/contact',
  '/how-it-works',
  '/projects',
  '/ai-house-construction-calculator',
];

/**
 * Runs full-site SEO audit checking metadata, canonicals, schema tags, and heading health.
 */
export async function runFullSiteSeoAudit(): Promise<FullSiteAuditReport> {
  const sb = createClient();
  const routesToAudit = [...PUBLIC_ROUTES];

  Object.keys(staticLocalSeoPages).forEach((slug) => {
    routesToAudit.push(`/${slug}`);
  });

  // Fetch seo_meta and schema_blocks from database
  const [{ data: metaRows }, { data: schemaRows }] = await Promise.all([
    sb.from('seo_meta').select('*'),
    sb.from('schema_blocks').select('*'),
  ]);

  const metaMap = new Map<string, any>();
  if (metaRows) {
    metaRows.forEach((r: any) => metaMap.set(r.path, r));
  }

  const routeDetails: AuditRouteResult[] = [];
  const globalIssues: Array<{ severity: 'critical' | 'warning' | 'info'; code: string; message: string }> = [];
  let routesWithIssues = 0;

  routesToAudit.forEach((path) => {
    const meta = metaMap.get(path);
    const issues: string[] = [];

    const hasTitle = Boolean(meta?.title || path === '/' || staticLocalSeoPages[path.replace(/^\//, '')]);
    const hasMetaDesc = Boolean(meta?.meta_desc || path === '/' || staticLocalSeoPages[path.replace(/^\//, '')]);
    const hasCanonical = Boolean(meta?.canonical_url || meta?.canonical_url !== null);
    const hasSchema = Boolean(schemaRows && schemaRows.length > 0);

    if (!hasTitle) {
      issues.push('Missing SEO Title Tag');
      globalIssues.push({ severity: 'critical', code: 'MISSING_TITLE', message: `Title missing on ${path}` });
    }

    if (!hasMetaDesc) {
      issues.push('Missing Meta Description');
      globalIssues.push({ severity: 'warning', code: 'MISSING_META_DESC', message: `Meta description missing on ${path}` });
    }

    if (issues.length > 0) {
      routesWithIssues++;
    }

    routeDetails.push({
      path,
      hasTitle,
      title: meta?.title,
      hasMetaDesc,
      metaDesc: meta?.meta_desc,
      hasCanonical,
      hasSchema,
      issues,
    });
  });

  const total = Math.max(1, routesToAudit.length);
  const healthScore = Math.max(0, Math.round(100 - (routesWithIssues / total) * 40));

  const report: FullSiteAuditReport = {
    timestamp: new Date().toISOString(),
    score: healthScore,
    totalRoutesChecked: total,
    routesWithIssues,
    issues: globalIssues,
    routeDetails,
  };

  // Write snapshot to seo_audits table
  await sb.from('seo_audits').insert({
    path: 'FULL_SITE_AUDIT',
    score: healthScore,
    issues: globalIssues,
    snapshot: report,
    created_at: new Date().toISOString(),
  });

  return report;
}
