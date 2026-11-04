import { enquiryInsight, transcribe, type EnquiryLike } from './ai';
import { bindings, db, now } from './runtime';

export type EnquiryRow = {
  id: string;
  created_at: number;
  updated_at: number;
  status: string;
  source: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  pillars: string;
  stage: string | null;
  timeline: string | null;
  budget: string | null;
  message: string | null;
  voice_key: string | null;
  voice_mime: string | null;
  transcript: string | null;
  chat_id: string | null;
  ai_summary: string | null;
  ai_score: number | null;
  ai_tags: string | null;
  reply_draft: string | null;
  notes: string | null;
  consent: number;
};

export async function chatTranscript(chatId: string | null) {
  if (!chatId) return null;
  const { results } = await db()
    .prepare('SELECT role, content FROM chat_messages WHERE chat_id = ? ORDER BY id ASC LIMIT 40')
    .bind(chatId)
    .all<{ role: string; content: string }>();
  if (!results.length) return null;
  return results.map((m) => `${m.role === 'user' ? 'Visitor' : 'V'}: ${m.content}`).join('\n');
}

export function toLike(row: EnquiryRow, chat?: string | null): EnquiryLike {
  let pillars: string[] = [];
  try {
    pillars = JSON.parse(row.pillars);
  } catch {}
  return {
    name: row.name,
    company: row.company,
    pillars,
    stage: row.stage,
    timeline: row.timeline,
    budget: row.budget,
    message: row.message,
    transcript: row.transcript,
    chat: chat ?? null,
  };
}

export async function enrichEnquiry(id: string) {
  const row = await db().prepare('SELECT * FROM enquiries WHERE id = ?').bind(id).first<EnquiryRow>();
  if (!row) return;
  let transcript = row.transcript;
  if (!transcript && row.voice_key && bindings.MEDIA) {
    const obj = await bindings.MEDIA.get(row.voice_key);
    if (obj) transcript = await transcribe(await obj.arrayBuffer());
  }
  const chat = await chatTranscript(row.chat_id);
  const insight = await enquiryInsight(toLike({ ...row, transcript }, chat));
  await db()
    .prepare('UPDATE enquiries SET transcript = ?, ai_summary = ?, ai_score = ?, ai_tags = ?, updated_at = ? WHERE id = ?')
    .bind(transcript, insight.summary, insight.score, JSON.stringify(insight.tags), now(), id)
    .run();
  await notify(row, insight.summary);
}

async function notify(row: EnquiryRow, summary: string) {
  const hook = bindings.NOTIFY_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: `New VM23G enquiry from ${row.name}: ${summary}`,
        id: row.id,
        source: row.source,
      }),
    });
  } catch {}
}
