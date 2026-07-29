import { createClient } from '@/lib/supabase/server';
import type { SeoSettings, SchemaBlock } from '@/lib/types';
import { buildGlobalSchemas } from '@/lib/seo/build-schema';

/**
 * Resolve all JSON-LD schemas (global + page-attached) for a specific route (Server side).
 */
export async function getSchemasForPath(path: string): Promise<Record<string, any>[]> {
  try {
    const sb = createClient();
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    const [{ data: globalBlocks }, { data: pageMeta }, { data: settings }] = await Promise.all([
      sb.from('schema_blocks').select('*').eq('is_global', true),
      sb.from('seo_meta').select('schema_ids').eq('path', normalizedPath).maybeSingle(),
      sb.from('seo_settings').select('*').eq('id', 1).maybeSingle(),
    ]);

    const schemas: Record<string, any>[] = [];

    if (globalBlocks && globalBlocks.length > 0) {
      globalBlocks.forEach((b: SchemaBlock) => schemas.push(b.json_ld));
    } else if (settings) {
      const { organization, localBusiness } = buildGlobalSchemas(settings as SeoSettings);
      schemas.push(organization, localBusiness);
    }

    const schemaIds: string[] = pageMeta?.schema_ids || [];
    if (schemaIds.length > 0) {
      const { data: pageBlocks } = await sb.from('schema_blocks').select('*');
      if (pageBlocks) {
        pageBlocks.forEach((b: SchemaBlock) => {
          if (b.id && schemaIds.includes(b.id) && !b.is_global) {
            schemas.push(b.json_ld);
          }
        });
      }
    }

    return schemas;
  } catch {
    return [];
  }
}
