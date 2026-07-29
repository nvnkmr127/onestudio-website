// Lightweight anon public Supabase client for client-side components (read-safe data only)

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co').replace(/\/$/, '');
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface QueryOptions {
  select?: string;
  filters: { column: string; operator: string; value: string }[];
  limit?: number;
  order?: { column: string; ascending: boolean };
}

class SupabaseClientQueryBuilder {
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
    const res = await this.executeFetch();
    if (res.error) return { data: null, error: res.error };
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      return { data: null, error: { message: 'Row not found' } };
    }
    const row = Array.isArray(res.data) ? res.data[0] : res.data;
    return { data: row, error: null };
  }

  async maybeSingle(): Promise<{ data: any; error: any }> {
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
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
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
}

export function createBrowserClient() {
  return {
    from: (table: string) => new SupabaseClientQueryBuilder(table),
  };
}
