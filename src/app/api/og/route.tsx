import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'One Studio — Luxury Home Interiors';
    const category = searchParams.get('category') || 'HBR Layout 5th Block, Bengaluru';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#090d16',
            padding: '60px 80px',
            color: '#ffffff',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header Brand Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#f2bd19',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '24px',
                  color: '#090d16',
                }}
              >
                S
              </div>
              <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>ONE STUDIO</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(242, 189, 25, 0.15)',
                border: '1px solid rgba(242, 189, 25, 0.4)',
                borderRadius: '50px',
                padding: '6px 20px',
                color: '#f2bd19',
                fontSize: '14px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              📍 {category}
            </div>
          </div>

          {/* Main Title Banner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontSize: '52px',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#ffffff',
                maxHeight: '220px',
                overflow: 'hidden',
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: '20px', color: '#94a3b8', fontWeight: 500 }}>
              Turnkey House Construction &amp; Luxury Interior Design Specialists
            </div>
          </div>

          {/* Footer Verified NAP */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '24px',
              fontSize: '16px',
              color: '#cbd5e1',
            }}
          >
            <div style={{ display: 'flex', gap: '24px' }}>
              <span>📞 +91 90143 03409</span>
              <span>✉️ reachus@onestudio.in</span>
            </div>
            <span style={{ color: '#f2bd19', fontWeight: 700 }}>https://www.onestudio.in</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err: any) {
    return new Response(`Failed to generate OG image: ${err?.message}`, { status: 500 });
  }
}
