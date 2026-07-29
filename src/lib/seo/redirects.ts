import { createClient } from '@/lib/supabase/server';
import type { Redirect } from '@/lib/types';

let cachedRedirects: Redirect[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute TTL fallback

/**
 * Fetch active redirects from database or in-memory cache.
 */
export async function getActiveRedirects(): Promise<Redirect[]> {
  const now = Date.now();
  if (cachedRedirects && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedRedirects;
  }

  try {
    const sb = createClient();
    const { data } = await sb.from('redirects').select('*').eq('active', true);
    cachedRedirects = (data as Redirect[]) || [];
    cacheTimestamp = now;
    return cachedRedirects;
  } catch {
    return cachedRedirects || [];
  }
}

/**
 * Clear the in-memory redirects cache (called after any mutation).
 */
export function clearRedirectsCache(): void {
  cachedRedirects = null;
  cacheTimestamp = 0;
}

/**
 * Match a request pathname against active exact and regex redirects.
 */
export function matchRedirect(
  pathname: string,
  redirects: Redirect[]
): { destination: string; status_code: number; id?: string } | null {
  if (!pathname || !redirects || redirects.length === 0) return null;

  // Normalize path (ensure leading slash, strip trailing slash unless root)
  const normPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  // 1. Exact match pass
  for (const r of redirects) {
    if (!r.is_regex && r.active) {
      const srcNorm = r.source === '/' ? '/' : r.source.replace(/\/$/, '');
      if (srcNorm === normPath || r.source === pathname) {
        return {
          destination: r.destination,
          status_code: r.status_code || 301,
          id: r.id,
        };
      }
    }
  }

  // 2. Regex match pass
  for (const r of redirects) {
    if (r.is_regex && r.active) {
      try {
        const re = new RegExp(r.source);
        if (re.test(pathname) || re.test(normPath)) {
          const dest = pathname.replace(re, r.destination);
          return {
            destination: dest,
            status_code: r.status_code || 301,
            id: r.id,
          };
        }
      } catch {
        // Ignore invalid regex patterns in database gracefully
      }
    }
  }

  return null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  isLoop?: boolean;
  isChain?: boolean;
}

/**
 * Validate that adding or editing a redirect won't create a redirect chain or loop.
 */
export function detectRedirectChainOrLoop(
  source: string,
  destination: string,
  existingRedirects: Redirect[],
  currentId?: string
): ValidationResult {
  const normSource = source.trim().replace(/\/$/, '') || '/';
  const normDest = destination.trim().replace(/\/$/, '') || '/';

  if (normSource === normDest) {
    return {
      isValid: false,
      isLoop: true,
      error: `Redirect loop detected: "${source}" cannot redirect to itself.`,
    };
  }

  // Filter out the redirect currently being updated if currentId is provided
  const activeList = existingRedirects.filter((r) => !currentId || r.id !== currentId);

  // Check 1: Does destination redirect to something else? (Chain or Loop)
  let currentTarget = normDest;
  const visited = new Set<string>([normSource]);
  let hops = 0;

  while (currentTarget && hops < 10) {
    if (visited.has(currentTarget)) {
      return {
        isValid: false,
        isLoop: true,
        error: `Redirect loop detected: "${source}" -> "${destination}" forms a circular loop.`,
      };
    }

    visited.add(currentTarget);

    const nextHop = activeList.find((r) => {
      const rSrc = r.source.trim().replace(/\/$/, '') || '/';
      if (!r.is_regex) return rSrc === currentTarget;
      try {
        return new RegExp(r.source).test(currentTarget);
      } catch {
        return false;
      }
    });

    if (nextHop) {
      const nextDest = nextHop.destination.trim().replace(/\/$/, '') || '/';
      if (visited.has(nextDest) || nextDest === normSource) {
        return {
          isValid: false,
          isLoop: true,
          error: `Redirect loop detected: "${source}" -> "${destination}" -> "${nextHop.destination}" forms a circular loop.`,
        };
      }

      return {
        isValid: false,
        isChain: true,
        error: `Redirect chain detected: "${source}" -> "${destination}" -> "${nextHop.destination}". Please point "${source}" directly to "${nextHop.destination}".`,
      };
    }

    break;
  }

  // Check 2: Does an existing redirect point to source? (Incoming Chain)
  const incomingHop = activeList.find((r) => {
    const rDest = r.destination.trim().replace(/\/$/, '') || '/';
    return rDest === normSource;
  });

  if (incomingHop) {
    return {
      isValid: false,
      isChain: true,
      error: `Redirect chain detected: Existing redirect "${incomingHop.source}" -> "${normSource}" will now chain to "${destination}". Update "${incomingHop.source}" directly to "${destination}".`,
    };
  }

  return { isValid: true };
}
