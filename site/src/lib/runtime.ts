import { env } from 'cloudflare:workers';

type Bindings = {
  DB?: D1Database;
  MEDIA?: R2Bucket;
  AI?: Ai;
  AI_MODEL?: string;
  TRANSCRIBE_MODEL?: string;
  ADMIN_EMAILS?: string;
  ADMIN_PASSWORD_HASH?: string;
  SESSION_SECRET?: string;
  NOTIFY_WEBHOOK_URL?: string;
};

export const bindings = env as unknown as Bindings;

export const db = () => {
  if (!bindings.DB) throw new Error('Database binding missing');
  return bindings.DB;
};

export const now = () => Date.now();

export const uid = (prefix: string) => `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`;

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function ipHash(request: Request) {
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'local';
  return (await sha256(`${ip}|${bindings.SESSION_SECRET ?? 'vm23g'}`)).slice(0, 32);
}

export const json = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...(init.headers ?? {}) },
  });

export const clean = (value: unknown, max = 2000) =>
  typeof value === 'string' ? value.replace(/\u0000/g, '').trim().slice(0, max) : '';

export const isEmail = (v: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(v);

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
