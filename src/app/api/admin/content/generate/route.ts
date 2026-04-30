import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { sql } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import type { ContentPlanItem } from "@/lib/content-plan";
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_MODEL_ID, getModelProvider } from "@/constants/content-models";

export const maxDuration = 120;

const WORD_COUNT_DEFAULTS: Record<string, [number, number]> = {
  PILLAR: [2000, 4000],
  CLUSTER: [800, 1500],
  CONVERSION: [600, 1200],
};

async function checkRateLimit(): Promise<boolean> {
  const result = await sql`
    SELECT COUNT(*)::int AS count FROM content_plan
    WHERE status = 'Draft'
      AND updated_at >= NOW() - INTERVAL '1 hour'
  `;
  return (result.rows[0].count as number) < 3;
}

async function buildBrief(article: ContentPlanItem) {

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

  const [wcMin, wcMax] = WORD_COUNT_DEFAULTS[article.content_type] || [800, 1500];
  const wordMin = article.target_word_count_min || wcMin;
  const wordMax = article.target_word_count_max || wcMax;

  let brief = `## Article Brief

**Title**: ${article.title}
**Content Type**: ${article.content_type}
**Target Keyword**: ${article.target_keyword || "N/A"}
**Secondary Keywords**: ${article.secondary_keywords || "N/A"}
**Target Role**: ${article.target_role || "Cross-role / sector-wide"}
**Target Word Count**: ${wordMin}-${wordMax} words
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

  const body = await request.json();
  const { articleId } = body;

  if (!articleId) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400 });
  }
  const allowed = await checkRateLimit();
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit reached: maximum 3 article generations per hour. Please wait before generating another." }, { status: 429 });
  }

  // Load agent settings (model + system prompt) — falls back to defaults if not configured
  const settingsResult = await sql`SELECT model_id, system_prompt FROM agent_settings WHERE id = 1`.catch(() => ({ rows: [] }));
  const settingsRow = settingsResult.rows[0] as { model_id: string; system_prompt: string } | undefined;
  const modelId = settingsRow?.model_id ?? DEFAULT_MODEL_ID;
  const systemPrompt = settingsRow?.system_prompt || DEFAULT_SYSTEM_PROMPT;
  const provider = getModelProvider(modelId);

  const articleResult = await sql`SELECT * FROM content_plan WHERE id = ${articleId}`;
  const article = articleResult.rows[0] as ContentPlanItem | undefined;
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const previousStatus = article.status;
  await sql`UPDATE content_plan SET status = 'Draft', updated_at = NOW() WHERE id = ${articleId}`;

  let fullText: string;
  try {
    const brief = await buildBrief(article);
    const delays = [0, 3000, 8000];
    let lastError: unknown = null;
    fullText = "";

    for (const delay of delays) {
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
      try {
        if (provider === "anthropic") {
          const anthropicKey = process.env.ANTHROPIC_API_KEY;
          if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY is not configured in environment variables.");
          const client = new Anthropic({ apiKey: anthropicKey });
          const msg = await client.messages.create({
            model: modelId,
            max_tokens: 8000,
            system: systemPrompt,
            messages: [{ role: "user", content: brief }],
          });
          fullText = msg.content[0].type === "text" ? msg.content[0].text : "";
        } else {
          const googleKey = process.env.GOOGLE_AI_API_KEY;
          if (!googleKey) throw new Error("GOOGLE_AI_API_KEY is not configured in environment variables.");
          const ai = new GoogleGenAI({ apiKey: googleKey });
          const response = await ai.models.generateContent({
            model: modelId,
            contents: brief,
            config: { systemInstruction: systemPrompt, maxOutputTokens: 8000, temperature: 0.7 },
          });
          fullText = response.text ?? "";
        }
        if (fullText) { lastError = null; break; }
        lastError = new Error("No text content in AI response");
      } catch (err) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        if (!/503|UNAVAILABLE|overloaded|high demand|429|RESOURCE_EXHAUSTED|rate.limit|overload/i.test(msg)) break;
      }
    }

    if (!fullText) throw lastError ?? new Error("Generation failed after retries");
  } catch (err) {
    await sql`UPDATE content_plan SET status = ${previousStatus}, updated_at = NOW() WHERE id = ${articleId}`;
    const msg = err instanceof Error ? err.message : String(err);
    const friendly = /503|UNAVAILABLE|overloaded|high demand|rate.limit/i.test(msg)
      ? `The AI provider is overloaded. Tried 3 times with ${modelId}. Please wait a few minutes or switch models in Content Agent settings.`
      : `Generation failed: ${msg}`;
    return NextResponse.json({ error: friendly }, { status: 503 });
  }

  let metadata: { title: string; slug: string; excerpt: string; secondary_keywords?: string; word_count: number } = {
    title: article.title,
    slug: "",
    excerpt: "",
    word_count: 0,
  };

  const jsonMatch = fullText.match(/```json\s*\n([\s\S]*?)\n```/);
  let articleContent: string;

  if (jsonMatch) {
    try {
      metadata = { ...metadata, ...JSON.parse(jsonMatch[1]) };
    } catch {
      // JSON parse failed — use raw response and flag for review
    }
    const endOfJson = fullText.indexOf("```", jsonMatch.index! + 7);
    articleContent = fullText.slice(endOfJson + 3).replace(/^\n+/, "");
  } else {
    articleContent = fullText;
  }

  const slug = metadata.slug || article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const title = metadata.title || article.title;
  const excerpt = metadata.excerpt || article.target_keyword || "";

  const primaryKeyword = article.target_keyword || null;
  const secondaryKeywords = metadata.secondary_keywords || article.secondary_keywords || null;

  const existingPost = await sql`SELECT id FROM blog_posts WHERE slug = ${slug}`;

  let blogPostId: number;
  if (existingPost.rows.length > 0) {
    await sql`
      UPDATE blog_posts SET
        title = ${title},
        content = ${articleContent},
        excerpt = ${excerpt},
        author = ${"Supportive"},
        primary_keyword = ${primaryKeyword},
        secondary_keywords = ${secondaryKeywords}
      WHERE slug = ${slug}
    `;
    blogPostId = existingPost.rows[0].id as number;
  } else {
    const insertResult = await sql`
      INSERT INTO blog_posts (title, slug, content, excerpt, author, primary_keyword, secondary_keywords)
      VALUES (${title}, ${slug}, ${articleContent}, ${excerpt}, ${"Supportive"}, ${primaryKeyword}, ${secondaryKeywords})
      RETURNING id
    `;
    blogPostId = insertResult.rows[0].id as number;
  }

  const [wcMin, wcMax] = WORD_COUNT_DEFAULTS[article.content_type] || [800, 1500];
  const updateSecondaryKw = !article.secondary_keywords && metadata.secondary_keywords ? metadata.secondary_keywords : article.secondary_keywords;

  await sql`
    UPDATE content_plan SET
      slug = ${slug},
      status = 'Draft',
      secondary_keywords = ${updateSecondaryKw || null},
      target_word_count_min = COALESCE(target_word_count_min, ${wcMin}),
      target_word_count_max = COALESCE(target_word_count_max, ${wcMax}),
      updated_at = NOW()
    WHERE id = ${articleId}
  `;

  return NextResponse.json({
    ok: true,
    blogPostId,
    slug,
    title,
    excerpt,
    wordCount: metadata.word_count,
  });
}
