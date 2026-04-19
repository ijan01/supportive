# JobBoard

A full-featured job search site built with Next.js, Tailwind CSS, and Vercel Postgres.

## Features

- Browse, search, and filter jobs
- Job detail pages with JSON-LD structured data
- Company accounts: post, edit, delete jobs + see applicant counts
- Job seeker accounts: apply to jobs, save/bookmark jobs, track applications
- Career blog with 4 seed articles
- Full SEO suite: sitemap.xml, robots.txt, Open Graph, canonical URLs, breadcrumbs
- Bold & colorful design with gradients

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS**
- **Vercel Postgres** (Neon)
- **NextAuth.js v5** (credentials provider)
- **bcryptjs** for password hashing

## Deploying to Vercel

1. **Push this repo to GitHub** (or import the existing one).
2. **Import the project** into Vercel (vercel.com/new).
3. **Create a Postgres database**:
   - In your Vercel project, go to the **Storage** tab.
   - Click **Create Database** and choose **Postgres** (Neon).
   - Vercel will automatically attach it and inject the `POSTGRES_URL` env var.
4. **Set remaining env vars** in Project Settings > Environment Variables:
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_SITE_URL` — your Vercel deployment URL
5. **Deploy** — Vercel will build and deploy automatically.
6. **Seed the database** (one-time):
   - Pull the `.env.local` file: `vercel env pull .env.local`
   - Run locally: `npm run db:seed`

## Demo Credentials (after seeding)

- Company: `company@demo.com` / `password123`
- Job Seeker: `seeker@demo.com` / `password123`

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your Postgres URL and NextAuth secret
cp .env.local.example .env.local

# 3. Seed the database
npm run db:seed

# 4. Start dev server
npm run dev
```

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run db:seed` — populate database with demo data
- `npm run lint` — run ESLint
