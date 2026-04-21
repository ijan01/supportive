export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
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
  slug: string;
  state: AUState | null;
}

export const AU_LOCATIONS: Location[] = [
  // Capital cities
  { name: "Sydney, NSW", slug: "sydney-nsw", state: "NSW" },
  { name: "Melbourne, VIC", slug: "melbourne-vic", state: "VIC" },
  { name: "Brisbane, QLD", slug: "brisbane-qld", state: "QLD" },
  { name: "Perth, WA", slug: "perth-wa", state: "WA" },
  { name: "Adelaide, SA", slug: "adelaide-sa", state: "SA" },
  { name: "Canberra, ACT", slug: "canberra-act", state: "ACT" },
  { name: "Hobart, TAS", slug: "hobart-tas", state: "TAS" },
  { name: "Darwin, NT", slug: "darwin-nt", state: "NT" },
  // NSW regional
  { name: "Newcastle, NSW", slug: "newcastle-nsw", state: "NSW" },
  { name: "Wollongong, NSW", slug: "wollongong-nsw", state: "NSW" },
  { name: "Central Coast, NSW", slug: "central-coast-nsw", state: "NSW" },
  { name: "Albury, NSW", slug: "albury-nsw", state: "NSW" },
  { name: "Wagga Wagga, NSW", slug: "wagga-wagga-nsw", state: "NSW" },
  { name: "Tamworth, NSW", slug: "tamworth-nsw", state: "NSW" },
  { name: "Port Macquarie, NSW", slug: "port-macquarie-nsw", state: "NSW" },
  { name: "Coffs Harbour, NSW", slug: "coffs-harbour-nsw", state: "NSW" },
  { name: "Lismore, NSW", slug: "lismore-nsw", state: "NSW" },
  { name: "Dubbo, NSW", slug: "dubbo-nsw", state: "NSW" },
  { name: "Orange, NSW", slug: "orange-nsw", state: "NSW" },
  { name: "Bathurst, NSW", slug: "bathurst-nsw", state: "NSW" },
  { name: "Goulburn, NSW", slug: "goulburn-nsw", state: "NSW" },
  // VIC regional
  { name: "Geelong, VIC", slug: "geelong-vic", state: "VIC" },
  { name: "Ballarat, VIC", slug: "ballarat-vic", state: "VIC" },
  { name: "Bendigo, VIC", slug: "bendigo-vic", state: "VIC" },
  { name: "Shepparton, VIC", slug: "shepparton-vic", state: "VIC" },
  { name: "Warrnambool, VIC", slug: "warrnambool-vic", state: "VIC" },
  { name: "Mildura, VIC", slug: "mildura-vic", state: "VIC" },
  // QLD regional
  { name: "Gold Coast, QLD", slug: "gold-coast-qld", state: "QLD" },
  { name: "Sunshine Coast, QLD", slug: "sunshine-coast-qld", state: "QLD" },
  { name: "Townsville, QLD", slug: "townsville-qld", state: "QLD" },
  { name: "Cairns, QLD", slug: "cairns-qld", state: "QLD" },
  { name: "Toowoomba, QLD", slug: "toowoomba-qld", state: "QLD" },
  { name: "Rockhampton, QLD", slug: "rockhampton-qld", state: "QLD" },
  { name: "Bundaberg, QLD", slug: "bundaberg-qld", state: "QLD" },
  { name: "Mackay, QLD", slug: "mackay-qld", state: "QLD" },
  // SA regional
  { name: "Mount Gambier, SA", slug: "mount-gambier-sa", state: "SA" },
  // WA regional
  { name: "Bunbury, WA", slug: "bunbury-wa", state: "WA" },
  { name: "Geraldton, WA", slug: "geraldton-wa", state: "WA" },
  { name: "Kalgoorlie, WA", slug: "kalgoorlie-wa", state: "WA" },
  // TAS regional
  { name: "Launceston, TAS", slug: "launceston-tas", state: "TAS" },
  // NT regional
  { name: "Alice Springs, NT", slug: "alice-springs-nt", state: "NT" },
  // Work arrangements
  { name: "Remote (Australia)", slug: "remote-australia", state: null },
  { name: "Hybrid", slug: "hybrid", state: null },
];

export const LOCATIONS = AU_LOCATIONS.map((l) => l.name) as unknown as readonly string[];

export interface Specialty {
  name: string;
  slug: string;
}

export const AU_SPECIALTIES: Specialty[] = [
  { name: "AOD / Addiction", slug: "aod-addiction" },
  { name: "Youth Mental Health", slug: "youth-mental-health" },
  { name: "Perinatal Mental Health", slug: "perinatal-mental-health" },
  { name: "Eating Disorders", slug: "eating-disorders" },
  { name: "Suicide Prevention", slug: "suicide-prevention" },
  { name: "Trauma", slug: "trauma" },
  { name: "Forensic Mental Health", slug: "forensic-mental-health" },
  { name: "Aboriginal & Torres Strait Islander Mental Health", slug: "atsi-mental-health" },
  { name: "LGBTQIA+ Mental Health", slug: "lgbtqia-mental-health" },
  { name: "Rural & Remote", slug: "rural-remote" },
];

export const JOB_TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-violet-100 text-violet-700",
  "Part-time": "bg-emerald-100 text-emerald-700",
  "Contract": "bg-amber-100 text-amber-700",
  "Remote": "bg-cyan-100 text-cyan-700",
  "Internship": "bg-pink-100 text-pink-700",
};

export interface ListingTierDef {
  value: string;
  label: string;
  price: number;
  duration: number;
  badgeLabel: string | null;
  badgeColor: string;
  description: string;
  features: string[];
}

export const LISTING_TIERS: ListingTierDef[] = [
  {
    value: "basic",
    label: "Basic",
    price: 0,
    duration: 28,
    badgeLabel: null,
    badgeColor: "",
    description: "Standard listing visible in search results for 28 days.",
    features: [
      "Listed in search results",
      "Appears on role and location pages",
      "28-day listing duration",
    ],
  },
  {
    value: "premium",
    label: "Premium",
    price: 14900,
    duration: 28,
    badgeLabel: "Premium",
    badgeColor: "bg-pink-500 text-white",
    description: "Top performing ad, for critical & hard-to-fill roles.",
    features: [
      "\"Recommended\" badge on your listing",
      "Ranked above Basic listings",
      "28-day listing duration",
      "Included in weekly job alert emails",
      "Enhanced visibility on role pages",
    ],
  },
  {
    value: "sponsored",
    label: "Sponsored",
    price: 7900,
    duration: 14,
    badgeLabel: "Sponsored",
    badgeColor: "bg-emerald-600 text-white",
    description: "Boost any listing to the top of results for 14 days.",
    features: [
      "\"Sponsored\" badge on your listing",
      "Pinned to the top of search results",
      "14-day sponsored placement",
      "Promoted on social media channels",
    ],
  },
];

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  shortlisted: "bg-violet-100 text-violet-700",
  contacted: "bg-cyan-100 text-cyan-700",
  rejected: "bg-red-100 text-red-700",
  accepted: "bg-green-100 text-green-700",
};

export interface BenefitDef {
  slug: string;
  label: string;
  group: "remuneration" | "professional";
}

export const EMPLOYER_BENEFITS: BenefitDef[] = [
  // Remuneration & Leave
  { slug: "salary-packaging", label: "Salary packaging available", group: "remuneration" },
  { slug: "above-award-pay", label: "Above-award pay", group: "remuneration" },
  { slug: "flexible-hybrid", label: "Flexible / hybrid working", group: "remuneration" },
  { slug: "telehealth-option", label: "Telehealth option available", group: "remuneration" },
  { slug: "relocation-support", label: "Relocation support", group: "remuneration" },
  { slug: "rural-incentives", label: "Rural incentive payments", group: "remuneration" },
  { slug: "car-travel-allowance", label: "Car / travel allowance", group: "remuneration" },
  { slug: "above-minimum-parental", label: "Paid parental leave (above minimum)", group: "remuneration" },
  { slug: "wellbeing-leave", label: "Wellbeing / mental health days", group: "remuneration" },
  // Professional Support
  { slug: "paid-pd", label: "Paid professional development", group: "professional" },
  { slug: "paid-supervision", label: "Paid clinical supervision", group: "professional" },
  { slug: "supervision-provided", label: "Supervision provided (for provisional registrants)", group: "professional" },
  { slug: "ahpra-fees-covered", label: "AHPRA registration fees covered", group: "professional" },
  { slug: "conference-attendance", label: "Paid conference attendance", group: "professional" },
  { slug: "eap", label: "Employee assistance programme", group: "professional" },
];

export const BENEFITS_PRIORITY = [
  "supervision-provided",
  "paid-supervision",
  "salary-packaging",
  "above-award-pay",
  "flexible-hybrid",
];

export interface OrgTypeDef {
  value: string;
  label: string;
  color: string;
}

export const ORGANISATION_TYPES: OrgTypeDef[] = [
  { value: "private-practice", label: "Private Practice", color: "bg-teal-100 text-teal-700" },
  { value: "ndis-provider", label: "NDIS Provider", color: "bg-purple-100 text-purple-700" },
  { value: "community-nfp", label: "Community NFP", color: "bg-green-100 text-green-700" },
  { value: "government", label: "Government", color: "bg-blue-100 text-blue-700" },
  { value: "hospital", label: "Hospital / Health Service", color: "bg-red-100 text-red-700" },
  { value: "education", label: "Education", color: "bg-amber-100 text-amber-700" },
  { value: "eap-provider", label: "EAP Provider", color: "bg-orange-100 text-orange-700" },
  { value: "recruitment-agency", label: "Recruitment", color: "bg-slate-100 text-slate-700" },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-600" },
];
