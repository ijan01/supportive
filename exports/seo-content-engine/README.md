# SEO Content Engine

An AI-powered blog content planning and generation system built for Next.js App Router with PostgreSQL and Google Gemini.

## What it does

1. **Content Planning** — 100-article editorial calendar organised as PILLAR / CLUSTER / CONVERSION content types with parent-child relationships, target keywords, and role targeting
2. **AI Generation** — One-click article generation using Google Gemini 2.5 Flash with a detailed system prompt that produces SEO-optimised, sector-specific blog content with proper structure, internal linking, citations, and CTAs
3. **Blog CMS** — Full admin interface for managing blog posts with markdown editor, formatting toolbar, preview, keywords, and publish/draft workflow
4. **Content Plan ↔ Blog Sync** — Automatic linking between the content plan and blog posts, with status tracking from Planned → Draft → Published

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Admin UI                                           │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Content Plan  │  │ Blog Posts   │                │
│  │ Map + Table   │  │ List + Edit  │                │
│  │ + Filters     │  │ + Preview    │                │
│  └──────┬───────┘  └──────┬───────┘                │
│         │                  │                        │
│  "Generate Draft"    "Publish" / "Regenerate"       │
│         │                  │                        │
│  ┌──────▼──────────────────▼───────┐               │
│  │  API Routes                      │               │
│  │  /api/admin/content/generate     │  ← Gemini AI  │
│  │  /api/admin/blog                 │               │
│  │  /api/admin/content-plan         │               │
│  │  /api/admin/sync-blog-content-plan│              │
│  └──────┬──────────────────┬───────┘               │
│         │                  │                        │
│  ┌──────▼──────┐    ┌──────▼──────┐                │
│  │ content_plan │◄──►│ blog_posts  │                │
│  │    table     │    │   table     │                │
│  └─────────────┘    └─────────────┘                │
└─────────────────────────────────────────────────────┘
```

## Files

### Database
- `schema/tables.sql` — SQL for content_plan and blog_posts tables

### Library (src/lib/)
- `content-plan.ts` — Content plan CRUD (getAllContentPlanItems, create, update, delete, getStats)
- `blog.ts` — Blog post CRUD with paginated admin queries and content_plan JOIN
- `types.ts` — ContentPlanItem and BlogPost interfaces

### API Routes (src/app/api/admin/)
- `content/generate/route.ts` — AI generation pipeline (system prompt, brief builder, Gemini call with retry/fallback)
- `content-plan/route.ts` — Content plan CRUD endpoint
- `blog/route.ts` — Blog CRUD endpoint with auto content_plan sync on publish
- `sync-blog-content-plan/route.ts` — Bulk sync + repair pass for orphaned posts
- `seed-content-plan/route.ts` — 100-article content plan seed data

### Admin UI (src/app/admin/)
- `content/page.tsx` — Content plan listing (server)
- `content/client.tsx` — Content plan UI with map view, table view, filters, edit modal, generate button
- `content/new/page.tsx` — Create new content plan article
- `blog/page.tsx` — Blog listing with pagination, type badges, keyword display
- `blog/client.tsx` — Blog actions (edit, view, delete)
- `blog/edit/page.tsx` — Blog editor page with regenerate button
- `blog/new/page.tsx` — New blog post page

### Components (src/components/)
- `BlogPostForm.tsx` — Markdown editor with toolbar, preview, keywords, regenerate button

### Public Pages (src/app/blog/)
- `page.tsx` — Blog listing page
- `[slug]/page.tsx` — Individual blog post with SEO metadata and JSON-LD

## Setup

### 1. Database

Run the SQL in `schema/tables.sql` to create the two tables. The content_plan table stores the editorial calendar; blog_posts stores the actual articles.

### 2. Environment Variables

```env
# Required for AI generation
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Database (PostgreSQL)
POSTGRES_URL=your-postgres-connection-string

# Optional
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

### 3. Dependencies

```bash
npm install @google/genai
```

### 4. Seed the Content Plan

Hit `GET /api/admin/seed-content-plan` (requires admin auth) to populate the 100-article content plan. Customise the articles in `seed-content-plan/route.ts` for your industry.

### 5. Generate Content

From the admin content plan page, click any article → "Generate Draft". The AI will:
1. Build a brief with parent pillar context, sibling articles, internal links, and word count targets
2. Call Gemini 2.5 Flash (with fallback to 2.0 Flash on overload)
3. Parse the JSON metadata block (title, slug, excerpt, keywords, word count)
4. Save to blog_posts and update content_plan status to Draft

### 6. Review and Publish

Edit the generated draft in the blog editor, toggle Published, and save. The content_plan is automatically updated to Published with the blog URL.

## Customising the System Prompt

The system prompt in `content/generate/route.ts` (lines 15-125) controls the AI's writing style, structure rules, and anti-AI-slop rules. Key sections to customise:

- **Voice and Tone** — Change the persona and industry references
- **Structure Rules** — Adjust word counts and section formats for PILLAR/CLUSTER/CONVERSION
- **Internal Linking Rules** — Update the URL patterns for your site
- **CTA Rules** — Change the call-to-action format
- **Anti-AI-Slop Rules** — Keep these, they work for any niche

## Content Types

| Type | Word Count | Purpose |
|------|-----------|---------|
| PILLAR | 2,000-4,000 | Comprehensive guides that anchor a topic cluster |
| CLUSTER | 800-1,500 | Focused articles that link to and from a parent pillar |
| CONVERSION | 600-1,200 | Actionable content designed to convert readers |

## Rate Limiting

The generate endpoint limits to 3 generations per hour (tracked by Draft status changes in the last hour). Adjust in `checkRateLimit()`.
