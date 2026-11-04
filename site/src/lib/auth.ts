import type { AstroCookies } from 'astro';
import { bindings, db, ipHash, now } from './runtime';

export const COOKIE = 'vm23g_admin';
const SESSION_TTL = 1000 * 60 * 60 * 12;
const enc = new TextEncoder();

const b64 = (bytes: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const b64url = (bytes: ArrayBuffer) => b64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(password: string, iterations = 100000) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return `pbkdf2$${iterations}$${b64(salt)}$${b64(bits)}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, iter, salt, hash] = stored.split('$');
  if (scheme !== 'pbkdf2' || !iter || !salt || !hash) return false;
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: unb64(salt), iterations: Number(iter) },
    key,
    256,
  );
  return timingSafeEqual(new Uint8Array(bits), unb64(hash));
}

async function hmac(data: string) {
  const secret = bindings.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET is not configured');
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export const adminEmails = () =>
  (bindings.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const authConfigured = () => Boolean(bindings.ADMIN_PASSWORD_HASH && bindings.SESSION_SECRET && adminEmails().length);

export async function createSession(cookies: AstroCookies, email: string, secure: boolean) {
  const exp = now() + SESSION_TTL;
  const payload = `${email}|${exp}`;
  const token = `${btoa(payload)}.${await hmac(payload)}`;
  cookies.set(COOKIE, token, { httpOnly: true, secure, sameSite: 'strict', path: '/', maxAge: SESSION_TTL / 1000 });
}

export function clearSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}

export async function readSession(cookies: AstroCookies): Promise<string | null> {
  const token = cookies.get(COOKIE)?.value;
  if (!token || !authConfigured()) return null;
  const [p, sig] = token.split('.');
  if (!p || !sig) return null;
  let payload: string;
  try {
    payload = atob(p);
  } catch {
    return null;
  }
  const expected = await hmac(payload);
  if (!timingSafeEqual(enc.encode(expected), enc.encode(sig))) return null;
  const [email, exp] = payload.split('|');
  if (!email || Number(exp) < now() || !adminEmails().includes(email)) return null;
  return email;
}

export async function tooManyAttempts(request: Request) {
  const ip = await ipHash(request);
  const since = now() - 15 * 60 * 1000;
  const row = await db()
    .prepare('SELECT COUNT(*) AS n FROM login_attempts WHERE ip_hash = ? AND at > ? AND ok = 0')
    .bind(ip, since)
    .first<{ n: number }>();
  return (row?.n ?? 0) >= 8;
}

export async function recordAttempt(request: Request, ok: boolean) {
  await db()
    .prepare('INSERT INTO login_attempts (ip_hash, at, ok) VALUES (?, ?, ?)')
    .bind(await ipHash(request), now(), ok ? 1 : 0)
    .run();
}

export async function audit(actor: string, action: string, detail?: string) {
  await db()
    .prepare('INSERT INTO audit_log (at, actor, action, detail) VALUES (?, ?, ?, ?)')
    .bind(now(), actor, action, detail ?? null)
    .run();
}
