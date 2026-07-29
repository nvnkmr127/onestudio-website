'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { ActionResult, RobotsRule } from '@/lib/types';

const ruleSchema = z.object({
  user_agent: z.string().min(1, 'User agent is required'),
  rule_type: z.enum(['allow', 'disallow']),
  path: z.string().min(1, 'Path is required'),
  sort_order: z.coerce.number().default(0),
});

export const AI_CRAWLERS = [
  { name: 'GPTBot', label: 'OpenAI (GPTBot / ChatGPT)' },
  { name: 'ClaudeBot', label: 'Anthropic (ClaudeBot)' },
  { name: 'Google-Extended', label: 'Google Gemini / Vertex AI' },
  { name: 'PerplexityBot', label: 'Perplexity Search' },
  { name: 'CCBot', label: 'Common Crawl (CCBot)' },
];

export async function listRobotsRules(): Promise<ActionResult<RobotsRule[]>> {
  try {
    const sb = createClient();
    const { data, error } = await sb.from('robots_rules').select('*').order('sort_order', { ascending: true });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data || data.length === 0) {
      // Seed default rules if empty
      await seedDefaultRules();
      const { data: seeded } = await sb.from('robots_rules').select('*').order('sort_order', { ascending: true });
      return { ok: true, data: seeded || [] };
    }

    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to list robots rules' };
  }
}

export async function addRule(input: unknown): Promise<ActionResult<RobotsRule>> {
  try {
    const parseResult = ruleSchema.safeParse(input);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { ok: false, error: errorMsg };
    }

    const ruleData = parseResult.data;
    const sb = createClient();
    const { data, error } = await sb.from('robots_rules').insert(ruleData);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/robots.txt');
    return { ok: true, data: data?.[0] || ruleData };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to add rule' };
  }
}

export async function deleteRule(id: string): Promise<ActionResult<boolean>> {
  try {
    const sb = createClient();
    const { error } = await sb.from('robots_rules').eq('id', id).delete();

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/robots.txt');
    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to delete rule' };
  }
}

export async function toggleAiCrawler(userAgent: string, block: boolean): Promise<ActionResult<boolean>> {
  try {
    const sb = createClient();

    // First delete any existing rules for this specific AI user agent
    await sb.from('robots_rules').eq('user_agent', userAgent).delete();

    if (block) {
      // Add Disallow: / rule for AI crawler
      await sb.from('robots_rules').insert({
        user_agent: userAgent,
        rule_type: 'disallow',
        path: '/',
        sort_order: 10,
      });
    } else {
      // Add Allow: / rule for AI crawler
      await sb.from('robots_rules').insert({
        user_agent: userAgent,
        rule_type: 'allow',
        path: '/',
        sort_order: 10,
      });
    }

    revalidatePath('/robots.txt');
    return { ok: true, data: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to toggle AI crawler rule' };
  }
}

export async function seedDefaultRules(): Promise<void> {
  try {
    const sb = createClient();
    const defaults = [
      { user_agent: '*', rule_type: 'disallow', path: '/admin', sort_order: 1 },
      { user_agent: '*', rule_type: 'disallow', path: '/api', sort_order: 2 },
      { user_agent: '*', rule_type: 'disallow', path: '/*?*', sort_order: 3 },
      { user_agent: '*', rule_type: 'allow', path: '/', sort_order: 4 },
    ];

    for (const d of defaults) {
      await sb.from('robots_rules').insert(d);
    }
    revalidatePath('/robots.txt');
  } catch (_) {
    // Ignore seed errors
  }
}
