export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Internship",
] as const;

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Product",
  "Data Science",
  "DevOps",
  "Customer Support",
  "Finance",
  "Human Resources",
] as const;

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
