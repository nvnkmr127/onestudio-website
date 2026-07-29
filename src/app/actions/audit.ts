'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ActionResult, SeoAudit } from '@/lib/types';
import { runFullSiteSeoAudit, FullSiteAuditReport } from '@/lib/seo/audit';
import { detectBaselineDrift, sendResendDriftAlert, DriftReport } from '@/lib/seo/drift';
import { calculateAiCitabilityScore, AiCitabilityResult } from '@/lib/seo/ai-citability';

export interface AuditRunResponse {
  audit: FullSiteAuditReport;
  drift: DriftReport;
  alertResult?: { sent: boolean; message: string };
}

export async function executeFullSeoAuditAndDriftCheck(): Promise<ActionResult<AuditRunResponse>> {
  try {
    const sb = createClient();

    // Fetch previous baseline audit snapshot
    const { data: previousAudits } = await sb
      .from('seo_audits')
      .select('*')
      .eq('path', 'FULL_SITE_AUDIT')
      .order('created_at', { ascending: false })
      .limit(1);

    const baselineAudit: FullSiteAuditReport | null = previousAudits?.[0]?.snapshot || null;

    // Run current full site audit
    const currentAudit = await runFullSiteSeoAudit();

    // Detect baseline drift
    const driftReport = detectBaselineDrift(currentAudit, baselineAudit);

    // Send Resend alert if drift detected
    let alertResult;
    if (driftReport.hasDrift) {
      alertResult = await sendResendDriftAlert(driftReport);
    }

    revalidatePath('/admin/dashboard/audits');

    return {
      ok: true,
      data: {
        audit: currentAudit,
        drift: driftReport,
        alertResult,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to execute SEO audit & drift check' };
  }
}

export async function evaluateContentAiCitability(
  title: string,
  content: string,
  hasFaqSchema?: boolean
): Promise<ActionResult<AiCitabilityResult>> {
  try {
    const result = calculateAiCitabilityScore({
      title,
      content,
      hasFaqSchema,
      hasLocalBusinessSchema: true,
    });

    return { ok: true, data: result };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to evaluate AI citability score' };
  }
}
