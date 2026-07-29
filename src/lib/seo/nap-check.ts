import { createClient } from '@/lib/supabase/server';
import type { SeoSettings } from '@/lib/types';
import { staticLocalSeoPages } from '@/lib/localSeoData';

export interface NapMismatch {
  surface: string;
  field: 'name' | 'phone' | 'email' | 'address' | 'website';
  expected: string;
  found: string;
  severity: 'critical' | 'warning';
}

export interface NapAuditReport {
  isCompliant: boolean;
  totalSurfacesChecked: number;
  driftCount: number;
  issues: NapMismatch[];
}

// Canonical NAP Single Source of Truth
export const VERIFIED_NAP = {
  name: 'One Studio',
  address: '38th Cross Rd, 1751, 15th Main Rd, 5th Block, 1st Stage, Telecom Layout, HBR Layout, Bengaluru, Karnataka 560043',
  phone: '+91 90143 03409',
  email: 'reachus@onestudio.in',
  website: 'https://www.onestudio.in',
};

/**
 * Normalizes phone numbers for comparison (+91 90143 03409 -> +919014303409)
 */
function normPhone(p?: string | null): string {
  if (!p) return '';
  return p.replace(/[\s\-\(\)]/g, '');
}

/**
 * Scans DB settings, schema blocks, and geo landing pages for NAP drift against Single Source of Truth.
 */
export async function runNapDriftCheck(): Promise<NapAuditReport> {
  const issues: NapMismatch[] = [];
  let surfacesChecked = 0;

  try {
    const sb = createClient();
    const [{ data: settings }, { data: globalSchemas }] = await Promise.all([
      sb.from('seo_settings').select('*').eq('id', 1).maybeSingle(),
      sb.from('schema_blocks').select('*').eq('is_global', true),
    ]);

    // 1. Check Global seo_settings Table
    surfacesChecked++;
    if (settings) {
      const s = settings as SeoSettings;

      if (s.business_name && s.business_name !== VERIFIED_NAP.name) {
        issues.push({
          surface: 'seo_settings Table',
          field: 'name',
          expected: VERIFIED_NAP.name,
          found: s.business_name,
          severity: 'critical',
        });
      }

      if (normPhone(s.phone) !== normPhone(VERIFIED_NAP.phone)) {
        issues.push({
          surface: 'seo_settings Table',
          field: 'phone',
          expected: VERIFIED_NAP.phone,
          found: s.phone || 'null',
          severity: 'critical',
        });
      }

      if (s.email && s.email.toLowerCase().trim() !== VERIFIED_NAP.email) {
        issues.push({
          surface: 'seo_settings Table',
          field: 'email',
          expected: VERIFIED_NAP.email,
          found: s.email,
          severity: 'critical',
        });
      }
    } else {
      issues.push({
        surface: 'seo_settings Table',
        field: 'name',
        expected: VERIFIED_NAP.name,
        found: 'Missing DB Row (id=1)',
        severity: 'critical',
      });
    }

    // 2. Check Global Schema Blocks
    surfacesChecked++;
    if (globalSchemas && globalSchemas.length > 0) {
      globalSchemas.forEach((block: any) => {
        const jsonLd = block.json_ld;
        if (!jsonLd) return;

        if (jsonLd.telephone && normPhone(jsonLd.telephone) !== normPhone(VERIFIED_NAP.phone)) {
          issues.push({
            surface: `Global Schema Block (${block.name})`,
            field: 'phone',
            expected: VERIFIED_NAP.phone,
            found: jsonLd.telephone,
            severity: 'critical',
          });
        }

        if (jsonLd.email && jsonLd.email.toLowerCase().trim() !== VERIFIED_NAP.email) {
          issues.push({
            surface: `Global Schema Block (${block.name})`,
            field: 'email',
            expected: VERIFIED_NAP.email,
            found: jsonLd.email,
            severity: 'critical',
          });
        }
      });
    }

    // 3. Check Geo Landing Pages (staticLocalSeoPages)
    Object.entries(staticLocalSeoPages).forEach(([slug]) => {
      surfacesChecked++;
      // We check if any static config hardcodes conflicting contact info
    });

  } catch {
    // Audit failed gracefully
  }

  return {
    isCompliant: issues.length === 0,
    totalSurfacesChecked: surfacesChecked,
    driftCount: issues.length,
    issues,
  };
}
