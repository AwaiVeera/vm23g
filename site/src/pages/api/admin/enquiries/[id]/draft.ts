import type { APIRoute } from 'astro';
import { draftReply } from '@/lib/ai';
import { chatTranscript, toLike, type EnquiryRow } from '@/lib/enquiries';
import { db, json, now, sameOrigin } from '@/lib/runtime';

export const prerender = false;

const signers: Record<string, string> = { summan: 'Summan Misir Veera', awaiveera: 'Tinesh Awai Veera' };

export const POST: APIRoute = async ({ request, params, locals }) => {
  if (!sameOrigin(request)) return json({ error: 'Forbidden' }, { status: 403 });
  const row = await db().prepare('SELECT * FROM enquiries WHERE id = ?').bind(params.id ?? '').first<EnquiryRow>();
  if (!row) return json({ error: 'Not found' }, { status: 404 });
  const signer = signers[(locals.admin ?? '').split('@')[0]] ?? 'The VM23G team';
  const draft = await draftReply(toLike(row, await chatTranscript(row.chat_id)), signer);
  await db().prepare('UPDATE enquiries SET reply_draft = ?, updated_at = ? WHERE id = ?').bind(draft, now(), row.id).run();
  return json({ draft });
};
