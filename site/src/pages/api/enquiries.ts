import type { APIRoute } from 'astro';
import { enrichEnquiry } from '@/lib/enquiries';
import { bindings, clean, ipHash, isEmail, json, now, sameOrigin, uid } from '@/lib/runtime';

export const prerender = false;

const PILLARS = ['Mind', 'Body', 'Brand', 'Technology'];
const MAX_VOICE = 6 * 1024 * 1024;
const VOICE_TYPES = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/aac'];

export const POST: APIRoute = async ({ request, locals }) => {
  if (!sameOrigin(request)) return json({ error: 'Forbidden' }, { status: 403 });
  const db = bindings.DB;
  if (!db) return json({ error: 'Enquiries are temporarily unavailable. Please try again shortly.' }, { status: 503 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Invalid submission' }, { status: 400 });
  }

  if (clean(form.get('website'))) return json({ ok: true, id: 'ok' });
  const startedAt = Number(form.get('started_at'));
  if (Number.isFinite(startedAt) && now() - startedAt < 2500) return json({ error: 'Please take a moment to review your brief.' }, { status: 400 });

  const ip = await ipHash(request);
  const burst = await db
    .prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'enquiry' AND actor = ? AND at > ?")
    .bind(ip, now() - 60 * 60 * 1000)
    .first<{ n: number }>();
  if ((burst?.n ?? 0) >= 6) return json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });

  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 200).toLowerCase();
  const source = clean(form.get('source')) === 'concierge' ? 'concierge' : 'start';
  const consent = form.get('consent') === 'yes';

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Please tell us your name.';
  if (!isEmail(email)) errors.email = 'Please enter a valid email address.';
  if (!consent) errors.consent = 'Please confirm we may contact you about your enquiry.';

  const pillars = form
    .getAll('pillars')
    .map((p) => clean(p, 20))
    .filter((p) => PILLARS.includes(p));

  const message = clean(form.get('message'), 4000);
  const voice = form.get('voice');
  const hasVoice = voice instanceof File && voice.size > 0;
  if (source === 'start' && !message && !hasVoice) errors.message = 'Add a few words or a voice note about your project.';

  if (hasVoice) {
    const type = (voice as File).type.split(';')[0];
    if ((voice as File).size > MAX_VOICE) errors.voice = 'Voice notes can be up to 6 MB (about 3 minutes).';
    else if (type && !VOICE_TYPES.includes(type)) errors.voice = 'That audio format is not supported.';
  }

  if (Object.keys(errors).length) return json({ error: 'Please check the highlighted fields.', fields: errors }, { status: 422 });

  const chatIdRaw = clean(form.get('chat_id'), 40);
  const chatId = /^chat_[a-z0-9]{20}$/.test(chatIdRaw) ? chatIdRaw : null;

  const id = uid('enq');
  let voiceKey: string | null = null;
  let voiceMime: string | null = null;
  if (hasVoice && bindings.MEDIA) {
    const file = voice as File;
    voiceMime = file.type.split(';')[0] || 'audio/webm';
    voiceKey = `voice/${id}`;
    await bindings.MEDIA.put(voiceKey, await file.arrayBuffer(), { httpMetadata: { contentType: voiceMime } });
  }

  const ts = now();
  await db
    .prepare(
      `INSERT INTO enquiries (id, created_at, updated_at, status, source, name, email, phone, company, pillars, stage, timeline, budget, message, voice_key, voice_mime, chat_id, consent)
       VALUES (?, ?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      ts,
      ts,
      source,
      name,
      email,
      clean(form.get('phone'), 40) || null,
      clean(form.get('company'), 160) || null,
      JSON.stringify(pillars),
      clean(form.get('stage'), 80) || null,
      clean(form.get('timeline'), 80) || null,
      clean(form.get('budget'), 80) || null,
      message || null,
      voiceKey,
      voiceMime,
      chatId,
      consent ? 1 : 0,
    )
    .run();

  await db.batch([
    db.prepare("INSERT INTO audit_log (at, actor, action, detail) VALUES (?, ?, 'enquiry', ?)").bind(ts, ip, id),
    ...(chatId ? [db.prepare('UPDATE chats SET enquiry_id = ? WHERE id = ?').bind(id, chatId)] : []),
  ]);

  const work = enrichEnquiry(id).catch(() => undefined);
  if (locals.cfContext) locals.cfContext.waitUntil(work);
  else await work;

  return json({ ok: true, id });
};
