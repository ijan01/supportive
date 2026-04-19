export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Internship",
] as const;

export interface MHRole {
  name: string;
  slug: string;
  group: "clinical" | "allied-health" | "community-ndis" | "leadership";
}

export const MH_ROLE_GROUPS = [
  { slug: "clinical" as const, label: "Clinical" },
  { slug: "allied-health" as const, label: "Allied health" },
  { slug: "community-ndis" as const, label: "Community / NDIS" },
  { slug: "leadership" as const, label: "Leadership & specialist" },
];

export const MH_ROLES: MHRole[] = [
  { name: "Psychologist", slug: "psychologist", group: "clinical" },
  { name: "Clinical Psychologist", slug: "clinical-psychologist", group: "clinical" },
  { name: "Psychiatrist", slug: "psychiatrist", group: "clinical" },
  { name: "Mental Health Nurse", slug: "mental-health-nurse", group: "clinical" },
  { name: "Mental Health Occupational Therapist", slug: "mental-health-occupational-therapist", group: "clinical" },
  { name: "Mental Health Social Worker", slug: "mental-health-social-worker", group: "allied-health" },
  { name: "Counsellor", slug: "counsellor", group: "allied-health" },
  { name: "Psychotherapist", slug: "psychotherapist", group: "allied-health" },
  { name: "Art / Music / Play Therapist", slug: "creative-therapist", group: "allied-health" },
  { name: "Dietitian (Eating Disorders)", slug: "eating-disorder-dietitian", group: "allied-health" },
  { name: "Peer Support Worker", slug: "peer-support-worker", group: "community-ndis" },
  { name: "Lived Experience Worker", slug: "lived-experience-worker", group: "community-ndis" },
  { name: "Support Worker (Mental Health)", slug: "mental-health-support-worker", group: "community-ndis" },
  { name: "AOD Worker", slug: "aod-worker", group: "community-ndis" },
  { name: "Youth Mental Health Worker", slug: "youth-mental-health-worker", group: "community-ndis" },
  { name: "Case Manager / Care Coordinator", slug: "case-manager", group: "community-ndis" },
  { name: "Clinical Lead / Team Leader", slug: "clinical-lead", group: "leadership" },
  { name: "Mental Health Educator / Trainer", slug: "mental-health-educator", group: "leadership" },
];

export const JOB_CATEGORIES = MH_ROLES.map((r) => r.name) as unknown as readonly string[];

export const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "ACT", "TAS", "NT"] as const;
export type AUState = (typeof AU_STATES)[number];

export interface Location {
  name: string;
  state: AUState | null;
}

export const AU_LOCATIONS: Location[] = [
  { name: "Sydney, NSW", state: "NSW" },
  { name: "Melbourne, VIC", state: "VIC" },
  { name: "Brisbane, QLD", state: "QLD" },
  { name: "Perth, WA", state: "WA" },
  { name: "Adelaide, SA", state: "SA" },
  { name: "Canberra, ACT", state: "ACT" },
  { name: "Hobart, TAS", state: "TAS" },
  { name: "Darwin, NT", state: "NT" },
  { name: "Newcastle, NSW", state: "NSW" },
  { name: "Wollongong, NSW", state: "NSW" },
  { name: "Gold Coast, QLD", state: "QLD" },
  { name: "Geelong, VIC", state: "VIC" },
  { name: "Remote (Australia)", state: null },
  { name: "Hybrid", state: null },
];

export const LOCATIONS = AU_LOCATIONS.map((l) => l.name) as unknown as readonly string[];

export const JOB_TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-violet-100 text-violet-700",
  "Part-time": "bg-emerald-100 text-emerald-700",
  "Contract": "bg-amber-100 text-amber-700",
  "Remote": "bg-cyan-100 text-cyan-700",
  "Internship": "bg-pink-100 text-pink-700",
};

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  accepted: "bg-green-100 text-green-700",
};
