import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, value, id, path } = body || {};

    if (!name || value === undefined) {
      return NextResponse.json({ ok: false, error: 'Invalid vital metric payload' }, { status: 400 });
    }

    const sb = createClient();
    const targetPath = path || '/';
    const roundedVal = Math.round(Number(value) * 100) / 100;

    const payload = {
      path: `CWV:${targetPath}`,
      score: name === 'CLS' ? (value <= 0.1 ? 100 : 50) : (value <= 2500 ? 100 : 50),
      issues: [
        {
          severity: value > 2500 || (name === 'CLS' && value > 0.25) ? 'warning' : 'info',
          code: `CWV_${name}`,
          message: `${name} reported ${roundedVal} on ${targetPath}`,
        },
      ],
      snapshot: {
        metric: name,
        value: roundedVal,
        metricId: id,
        path: targetPath,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    };

    await sb.from('seo_audits').insert(payload);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to record vitals' }, { status: 500 });
  }
}
