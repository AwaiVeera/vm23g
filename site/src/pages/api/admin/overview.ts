import type { APIRoute } from 'astro';
import { db, json } from '@/lib/runtime';

export const prerender = false;

export const GET: APIRoute = async () => {
  const row = await db()
    .prepare('SELECT id, name FROM enquiries ORDER BY created_at DESC LIMIT 1')
    .first<{ id: string; name: string }>();
  return json({ latestId: row?.id ?? null, latestName: row?.name ?? null });
};
