import { press as defaultPress, projects as defaultProjects } from '@/content/site';
import { bindings, now } from './runtime';

export type Project = {
  slug: string;
  title: string;
  kind: string;
  category: string;
  year: string;
  summary: string;
  image: string;
  href: string;
  linkLabel: string;
};

export type PressItem = {
  publication: string;
  title: string;
  date: string;
  classification: string;
  summary: string;
  href: string;
};

export type Faq = { q: string; a: string };

export type SiteContent = {
  hero: { lede: string };
  announcement: { enabled: boolean; text: string; href: string };
  cta: { title: string; accent: string; copy: string };
  projects: Project[];
  press: PressItem[];
  knowledge: { faqs: Faq[]; notes: string };
};

export const defaults: SiteContent = {
  hero: {
    lede: 'A Singapore group building AI systems, websites and apps, brands and media — and the discipline of body and mind behind them.',
  },
  announcement: { enabled: false, text: '', href: '' },
  cta: {
    title: 'If the work matters,',
    accent: 'build it properly.',
    copy: 'For founders, brands, creators and teams ready to combine intelligence, identity, media and human performance into one sharper operating system.',
  },
  projects: defaultProjects.map((p) => ({ ...p })),
  press: defaultPress.map((p) => ({ ...p })),
  knowledge: { faqs: [], notes: '' },
};

export const contentKeys = Object.keys(defaults) as (keyof SiteContent)[];

let cache: { at: number; value: SiteContent } | null = null;
const TTL = 15_000;

export function invalidateContent() {
  cache = null;
}

export async function getContent(): Promise<SiteContent> {
  if (cache && now() - cache.at < TTL) return cache.value;
  const value: SiteContent = structuredClone(defaults);
  if (bindings.DB) {
    try {
      const { results } = await bindings.DB.prepare('SELECT key, value FROM content_blocks').all<{ key: string; value: string }>();
      for (const row of results) {
        if (!(row.key in value)) continue;
        try {
          (value as Record<string, unknown>)[row.key] = JSON.parse(row.value);
        } catch {}
      }
    } catch {}
  }
  cache = { at: now(), value };
  return value;
}

const str = (v: unknown, max = 600) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const url = (v: unknown) => {
  const s = str(v, 500);
  if (!s) return '';
  try {
    const u = new URL(s, 'https://veeramisir.com');
    return u.protocol === 'https:' || u.protocol === 'http:' ? (s.startsWith('/') ? s : u.toString()) : '';
  } catch {
    return '';
  }
};

export function sanitize<K extends keyof SiteContent>(key: K, input: unknown): SiteContent[K] {
  const v = (input ?? {}) as Record<string, unknown>;
  switch (key) {
    case 'hero':
      return { lede: str(v.lede, 280) || defaults.hero.lede } as SiteContent[K];
    case 'announcement':
      return { enabled: Boolean(v.enabled), text: str(v.text, 140), href: url(v.href) } as SiteContent[K];
    case 'cta':
      return {
        title: str(v.title, 80) || defaults.cta.title,
        accent: str(v.accent, 80) || defaults.cta.accent,
        copy: str(v.copy, 320) || defaults.cta.copy,
      } as SiteContent[K];
    case 'projects':
      return (Array.isArray(input) ? input : []).slice(0, 40).map((p: Record<string, unknown>, i) => ({
        slug: str(p.slug, 60).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '') || `project-${i + 1}`,
        title: str(p.title, 80),
        kind: str(p.kind, 80),
        category: str(p.category, 40),
        year: str(p.year, 8),
        summary: str(p.summary, 400),
        image: str(p.image, 200),
        href: url(p.href),
        linkLabel: str(p.linkLabel, 40),
      })).filter((p) => p.title) as SiteContent[K];
    case 'press':
      return (Array.isArray(input) ? input : []).slice(0, 30).map((p: Record<string, unknown>) => ({
        publication: str(p.publication, 80),
        title: str(p.title, 200),
        date: /^\d{4}-\d{2}-\d{2}$/.test(str(p.date, 10)) ? str(p.date, 10) : '',
        classification: str(p.classification, 80),
        summary: str(p.summary, 400),
        href: url(p.href),
      })).filter((p) => p.publication && p.title && p.href) as SiteContent[K];
    case 'knowledge': {
      const faqs = Array.isArray(v.faqs) ? v.faqs : [];
      return {
        faqs: faqs
          .slice(0, 40)
          .map((f: Record<string, unknown>) => ({ q: str(f.q, 200), a: str(f.a, 800) }))
          .filter((f: Faq) => f.q && f.a),
        notes: str(v.notes, 4000),
      } as SiteContent[K];
    }
    default:
      throw new Error(`Unknown content key ${String(key)}`);
  }
}
