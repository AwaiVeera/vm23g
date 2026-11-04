import type { APIRoute } from 'astro';
import { chatStream, type ChatTurn } from '@/lib/ai';
import { getContent } from '@/lib/content';
import { buildFacts, fallbackAnswer, systemPrompt } from '@/lib/knowledge';
import { bindings, clean, ipHash, json, now, sameOrigin, uid } from '@/lib/runtime';

export const prerender = false;

const MAX_PER_WINDOW = 30;
const WINDOW_MS = 10 * 60 * 1000;

export const POST: APIRoute = async ({ request, locals }) => {
  if (!sameOrigin(request)) return json({ error: 'Forbidden' }, { status: 403 });

  let body: { chatId?: unknown; message?: unknown; page?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, { status: 400 });
  }

  const message = clean(body.message, 800);
  if (!message) return json({ error: 'Message required' }, { status: 400 });
  const page = clean(body.page, 120) || '/';
  let chatId = typeof body.chatId === 'string' && /^chat_[a-z0-9]{20}$/.test(body.chatId) ? body.chatId : '';

  const content = await getContent();
  const db = bindings.DB;
  const ip = await ipHash(request);
  let history: ChatTurn[] = [];

  if (db) {
    const recent = await db
      .prepare('SELECT COALESCE(SUM(message_count), 0) AS n FROM chats WHERE ip_hash = ? AND updated_at > ?')
      .bind(ip, now() - WINDOW_MS)
      .first<{ n: number }>();
    if ((recent?.n ?? 0) >= MAX_PER_WINDOW) {
      return json({ error: 'You have sent a lot of messages. Please try again in a few minutes, or use Start a Project.' }, { status: 429 });
    }

    if (chatId) {
      const exists = await db.prepare('SELECT id FROM chats WHERE id = ?').bind(chatId).first();
      if (!exists) chatId = '';
    }
    if (!chatId) {
      chatId = uid('chat');
      await db
        .prepare('INSERT INTO chats (id, created_at, updated_at, page, ip_hash, message_count) VALUES (?, ?, ?, ?, ?, 0)')
        .bind(chatId, now(), now(), page, ip)
        .run();
    } else {
      const { results } = await db
        .prepare('SELECT role, content FROM chat_messages WHERE chat_id = ? ORDER BY id DESC LIMIT 10')
        .bind(chatId)
        .all<{ role: 'user' | 'assistant'; content: string }>();
      history = results.reverse().map((r) => ({ role: r.role, content: r.content }));
    }
    await db
      .prepare('INSERT INTO chat_messages (chat_id, role, content, created_at) VALUES (?, ?, ?, ?)')
      .bind(chatId, 'user', message, now())
      .run();
  } else if (!chatId) {
    chatId = uid('chat');
  }

  const messages: ChatTurn[] = [
    { role: 'system', content: systemPrompt(buildFacts(content)) },
    ...history,
    { role: 'user', content: message },
  ];

  const fallback = fallbackAnswer(message, content);
  const stream = await chatStream(messages, fallback, (full) => {
    if (!db) return;
    const save = db
      .batch([
        db.prepare('INSERT INTO chat_messages (chat_id, role, content, created_at) VALUES (?, ?, ?, ?)').bind(chatId, 'assistant', full, now()),
        db.prepare('UPDATE chats SET updated_at = ?, message_count = message_count + 1 WHERE id = ?').bind(now(), chatId),
      ])
      .catch(() => undefined);
    locals.cfContext?.waitUntil(save);
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      'x-chat-id': chatId,
    },
  });
};
