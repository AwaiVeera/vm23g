import type { APIRoute } from 'astro';
import { clearSession } from '@/lib/auth';
import { sameOrigin } from '@/lib/runtime';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 });
  clearSession(cookies);
  return redirect('/admin/login?signed_out=1', 303);
};
