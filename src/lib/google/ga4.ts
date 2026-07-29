import { getGoogleServiceAccountToken } from './auth';

export interface Ga4OrganicData {
  sessions: number;
  activeUsers: number;
  conversions: number;
}

/**
 * Fetch organic search sessions & conversion metrics from GA4 Data API.
 */
export async function fetchGa4OrganicPerformance(params: {
  propertyId?: string;
  startDate: string;
  endDate: string;
}): Promise<{ data: Ga4OrganicData | null; error?: string }> {
  const propertyId = params.propertyId || process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    return { data: null, error: 'GA4_PROPERTY_ID environment variable is not configured.' };
  }

  const { token, error } = await getGoogleServiceAccountToken();
  if (!token) return { data: null, error: error || 'Service account not configured' };

  try {
    const cleanPropId = propertyId.replace(/^properties\//, '');
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${cleanPropId}:runReport`;

    const body = {
      dateRanges: [{ startDate: params.startDate, endDate: params.endDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'activeUsers' },
        { name: 'conversions' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionMedium',
          stringFilter: {
            matchType: 'EXACT',
            value: 'organic',
          },
        },
      },
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
      return { data: null, error: `GA4 Data API Error (${res.status}): ${errText}` };
    }

    const json = await res.json();
    const firstRow = json.rows?.[0];

    if (!firstRow || !firstRow.metricValues) {
      return {
        data: { sessions: 0, activeUsers: 0, conversions: 0 },
      };
    }

    const sessions = parseInt(firstRow.metricValues[0]?.value || '0', 10);
    const activeUsers = parseInt(firstRow.metricValues[1]?.value || '0', 10);
    const conversions = parseInt(firstRow.metricValues[2]?.value || '0', 10);

    return {
      data: { sessions, activeUsers, conversions },
    };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to query GA4 Data API' };
  }
}
