import type { FullSiteAuditReport } from './audit';

export interface DriftIssue {
  type: 'score_drop' | 'title_changed' | 'canonical_removed' | 'schema_broken';
  path: string;
  severity: 'critical' | 'warning';
  details: string;
}

export interface DriftReport {
  hasDrift: boolean;
  scoreDifference: number;
  driftCount: number;
  issues: DriftIssue[];
}

/**
 * Compares current SEO audit snapshot against previous baseline audit.
 */
export function detectBaselineDrift(
  current: FullSiteAuditReport,
  baseline?: FullSiteAuditReport | null
): DriftReport {
  const issues: DriftIssue[] = [];

  if (!baseline) {
    return {
      hasDrift: false,
      scoreDifference: 0,
      driftCount: 0,
      issues: [],
    };
  }

  const scoreDifference = current.score - baseline.score;

  // 1. Health Score Drop Check (> 5 points regression)
  if (scoreDifference <= -5) {
    issues.push({
      type: 'score_drop',
      path: 'GLOBAL',
      severity: 'critical',
      details: `Global SEO health score dropped by ${Math.abs(scoreDifference)} points (Baseline: ${baseline.score}, Current: ${current.score})`,
    });
  }

  // Map baseline routes by path
  const baseMap = new Map(baseline.routeDetails.map((r) => [r.path, r]));

  // 2. Per-Route Drift Analysis
  current.routeDetails.forEach((currRoute) => {
    const baseRoute = baseMap.get(currRoute.path);
    if (!baseRoute) return;

    // Check title tag removal/change
    if (baseRoute.hasTitle && !currRoute.hasTitle) {
      issues.push({
        type: 'title_changed',
        path: currRoute.path,
        severity: 'critical',
        details: `Title tag removed on ${currRoute.path}`,
      });
    }

    // Check canonical removal
    if (baseRoute.hasCanonical && !currRoute.hasCanonical) {
      issues.push({
        type: 'canonical_removed',
        path: currRoute.path,
        severity: 'critical',
        details: `Canonical URL tag removed on ${currRoute.path}`,
      });
    }

    // Check schema breakage
    if (baseRoute.hasSchema && !currRoute.hasSchema) {
      issues.push({
        type: 'schema_broken',
        path: currRoute.path,
        severity: 'critical',
        details: `JSON-LD schema block detached or broken on ${currRoute.path}`,
      });
    }
  });

  return {
    hasDrift: issues.length > 0,
    scoreDifference,
    driftCount: issues.length,
    issues,
  };
}

/**
 * Sends email alert via Resend API when SEO baseline regressions or drift are detected.
 * HARD GUARDRAIL: Never expose secret API keys in email content.
 */
export async function sendResendDriftAlert(driftReport: DriftReport): Promise<{ sent: boolean; message: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, message: 'RESEND_API_KEY environment variable is not configured.' };
  }

  if (!driftReport.hasDrift) {
    return { sent: false, message: 'No drift issues detected. Alert skipped.' };
  }

  try {
    const alertBody = driftReport.issues
      .map((i) => `• [${i.severity.toUpperCase()}] (${i.path}): ${i.details}`)
      .join('\n');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #e11d48;">⚠️ One Studio SEO Regression Alert</h2>
        <p>The automated SEO audit detected <strong>${driftReport.driftCount} baseline drift issue(s)</strong>:</p>
        <pre style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px;">${alertBody}</pre>
        <p style="font-size: 12px; color: #64748b;">Visit your Admin Dashboard to resolve these issues.</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'One Studio SEO Monitor <alerts@onestudio.in>',
        to: 'reachus@onestudio.in',
        subject: `🚨 [SEO Alert] ${driftReport.driftCount} Baseline Regression(s) Detected`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { sent: false, message: `Resend API error (${res.status}): ${errText}` };
    }

    return { sent: true, message: 'Drift alert email sent successfully via Resend API.' };
  } catch (err: any) {
    return { sent: false, message: err?.message || 'Failed to send alert via Resend' };
  }
}
