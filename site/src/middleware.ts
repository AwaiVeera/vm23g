import { defineMiddleware } from 'astro:middleware';
import { readSession } from '@/lib/auth';
import { bindings } from '@/lib/runtime';

const SECURITY_HEADERS: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), geolocation=(), microphone=(self)',
  'x-frame-options': 'SAMEORIGIN',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
};

const PUBLIC_ADMIN = new Set(['/admin/login', '/api/admin/login']);
const TRACKED = /^\/(|work|services|ai-lab|founders|ecosystem|start|legal)\/?$/;

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (isAdmin && !PUBLIC_ADMIN.has(pathname)) {
    const email = await readSession(context.cookies).catch(() => null);
    if (!email) {
      if (pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Unauthorised' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        });
      }
      return context.redirect(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
    context.locals.admin = email;
  }

  const response = await next();

  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(k)) response.headers.set(k, v);
  }
  if (isAdmin) {
    response.headers.set('cache-control', 'no-store');
    response.headers.set('x-robots-tag', 'noindex, nofollow');
  }

  if (
    context.request.method === 'GET' &&
    TRACKED.test(pathname) &&
    response.status === 200 &&
    bindings.DB &&
    !/bot|crawl|spider|preview/i.test(context.request.headers.get('user-agent') ?? '')
  ) {
    const day = new Date().toISOString().slice(0, 10);
    const path = pathname.replace(/\/$/, '') || '/';
    const write = bindings.DB.prepare(
      'INSERT INTO pageviews (day, path, views) VALUES (?, ?, 1) ON CONFLICT (day, path) DO UPDATE SET views = views + 1',
    )
      .bind(day, path)
      .run()
      .catch(() => undefined);
    context.locals.cfContext?.waitUntil(write);
  }

  return response;
});
