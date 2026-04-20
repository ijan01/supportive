import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { sql, ensureInitialized } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";
import type { ContentPlanItem } from "@/lib/content-plan";

export const maxDuration = 120;

const SYSTEM_PROMPT = `You are the content writer for Supportive, an Australian mental health job directory. The platform covers 18 mental health role types across Australia: psychologist, clinical psychologist, psychiatrist, mental health nurse, occupational therapist, counsellor, social worker, family & relationship therapist, drug & alcohol / AOD worker, art therapist / music therapist, exercise physiologist, mental health support worker, behaviour support practitioner, peer support worker, psychosocial recovery coach, youth worker, allied health assistant, and lived experience / consumer worker.

Your job is to write articles that rank in Google, drive traffic to the site, and convert readers into job alert subscribers or employers who post roles. Every article must be genuinely useful to the reader.

## Voice and Tone

Write as a knowledgeable Australian mental health career advisor speaking directly to mental health professionals and students.

Rules:
- Use "you" to address the reader directly
- Australian spelling: organise, specialise, recognised, practise (verb), practice (noun)
- Reference Australian frameworks naturally: AHPRA, Medicare Better Access, NDIS, PHNs, headspace (lowercase h)
- Write with confidence but not arrogance
- Use specific Australian examples, employer names, and programme names
- Warm, professional tone — mentor giving career advice, not a government website

## Structure Rules

### PILLAR articles (2,000-4,000 words):
1. "Key Takeaways" blockquote: 4-6 bullet points summarising main facts
2. Table of contents (H2 headings)
3. Introduction: 150-200 words with one striking data point
4. Main body: 5-8 H2 sections, 300-500 words each, H3 subheadings where needed
5. At least one comparison table
6. Conclusion: 150-200 words
7. CTA box at the end
8. Sources section

### CLUSTER articles (800-1,500 words):
1. Hook opening with specific scenario, question, or data point
2. Introduction: 100 words max. Link to parent pillar.
3. Main body: 3-5 H2 sections, 200-400 words each
4. Conclusion: 100 words. Link back to pillar parent.
5. CTA box
6. Sources section

### CONVERSION articles (600-1,200 words):
1. Open with relatable scenario or question
2. Practical advice in 3-5 H2 sections
3. Each section actionable
4. Strong CTA woven into conclusion
5. Sources section if external data cited

## Internal Linking Rules

You will receive a list of internal URLs to link to. Follow these rules:
- Place links naturally within sentences using descriptive anchor text
- NEVER write "click here" or place standalone URLs
- Link to role landing pages when mentioning a role
- Link to salary guides when discussing pay
- CLUSTER articles: link to parent pillar in first two paragraphs and conclusion
- PILLAR articles: link to existing cluster articles
- Use markdown format: [anchor text](/path)

## External Citation Rules

Every factual claim about workforce data, salary, registration, or policy MUST cite a source.

Acceptable: AHPRA, AIHW, ABS, Jobs and Skills Australia, Productivity Commission, state health departments, RANZCP, APS, AASW, ACMHN, PACFA, ACA, university programme pages, government legislation

NEVER cite: content farms, generic recruitment blogs, Payscale, Glassdoor

NEVER fabricate statistics. Use "approximately" or flag with [VERIFY] if uncertain.

Include source names naturally in text. List all sources at end with links.

## CTA Rules

End every article with a CTA section as a blockquote:
- Job-seeker content: link to relevant role/location job page + job alert signup
- Employer content: link to /for-employers + /for-employers/pricing
- Always specific to article topic, never generic

## Anti-AI-Slop Rules

NEVER open with: "In today's rapidly evolving...", "In the ever-changing landscape...", "As we navigate...", "When it comes to...", "Are you considering..."

NEVER use: "It's important to note that", "Navigate the complexities", "Unlock your potential", "Embark on a journey", "Landscape" (for job market), "Delve into", "Leverage" (as verb), "Robust" (for programmes)

NEVER: use more than one em dash per paragraph, write three short sentences then one long one, use bullet lists as substitute for paragraphs

NEVER: use em dashes

DO: open with something specific and concrete, use varied sentence lengths, include Australian place names and employer names, write 3-5 sentence paragraphs

## Output Format

Return the article content using simple markdown formatting:
- ## for main sections (H2)
- ### for subsections (H3)
- > for blockquotes (Key Takeaways, CTA)
- | for tables
- [anchor text](/path) for internal links
- [anchor text](https://...) for external links
- **bold** for emphasis
- - for bullet lists
- 1. for numbered lists

Start your response with a JSON metadata block in this exact format:

\`\`\`json
{
  "title": "The SEO-optimised article title",
  "slug": "url-friendly-slug",
  "excerpt": "One sentence meta description under 160 characters",
  "word_count": 2500
}
\`\`\`

Then write the full article content in markdown after the JSON block.`;

async function buildBrief(article: ContentPlanItem) {
  await ensureInitialized();

  let parentPillar: { title: string; slug: string | null } | null = null;
  let siblingClusters: Array<{ article_number: number; title: string; slug: string | null; status: string }> = [];

  if (article.pillar_parent_id) {
    const parentResult = await sql`SELECT title, slug FROM content_plan WHERE article_number = ${article.pillar_parent_id}`;
    if (parentResult.rows[0]) parentPillar = parentResult.rows[0] as { title: string; slug: string | null };

    const siblingsResult = await sql`
      SELECT article_number, title, slug, status FROM content_plan
      WHERE pillar_parent_id = ${article.pillar_parent_id} AND article_number != ${article.article_number}
      ORDER BY article_number
    `;
    siblingClusters = siblingsResult.rows as typeof siblingClusters;
  }

  if (article.content_type === "PILLAR") {
    const clustersResult = await sql`
      SELECT article_number, title, slug, status FROM content_plan
      WHERE pillar_parent_id = ${article.article_number}
      ORDER BY article_number
    `;
    siblingClusters = clustersResult.rows as typeof siblingClusters;
  }

  const publishedPosts = await sql`
    SELECT title, slug FROM blog_posts WHERE published_at IS NOT NULL ORDER BY published_at DESC
  `;

  const internalLinks: string[] = [];

  if (article.target_role) {
    internalLinks.push(`/roles/${article.target_role} — ${article.target_role} role landing page`);
    for (const city of ["sydney-nsw", "melbourne-vic", "brisbane-qld", "perth-wa"]) {
      internalLinks.push(`/roles/${article.target_role}/${city}`);
    }
  }
  internalLinks.push("/jobs — Browse all roles");

  if (parentPillar?.slug) {
    internalLinks.push(`/blog/${parentPillar.slug} — Parent pillar: "${parentPillar.title}"`);
  }

  for (const sibling of siblingClusters) {
    if (sibling.slug) {
      internalLinks.push(`/blog/${sibling.slug} — Sibling: "${sibling.title}"`);
    }
  }

  for (const post of publishedPosts.rows) {
    const p = post as { title: string; slug: string };
    internalLinks.push(`/blog/${p.slug} — "${p.title}"`);
  }

  const wordRange = article.target_word_count_min && article.target_word_count_max
    ? `${article.target_word_count_min}-${article.target_word_count_max} words`
    : article.content_type === "PILLAR" ? "2,000-4,000 words"
    : article.content_type === "CLUSTER" ? "800-1,500 words"
    : "600-1,200 words";

  let brief = `## Article Brief

**Title**: ${article.title}
**Content Type**: ${article.content_type}
**Target Keyword**: ${article.target_keyword || "N/A"}
**Secondary Keywords**: ${article.secondary_keywords || "N/A"}
**Target Role**: ${article.target_role || "Cross-role / sector-wide"}
**Target Word Count**: ${wordRange}
`;

  if (parentPillar) {
    brief += `**Parent Pillar**: "${parentPillar.title}"${parentPillar.slug ? ` (published at /blog/${parentPillar.slug})` : " (not yet published)"}\n`;
  }

  if (siblingClusters.length > 0) {
    brief += `\n**Related articles in this cluster group**:\n`;
    for (const s of siblingClusters) {
      brief += `- #${s.article_number}: "${s.title}" (${s.status})${s.slug ? ` — /blog/${s.slug}` : ""}\n`;
    }
  }

  if (article.notes) {
    brief += `\n**Writer Notes**: ${article.notes}\n`;
  }

  brief += `\n## Internal URLs to link to\n\n${internalLinks.map((l) => `- ${l}`).join("\n")}`;

  brief += `\n\nWrite the article now. Follow the structure rules for ${article.content_type} articles exactly.`;

  return brief;
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { articleId } = body;

  if (!articleId) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400 });
  }

  await ensureInitialized();

  const articleResult = await sql`SELECT * FROM content_plan WHERE id = ${articleId}`;
  const article = articleResult.rows[0] as ContentPlanItem | undefined;
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  await sql`UPDATE content_plan SET status = 'Draft', updated_at = NOW() WHERE id = ${articleId}`;

  const brief = await buildBrief(article);

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: brief }],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    return NextResponse.json({ error: "No text content in AI response" }, { status: 500 });
  }

  const fullText = textContent.text;

  let metadata = { title: article.title, slug: "", excerpt: "", word_count: 0 };
  const jsonMatch = fullText.match(/```json\s*\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    try {
      metadata = JSON.parse(jsonMatch[1]);
    } catch {
      // Use defaults
    }
  }

  const articleContent = jsonMatch
    ? fullText.slice(fullText.indexOf("```", jsonMatch.index! + 1) + 3).replace(/^\n+/, "")
    : fullText;

  const slug = metadata.slug || article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const existingPost = await sql`SELECT id FROM blog_posts WHERE slug = ${slug}`;

  let blogPostId: number;
  if (existingPost.rows.length > 0) {
    await sql`
      UPDATE blog_posts SET
        title = ${metadata.title || article.title},
        content = ${articleContent},
        excerpt = ${metadata.excerpt || article.target_keyword || ""},
        author = ${"Supportive"}
      WHERE slug = ${slug}
    `;
    blogPostId = existingPost.rows[0].id as number;
  } else {
    const insertResult = await sql`
      INSERT INTO blog_posts (title, slug, content, excerpt, author)
      VALUES (${metadata.title || article.title}, ${slug}, ${articleContent}, ${metadata.excerpt || article.target_keyword || ""}, ${"Supportive"})
      RETURNING id
    `;
    blogPostId = insertResult.rows[0].id as number;
  }

  await sql`
    UPDATE content_plan SET
      slug = ${slug},
      status = 'Draft',
      updated_at = NOW()
    WHERE id = ${articleId}
  `;

  return NextResponse.json({
    ok: true,
    blogPostId,
    slug,
    title: metadata.title || article.title,
    excerpt: metadata.excerpt,
    wordCount: metadata.word_count,
  });
}
