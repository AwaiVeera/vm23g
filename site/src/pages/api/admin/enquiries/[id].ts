import type { APIRoute } from 'astro';
import { audit } from '@/lib/auth';
import { STATUSES } from '@/lib/admin-data';
import { clean, db, json, now, sameOrigin } from '@/lib/runtime';

export const prerender = false;

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  if (!sameOrigin(request)) return json({ error: 'Forbidden' }, { status: 403 });
  const id = params.id ?? '';
  const body = (await request.json().catch(() => ({}))) as { status?: unknown; notes?: unknown; reply_draft?: unknown };
  const sets: string[] = [];
  const values: unknown[] = [];
  if (typeof body.status === 'string') {
    if (!STATUSES.some((s) => s.key === body.status)) return json({ error: 'Unknown status' }, { status: 400 });
    sets.push('status = ?');
    values.push(body.status);
  }
  if (typeof body.notes === 'string') {
    sets.push('notes = ?');
    values.push(clean(body.notes, 8000));
  }
  if (typeof body.reply_draft === 'string') {
    sets.push('reply_draft = ?');
    values.push(clean(body.reply_draft, 8000));
  }
  if (!sets.length) return json({ error: 'Nothing to update' }, { status: 400 });
  sets.push('updated_at = ?');
  values.push(now(), id);
  const res = await db().prepare(`UPDATE enquiries SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
  if (!res.meta.changes) return json({ error: 'Not found' }, { status: 404 });
  await audit(locals.admin ?? 'admin', 'enquiry.update', `${id} ${Object.keys(body).join(',')}`);
  return json({ ok: true });
};
