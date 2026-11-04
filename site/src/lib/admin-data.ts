import type { EnquiryRow } from './enquiries';
import { db, now } from './runtime';

export const STATUSES = [
  { key: 'new', label: 'New' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'replied', label: 'Replied' },
  { key: 'won', label: 'Won' },
  { key: 'archived', label: 'Archived' },
] as const;

export type ListItem = Pick<EnquiryRow, 'id' | 'created_at' | 'status' | 'source' | 'name' | 'company' | 'pillars' | 'ai_summary' | 'ai_score' | 'voice_key'>;

const DAY = 86_400_000;

export const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10);

export async function overview() {
  const d = db();
  const today = isoDay(now());
  const since14 = isoDay(now() - 13 * DAY);
  const week = now() - 7 * DAY;
  const [views, viewsToday, enqWeek, enqNew, chatsWeek, avgScore, recent, pipeline, questions] = await d.batch([
    d.prepare('SELECT day, SUM(views) AS v FROM pageviews WHERE day >= ? GROUP BY day ORDER BY day').bind(since14),
    d.prepare('SELECT COALESCE(SUM(views), 0) AS v FROM pageviews WHERE day = ?').bind(today),
    d.prepare('SELECT COUNT(*) AS n FROM enquiries WHERE created_at > ?').bind(week),
    d.prepare("SELECT COUNT(*) AS n FROM enquiries WHERE status = 'new'"),
    d.prepare('SELECT COUNT(*) AS n FROM chats WHERE created_at > ? AND message_count > 0').bind(week),
    d.prepare('SELECT ROUND(AVG(ai_score)) AS s FROM enquiries WHERE ai_score IS NOT NULL AND created_at > ?').bind(now() - 30 * DAY),
    d.prepare(
      'SELECT id, created_at, status, source, name, company, pillars, ai_summary, ai_score, voice_key FROM enquiries ORDER BY created_at DESC LIMIT 6',
    ),
    d.prepare('SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status'),
    d.prepare("SELECT content, created_at FROM chat_messages WHERE role = 'user' ORDER BY id DESC LIMIT 8"),
  ]);

  const byDay = new Map((views.results as { day: string; v: number }[]).map((r) => [r.day, r.v]));
  const series = Array.from({ length: 14 }, (_, i) => {
    const day = isoDay(now() - (13 - i) * DAY);
    return { day, v: byDay.get(day) ?? 0 };
  });

  return {
    series,
    viewsToday: (viewsToday.results[0] as { v: number })?.v ?? 0,
    enquiriesWeek: (enqWeek.results[0] as { n: number })?.n ?? 0,
    enquiriesNew: (enqNew.results[0] as { n: number })?.n ?? 0,
    chatsWeek: (chatsWeek.results[0] as { n: number })?.n ?? 0,
    avgScore: (avgScore.results[0] as { s: number | null })?.s ?? null,
    recent: recent.results as ListItem[],
    pipeline: Object.fromEntries((pipeline.results as { status: string; n: number }[]).map((r) => [r.status, r.n])) as Record<string, number>,
    questions: questions.results as { content: string; created_at: number }[],
  };
}

export async function listEnquiries(status: string | null) {
  const valid = STATUSES.some((s) => s.key === status);
  const stmt = valid
    ? db()
        .prepare(
          'SELECT id, created_at, status, source, name, company, pillars, ai_summary, ai_score, voice_key FROM enquiries WHERE status = ? ORDER BY created_at DESC LIMIT 200',
        )
        .bind(status)
    : db().prepare(
        "SELECT id, created_at, status, source, name, company, pillars, ai_summary, ai_score, voice_key FROM enquiries WHERE status != 'archived' ORDER BY created_at DESC LIMIT 200",
      );
  const [{ results }, counts] = await db().batch([stmt, db().prepare('SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status')]);
  return {
    items: results as ListItem[],
    counts: Object.fromEntries((counts.results as { status: string; n: number }[]).map((r) => [r.status, r.n])) as Record<string, number>,
  };
}

export const ago = (t: number) => {
  const s = Math.max(1, Math.round((now() - t) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 14) return `${d} d ago`;
  return new Intl.DateTimeFormat('en-SG', { day: 'numeric', month: 'short', timeZone: 'Asia/Singapore' }).format(t);
};

export const fmtDate = (t: number) =>
  new Intl.DateTimeFormat('en-SG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Singapore' }).format(t);

export const parsePillars = (s: string | null) => {
  try {
    return JSON.parse(s ?? '[]') as string[];
  } catch {
    return [];
  }
};
