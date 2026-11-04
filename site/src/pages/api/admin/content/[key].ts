import type { APIRoute } from 'astro';
import { audit } from '@/lib/auth';
import { contentKeys, invalidateContent, sanitize, type SiteContent } from '@/lib/content';
import { db, json, now, sameOrigin } from '@/lib/runtime';

export const prerender = false;

const isKey = (k: string): k is keyof SiteContent => (contentKeys as string[]).includes(k);

export const PUT: APIRoute = async ({ request, params, locals }) => {
  if (!sameOrigin(request)) return json({ error: 'Forbidden' }, { status: 403 });
  const key = params.key ?? '';
  if (!isKey(key)) return json({ error: 'Unknown section' }, { status: 404 });
  const body = await request.json().catch(() => null);
  if (body === null) return json({ error: 'Invalid content' }, { status: 400 });
  const value = sanitize(key, body);
  const actor = locals.admin ?? 'admin';
  const ts = now();
  const serialized = JSON.stringify(value);
  await db().batch([
    db()
      .prepare(
        'INSERT INTO content_blocks (key, value, updated_at, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by',
      )
      .bind(key, serialized, ts, actor),
    db().prepare('INSERT INTO content_history (key, value, saved_at, saved_by) VALUES (?, ?, ?, ?)').bind(key, serialized, ts, actor),
  ]);
  invalidateContent();
  await audit(actor, 'content.publish', key);
  return json({ ok: true, value });
};

export const DELETE: APIRoute = async ({ request, params, locals }) => {
  if (!sameOrigin(request)) return json({ error: 'Forbidden' }, { status: 403 });
  const key = params.key ?? '';
  if (!isKey(key)) return json({ error: 'Unknown section' }, { status: 404 });
  await db().prepare('DELETE FROM content_blocks WHERE key = ?').bind(key).run();
  invalidateContent();
  await audit(locals.admin ?? 'admin', 'content.reset', key);
  return json({ ok: true });
};
