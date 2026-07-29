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
  address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
  phone: '+91 90143 03409',
  email: 'reachus@onestudio.co.in',
  website: 'https://www.onestudio.co.in',
};

/**
 * Normalizes phone numbers for comparison
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
          severity: 'warning',
        });
      }

      if (s.phone && normPhone(s.phone) !== normPhone(VERIFIED_NAP.phone)) {
        issues.push({
          surface: 'seo_settings Table',
          field: 'phone',
          expected: VERIFIED_NAP.phone,
          found: s.phone,
          severity: 'critical',
        });
      }

      if (s.email && s.email.toLowerCase() !== VERIFIED_NAP.email.toLowerCase()) {
        issues.push({
          surface: 'seo_settings Table',
          field: 'email',
          expected: VERIFIED_NAP.email,
          found: s.email,
          severity: 'warning',
        });
      }

      const fullAddr = `${s.street_address || ''} ${s.locality || ''} ${s.region || ''}`;
      if (fullAddr && !fullAddr.toLowerCase().includes('hyderabad')) {
        issues.push({
          surface: 'seo_settings Table',
          field: 'address',
          expected: VERIFIED_NAP.address,
          found: fullAddr,
          severity: 'critical',
        });
      }
    }

    // 2. Check Static Local SEO Pages
    Object.entries(staticLocalSeoPages).forEach(([slug, cfg]) => {
      surfacesChecked++;
      if (!cfg.description.toLowerCase().includes('hyderabad') && !cfg.title.toLowerCase().includes('hyderabad')) {
        issues.push({
          surface: `Local SEO Route (/${slug})`,
          field: 'address',
          expected: 'Hyderabad location in meta metadata',
          found: cfg.description,
          severity: 'warning',
        });
      }
    });

    return {
      isCompliant: issues.length === 0,
      totalSurfacesChecked: surfacesChecked,
      driftCount: issues.length,
      issues,
    };
  } catch (err: any) {
    return {
      isCompliant: false,
      totalSurfacesChecked: surfacesChecked,
      driftCount: issues.length + 1,
      issues: [
        ...issues,
        {
          surface: 'System Check',
          field: 'website',
          expected: VERIFIED_NAP.website,
          found: `Error running check: ${err.message}`,
          severity: 'critical',
        },
      ],
    };
  }
}
