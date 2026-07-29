import crypto from 'node:crypto';

export interface GoogleServiceAccount {
  client_email: string;
  private_key: string;
  project_id?: string;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Mint a Google Service Account OAuth2 Access Token using RSA-SHA256 JWT assertion.
 */
export async function getGoogleServiceAccountToken(
  scopes: string[] = [
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/analytics.readonly',
  ]
): Promise<{ token: string | null; error?: string }> {
  try {
    const rawJson = process.env.GSC_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!rawJson) {
      return { token: null, error: 'GSC_SERVICE_ACCOUNT_JSON environment variable is not configured.' };
    }

    let sa: GoogleServiceAccount;
    try {
      sa = JSON.parse(rawJson);
    } catch {
      return { token: null, error: 'Invalid JSON format in GSC_SERVICE_ACCOUNT_JSON.' };
    }

    if (!sa.client_email || !sa.private_key) {
      return { token: null, error: 'Service account JSON missing client_email or private_key.' };
    }

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: sa.client_email,
      scope: scopes.join(' '),
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
    const unsignedJwt = `${encodedHeader}.${encodedClaimSet}`;

    // Sign using RSA-SHA256
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(unsignedJwt);
    const signature = signer.sign(sa.private_key, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const signedJwt = `${unsignedJwt}.${signature}`;

    // Exchange JWT for Access Token
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: signedJwt,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { token: null, error: `Token exchange failed: ${errText}` };
    }

    const data = await res.json();
    return { token: data.access_token || null };
  } catch (err: any) {
    return { token: null, error: err?.message || 'Failed to authenticate Google Service Account' };
  }
}
