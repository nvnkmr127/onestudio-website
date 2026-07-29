// Lightweight, zero-dependency Supabase client for Server Actions, Middleware, and Server Components
// Uses the Service Role Key for administrative DB access. NEVER import this file in browser client components.

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co').replace(/\/$/, '');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface QueryOptions {
  select?: string;
  filters: { column: string; operator: string; value: string }[];
  limit?: number;
  order?: { column: string; ascending: boolean };
  single?: boolean;
  maybeSingle?: boolean;
}

class SupabaseQueryBuilder {
  private table: string;
  private options: QueryOptions = { filters: [] };

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    this.options.select = columns;
    return this;
  }

  eq(column: string, value: any) {
    this.options.filters.push({ column, operator: 'eq', value: String(value) });
    return this;
  }

  order(column: string, { ascending = true }: { ascending?: boolean } = {}) {
    this.options.order = { column, ascending };
    return this;
  }

  limit(count: number) {
    this.options.limit = count;
    return this;
  }

  async single(): Promise<{ data: any; error: any }> {
    this.options.single = true;
    const res = await this.executeFetch();
    if (res.error) return { data: null, error: res.error };
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      return { data: null, error: { message: 'Row not found' } };
    }
    const row = Array.isArray(res.data) ? res.data[0] : res.data;
    return { data: row, error: null };
  }

  async maybeSingle(): Promise<{ data: any; error: any }> {
    this.options.maybeSingle = true;
    const res = await this.executeFetch();
    if (res.error) return { data: null, error: res.error };
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      return { data: null, error: null };
    }
    const row = Array.isArray(res.data) ? res.data[0] : res.data;
    return { data: row, error: null };
  }

  async then(onfulfilled?: (value: { data: any; error: any }) => any) {
    const result = await this.executeFetch();
    return onfulfilled ? onfulfilled(result) : result;
  }

  private async executeFetch(): Promise<{ data: any; error: any }> {
    if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder')) {
      return { data: null, error: null };
    }

    try {
      const params = new URLSearchParams();
      if (this.options.select) params.append('select', this.options.select);
      for (const f of this.options.filters) {
        params.append(f.column, `${f.operator}.${f.value}`);
      }
      if (this.options.order) {
        params.append('order', `${this.options.order.column}.${this.options.order.ascending ? 'asc' : 'desc'}`);
      }
      if (this.options.limit) {
        params.append('limit', String(this.options.limit));
      }

      const url = `${SUPABASE_URL}/rest/v1/${this.table}?${params.toString()}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const errText = await res.text();
        return { data: null, error: { message: errText } };
      }

      const data = await res.json();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err?.message || 'Network error' } };
    }
  }

  async upsert(values: any | any[]): Promise<{ data: any; error: any }> {
    return this.writeOperation('POST', values, { 'Prefer': 'resolution=merge-duplicates,return=representation' });
  }

  async insert(values: any | any[]): Promise<{ data: any; error: any }> {
    return this.writeOperation('POST', values, { 'Prefer': 'return=representation' });
  }

  async update(values: any): Promise<{ data: any; error: any }> {
    return this.writeOperation('PATCH', values, { 'Prefer': 'return=representation' });
  }

  async delete(): Promise<{ data: any; error: any }> {
    return this.writeOperation('DELETE', undefined, {});
  }

  private async writeOperation(method: string, body?: any, extraHeaders: Record<string, string> = {}): Promise<{ data: any; error: any }> {
    if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder')) {
      return { data: body, error: null };
    }

    try {
      const params = new URLSearchParams();
      for (const f of this.options.filters) {
        params.append(f.column, `${f.operator}.${f.value}`);
      }
      const url = `${SUPABASE_URL}/rest/v1/${this.table}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const headers: Record<string, string> = {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        ...extraHeaders,
      };

      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const errText = await res.text();
        return { data: null, error: { message: errText } };
      }

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        return { data, error: null };
      }

      return { data: true, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err?.message || 'Write error' } };
    }
  }
}

export function createClient() {
  return {
    from: (table: string) => new SupabaseQueryBuilder(table),
  };
}
