# Launch checklist

## Content

- [ ] All `cms/content.ts` placeholders replaced with approved copy
- [ ] Legal page reviewed by counsel
- [ ] Partner names and logos approved for public use
- [ ] Gallery assets licensed and credited

## Quality

- [ ] `npx expo lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] Smoke test: Home, About, Collectives, Gallery, Partners, Legal routes
- [ ] Mobile width: floating nav pill reachable; no clipped text
- [ ] Desktop width: navbar links work; asymmetry reads as intentional

## Performance & polish

- [ ] Font loading verified on native (remote TTF URLs) and web (Google Fonts in `+html`)
- [ ] Rain overlay performance acceptable on low-end devices (reduce `DROP_COUNT` if needed)
- [ ] Favicon and meta title set in `app.json` / web head as needed

## Deploy

- [ ] Production environment variables documented (if any)
- [ ] Analytics / error monitoring wired (if required)
- [ ] Domain + HTTPS configured for web export
