import { ROLE_KEYWORDS, RoleKeywords } from "./role-keywords.js";

export interface ClassificationResult {
  roleSlug: string;
  confidence: number;
}

const ELIGIBILITY_TERMS = [
  "mental health",
  "peer worker", "peer support", "lived experience",
  "psychologist", "psychology", "clinical psych",
  "psychiatrist", "psychiatry",
  "counsellor", "counselling", "counselor", "counseling",
  "psychotherapist", "psychotherapy",
  "mental health nurse", "MH nurse", "psychiatric nurse",
  "mental health social work",
  "AOD", "alcohol and other drugs", "drug and alcohol", "D&A worker",
  "NDIS mental health", "NDIS support worker",
  "youth mental health", "CAMHS",
  "eating disorder", "disordered eating",
  "suicide prevention", "postvention",
  "trauma", "PTSD specialist",
  "perinatal mental health",
  "art therapist", "music therapist", "play therapist",
  "occupational therapist.*mental health",
];

function matchesAny(text: string, patterns: string[]): boolean {
  return patterns.some((p) => new RegExp(p, "i").test(text));
}

function countMatches(text: string, patterns: string[]): number {
  return patterns.filter((p) => new RegExp(p, "i").test(text)).length;
}

export function isEligible(title: string, description: string): boolean {
  const combined = `${title} ${description}`;
  return matchesAny(combined, ELIGIBILITY_TERMS);
}

function scoreRole(
  title: string,
  description: string,
  keywords: RoleKeywords
): number {
  if (matchesAny(title, keywords.disqualifying) || matchesAny(description, keywords.disqualifying)) {
    return 0;
  }

  let score = 0;

  const titleStrongHits = countMatches(title, keywords.strongTitle);
  score += titleStrongHits * 0.4;

  const descStrongHits = countMatches(description, keywords.strongDescription);
  score += descStrongHits * 0.2;

  const descWeakHits = countMatches(description, keywords.weakDescription);
  score += descWeakHits * 0.05;

  return Math.min(score, 1);
}

export function classifyJob(
  title: string,
  description: string
): ClassificationResult | null {
  if (!isEligible(title, description)) return null;

  let bestSlug = "";
  let bestScore = 0;

  for (const keywords of ROLE_KEYWORDS) {
    const score = scoreRole(title, description, keywords);
    if (score > bestScore) {
      bestScore = score;
      bestSlug = keywords.slug;
    }
  }

  if (bestScore === 0) return null;

  return { roleSlug: bestSlug, confidence: Math.round(bestScore * 100) / 100 };
}

export function classifyJobStatus(confidence: number): "active" | "review_queue" | "rejected" {
  if (confidence >= 0.7) return "active";
  if (confidence >= 0.4) return "review_queue";
  return "rejected";
}
