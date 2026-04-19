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
- No rate limiting on auth endpoints.
- No CSRF protection beyond sameSite=lax cookie.
- Eventually emit `ItemList` JSON-LD on `/jobs` index and role/location hubs for better discovery.

## Week 2 — friction found in Section 7 walkthrough

### Candidate (peer worker in Melbourne, part-time, youth mental health)

- **Search requires Enter key** — `JobFilters` has no submit button; users who type and pause
  expect live results or a visible search button. High drop-off risk on mobile.
- **"Remote" is both a job type and a location** — `JOB_TYPES` includes "Remote" alongside
  "Full-time"/"Part-time", but Remote describes *where* you work, not the basis of employment.
  A candidate filtering for "Part-time in Melbourne" sees "Remote" as a peer job-type option,
  which is confusing. Fix: remove "Remote" from `JOB_TYPES`; use the location field
  ("Remote (Australia)") for remote roles instead.
- **No job count on hub pages** — `/roles/peer-support-worker` and `/locations/melbourne-vic`
  show "coming soon" with no live count. A candidate can't tell whether there are 0 or 50 roles
  before clicking through to /jobs with filters.
- **Save-job feature is invisible to anonymous users** — no prompt on job cards or the jobs list
  to sign up in order to save roles. The save/track-applications feature is a key retention hook
  but candidates don't discover it until after they've already registered.
- **Empty-state emoji** — `JobList`, seeker dashboard, and company dashboard use 🔍 📝 🔖 📋
  emoji in empty states. Inconsistent with the no-emoji style elsewhere.
- **No "apply via Supportive" vs "apply externally" clarity** — job cards don't indicate whether
  clicking through leads to an external apply URL or an in-site application form. Candidates
  don't know what they're getting into before clicking.
- **No pagination on /jobs** — all matching jobs load at once. Fine now with 6 seed jobs; will
  become a performance and UX problem at scale.

### Employer (AOD service, Brisbane, thinking of posting three roles)

- **No employer value proposition on the homepage** — the hero CTA is entirely candidate-facing
  ("Find your next role in mental health"). There is no above-the-fold signal for employers that
  this is the right place to hire. The only employer entry point is the footer "Post a role" link.
- **`/employers` is fully "coming soon"** — an employer navigating there from the footer or
  navbar gets a placeholder with no social proof, no employer count, no "why post here" copy.
  This is the first page a skeptical employer would check before registering.
- **No pricing or "it's free" signal anywhere** — an employer landing on the register page has
  no idea if posting costs money. No indication on the homepage, /employers, or /auth/register.
- **Post job form has no context on the apply flow** — the "External Apply URL" field is
  optional with no explanation. If left blank, applications come through Supportive's internal
  form, but the employer isn't told this. Many employers will be confused about where
  applications go.
- **No email notification on new application** — employers must actively check the dashboard.
  Most will forget and miss applications. Critical gap for retention.
- **Company dashboard heading says "Company Dashboard"** — should be "Employer dashboard" or
  personalised ("headspace — Dashboard"). "Company" feels like a tech-startup word in an MH
  context.
- **`+ Post a Job` button** — the leading `+` is inconsistent with the rest of the UI. Minor.
- **No confirmation toast after posting a job** — form submits and silently redirects to
  dashboard. A "Role posted successfully" message would reassure first-time employers.
- **Demo credentials visible on login page** — `company@demo.com / password123` is shown to
  all visitors. Fine for development; must be removed before public launch.

### General

- **`formatSalary` outputs `$80k - $100k`** — correct for AU context, but no "AUD" label.
  International visitors (or Google) may not know the currency. JSON-LD has `"currency": "AUD"`
  which covers structured data; consider adding "AUD" to the on-page salary display.
- **`/api/seed` is publicly accessible** and would re-seed the DB if hit in production.
  Remove or gate behind an admin token before any public traffic.
- **No `robots.txt` `Disallow` for `/api/` or `/dashboard/`** — bots can crawl auth endpoints
  and API routes. Add disallow rules for non-public paths.

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
