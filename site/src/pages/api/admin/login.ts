import type { APIRoute } from 'astro';
import { adminEmails, audit, authConfigured, createSession, recordAttempt, tooManyAttempts, verifyPassword } from '@/lib/auth';
import { bindings, clean, sameOrigin } from '@/lib/runtime';

export const prerender = false;

const safeNext = (n: string) => (n.startsWith('/admin') && !n.startsWith('//') ? n : '/admin');

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  const email = clean(form.get('email'), 200).toLowerCase();
  const password = String(form.get('password') ?? '').slice(0, 200);
  const next = safeNext(clean(form.get('next'), 200));
  const back = (error: string) => redirect(`/admin/login?error=${error}&next=${encodeURIComponent(next)}`, 303);

  if (!authConfigured()) return back('setup');
  if (await tooManyAttempts(request)) return back('locked');

  const ok = adminEmails().includes(email) && (await verifyPassword(password, bindings.ADMIN_PASSWORD_HASH!));
  await recordAttempt(request, ok);
  if (!ok) return back('invalid');

  await createSession(cookies, email, url.protocol === 'https:');
  await audit(email, 'login');
  return redirect(next, 303);
};
