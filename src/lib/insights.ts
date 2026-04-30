import { sql } from "./db";
import type { JobWithEmployer } from "./types";

export interface Faq {
  question: string;
  answer: string;
}

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return response.text ?? null;
  } catch {
    return null;
  }
}

export async function getJobFaqs(job: JobWithEmployer): Promise<Faq[] | null> {
  // Return cached FAQs if already generated
  const cached = await sql`SELECT faqs FROM jobs WHERE id = ${job.id} AND faqs IS NOT NULL`;
  if (cached.rows[0]?.faqs) {
    return cached.rows[0].faqs as Faq[];
  }

  const prompt = `Generate exactly 5 frequently asked questions and answers for a "${job.title}" role at ${job.company} in ${job.location}, in the Australian mental health and community services sector.

Questions should be practical and useful for someone considering applying — cover things like work environment, career development, required qualifications, typical day-to-day responsibilities, and what makes the role rewarding.

Keep answers to 2-3 sentences each. Write naturally in Australian English.

Return ONLY a valid JSON array with objects having "question" and "answer" keys. No markdown, no explanation, just the JSON array.`;

  const raw = await callGemini(prompt);
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const faqs = JSON.parse(cleaned) as Faq[];
    if (!Array.isArray(faqs) || faqs.length === 0) return null;

    await sql`UPDATE jobs SET faqs = ${JSON.stringify(faqs)}::jsonb WHERE id = ${job.id}`.catch(() => {});
    return faqs;
  } catch {
    return null;
  }
}

export async function getLocationSummary(city: string, state: string): Promise<string | null> {
  const cached = await sql`SELECT summary FROM location_insights WHERE city = ${city}`;
  if (cached.rows[0]?.summary) {
    return cached.rows[0].summary as string;
  }

  const prompt = `Write exactly 2 sentences describing what it's like to work in ${city}, ${state} as a mental health or community services professional in Australia. Mention the area's character, access to amenities, and what makes it a good base for this kind of work. Australian English. No marketing fluff.`;

  const summary = await callGemini(prompt);
  if (!summary) return null;

  const trimmed = summary.trim();
  await sql`
    INSERT INTO location_insights (city, state, summary, generated_at)
    VALUES (${city}, ${state}, ${trimmed}, NOW())
    ON CONFLICT (city) DO UPDATE SET summary = ${trimmed}, generated_at = NOW()
  `.catch(() => {});

  return trimmed;
}
