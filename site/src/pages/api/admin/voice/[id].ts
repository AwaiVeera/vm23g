import type { APIRoute } from 'astro';
import { bindings, db } from '@/lib/runtime';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const row = await db()
    .prepare('SELECT voice_key, voice_mime FROM enquiries WHERE id = ?')
    .bind(params.id ?? '')
    .first<{ voice_key: string | null; voice_mime: string | null }>();
  if (!row?.voice_key || !bindings.MEDIA) return new Response('Not found', { status: 404 });
  const obj = await bindings.MEDIA.get(row.voice_key);
  if (!obj) return new Response('Not found', { status: 404 });
  return new Response(obj.body as unknown as ReadableStream, {
    headers: {
      'content-type': row.voice_mime ?? 'audio/webm',
      'cache-control': 'private, no-store',
      'content-length': String(obj.size),
    },
  });
};
