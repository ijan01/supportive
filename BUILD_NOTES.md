# BUILD_NOTES.md

## Decisions

- Auth: bypassed NextAuth `signIn()` entirely — it hangs on Vercel serverless due to internal
  HTTP self-requests. Using `encode`/`decode` from `next-auth/jwt` directly to set/read the
  session cookie. All `auth()` calls in server components and API routes replaced with
  `getSession()` / `getSessionFromRequest()` from `src/lib/session.ts`.
- Database: switched from `@vercel/postgres` (Neon-only) and `pg` (SSL cert error) to
  `postgres.js` v3.4.9 with `ssl: { rejectUnauthorized: false }` for Supabase compatibility.

## Gotchas

- Cookie name differs by environment: `authjs.session-token` (dev/HTTP) vs
  `__Secure-authjs.session-token` (prod/HTTPS). The `salt` passed to `encode`/`decode`
  must match the cookie name exactly.
- `getToken` in middleware requires explicit `secureCookie` and `cookieName` — auto-detection
  was looking for the wrong cookie on Vercel production.
- The `/api/seed` GET endpoint is publicly accessible. Protect or remove before going live.
- The `/api/debug-auth` endpoint is publicly accessible. Remove before going live.
- Tailwind 4 uses `@theme inline` in globals.css — no `tailwind.config.ts` file exists.

## To revisit

- Protect or remove `/api/seed` and `/api/debug-auth` before launch.
- `lang="en"` in root layout needs to be `lang="en-AU"` (Section 2).
- All dates use `toLocaleDateString("en-US", {...})` — change to `en-AU` or DD/MM/YYYY.
- No rate limiting on auth endpoints.
- No CSRF protection beyond sameSite=lax cookie.
- Eventually emit `ItemList` JSON-LD on `/jobs` index and role/location hubs for better discovery.

## Architecture notes

### Tech stack

- **Framework:** Next.js 16.2.4, App Router, React 19, TypeScript (strict)
- **Styling:** Tailwind CSS 4 (zero-config, `@theme inline` in `globals.css`, no config file).
  Colour palette is all inline Tailwind utilities — violet/purple primary, amber accent, slate neutrals.
  Colour token map lives in `src/constants/index.ts` (`JOB_TYPE_COLORS`, `APPLICATION_STATUS_COLORS`).
- **Database:** PostgreSQL (Supabase) via `postgres.js` 3.4.9. Custom `sql` tagged-template
  wrapper in `db/index.ts`. No ORM — raw SQL throughout.
- **Auth:** NextAuth v5 beta.31, credentials provider, JWT strategy. Session set/read manually
  via `next-auth/jwt` encode/decode (see Decisions).
- **Deployment:** Vercel (serverless). `NODE_ENV=production` triggers secure-cookie naming.

### Folder structure (load-bearing)

```
src/app/                  Next.js App Router pages and API routes
src/components/           Shared UI components
src/constants/index.ts    JOB_TYPES, JOB_CATEGORIES, LOCATIONS, colour maps
src/lib/                  Data access layer (jobs, users, applications, etc.)
src/lib/session.ts        Auth helper (replaces auth() — reads JWT cookie directly)
src/lib/types.ts          TypeScript types for Job, Application, etc.
db/index.ts               postgres.js connection + sql() wrapper
db/schema.ts              Table CREATE statements (users, jobs, applications, saved_jobs, blog_posts)
db/seed.ts                18 hardcoded seed jobs (US tech — to be replaced in Section 3)
auth.ts                   NextAuth config (credentials provider, jwt/session callbacks)
middleware.ts             Route protection for /dashboard/*
```

### Job data

- Seed data: `db/seed.ts` and `src/app/api/seed/route.ts` (duplicated — both have the same 18
  jobs). The API seed route is web-accessible.
- DB schema: `jobs` table — id, user_id, title, company, location, category, job_type,
  salary_min, salary_max, description, requirements, apply_url, is_featured, created_at, updated_at.
- No migration tool — schema is applied via `db/schema.ts` run manually.

### What needs to change (Week 1 sections)

**Section 1 — Brand:**
- "JobBoard" appears in: `Navbar.tsx`, `Footer.tsx`, `layout.tsx`, `about/page.tsx`,
  `page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`.

**Section 2 — AU localisation:**
- US cities in: `src/constants/index.ts` (LOCATIONS array), `db/seed.ts`, `src/app/api/seed/route.ts`.
- USD in: `PostJobForm.tsx` (labels), `jobs/[id]/page.tsx` (JSON-LD currency field).
- Locale: `layout.tsx` lang="en", `blog/[slug]/page.tsx` uses `toLocaleDateString("en-US")`.
- Stats block (`StatsSection.tsx`): hardcoded "500+ Active Jobs / 100+ Companies / 10+ Categories /
  2,000+ Hired" — fabricated numbers, needs decision (hide or replace with honest pre-launch copy).

**Section 3 — Taxonomy:**
- `src/constants/index.ts` JOB_CATEGORIES: Engineering, Design, Marketing, Sales, Product,
  Data Science, DevOps, Customer Support, Finance, Human Resources — replace with 18 MH roles.
- `src/constants/index.ts` LOCATIONS: all US cities — replace with AU cities.
- `db/seed.ts` and `src/app/api/seed/route.ts`: 18 US tech jobs — replace with 6 AU MH sample jobs.
- `PostJobForm.tsx`: category and location dropdowns pull from constants — will update automatically.
