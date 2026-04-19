export interface RoleKeywords {
  slug: string;
  strongTitle: string[];
  strongDescription: string[];
  weakDescription: string[];
  disqualifying: string[];
}

export const ROLE_KEYWORDS: RoleKeywords[] = [
  {
    slug: "clinical-psychologist",
    strongTitle: [
      "clinical psychologist",
      "clinical psych",
      "senior psychologist",
    ],
    strongDescription: [
      "clinical psychology endorsement",
      "AHPRA.*clinical psycholog",
      "endorsed clinical psychologist",
    ],
    weakDescription: [
      "psychological assessment",
      "evidence-based therap",
      "CBT",
      "clinical supervision",
    ],
    disqualifying: [
      "provisional psychologist",
      "social worker",
      "nurse",
      "occupational therapist",
    ],
  },
  {
    slug: "psychologist",
    strongTitle: [
      "psychologist",
      "registered psychologist",
      "provisional psychologist",
    ],
    strongDescription: [
      "AHPRA registration.*psycholog",
      "psychology board",
      "general registration.*psycholog",
    ],
    weakDescription: [
      "psychological intervention",
      "therapeutic assessment",
      "mental health assessment",
    ],
    disqualifying: [
      "psychiatr",
      "social worker",
      "nurse",
      "occupational therapist",
      "peer worker",
    ],
  },
  {
    slug: "psychiatrist",
    strongTitle: [
      "psychiatrist",
      "consultant psychiatrist",
      "staff specialist.*psychiatr",
    ],
    strongDescription: [
      "RANZCP",
      "fellowship.*psychiatry",
      "psychiatric registrar",
      "medical practitioner.*psychiatr",
    ],
    weakDescription: [
      "psychiatric medication",
      "prescri",
      "ECT",
      "clozapine",
    ],
    disqualifying: [
      "psychologist",
      "nurse",
      "social worker",
    ],
  },
  {
    slug: "mental-health-nurse",
    strongTitle: [
      "mental health nurse",
      "MH nurse",
      "psychiatric nurse",
      "registered nurse.*mental health",
      "RN.*mental health",
    ],
    strongDescription: [
      "AHPRA.*nurs",
      "mental health nursing",
      "psychiatric nursing",
      "nursing registration",
    ],
    weakDescription: [
      "medication management",
      "mental state examination",
      "clinical handover",
      "nursing care",
    ],
    disqualifying: [
      "psychologist",
      "social worker",
      "occupational therapist",
    ],
  },
  {
    slug: "mental-health-occupational-therapist",
    strongTitle: [
      "occupational therapist.*mental health",
      "mental health.*occupational therapist",
      "OT.*mental health",
      "mental health OT",
    ],
    strongDescription: [
      "AHPRA.*occupational therap",
      "occupational therapy.*mental health",
      "functional capacity",
    ],
    weakDescription: [
      "daily living skills",
      "occupational engagement",
      "vocational rehabilitation",
      "sensory modulation",
    ],
    disqualifying: [
      "psychologist",
      "social worker",
      "nurse",
      "paediatric OT",
      "hand therapy",
    ],
  },
  {
    slug: "mental-health-social-worker",
    strongTitle: [
      "mental health social worker",
      "social worker.*mental health",
      "AMHSW",
      "accredited mental health social worker",
    ],
    strongDescription: [
      "AASW",
      "social work.*mental health",
      "accredited mental health social work",
    ],
    weakDescription: [
      "psychosocial assessment",
      "family therapy",
      "systemic therapy",
      "case formulation",
      "social work degree",
    ],
    disqualifying: [
      "psychologist",
      "nurse",
      "occupational therapist",
      "child protection",
    ],
  },
  {
    slug: "counsellor",
    strongTitle: [
      "counsellor",
      "counselor",
      "mental health counsellor",
      "counselling",
    ],
    strongDescription: [
      "ACA.*member",
      "PACFA.*member",
      "counselling qualification",
      "diploma.*counselling",
    ],
    weakDescription: [
      "therapeutic counselling",
      "person-centred",
      "solution-focused",
      "narrative therapy",
    ],
    disqualifying: [
      "psychologist",
      "nurse",
      "social worker",
      "financial counsellor",
      "genetic counsellor",
      "school counsellor",
    ],
  },
  {
    slug: "psychotherapist",
    strongTitle: [
      "psychotherapist",
      "psychotherapy",
    ],
    strongDescription: [
      "PACFA",
      "psychotherapy training",
      "psychodynamic",
      "schema therapy",
    ],
    weakDescription: [
      "long-term therapy",
      "therapeutic relationship",
      "DBT",
      "EMDR",
    ],
    disqualifying: [
      "massage therapist",
      "physiotherapist",
      "beauty therapist",
    ],
  },
  {
    slug: "creative-therapist",
    strongTitle: [
      "art therapist",
      "music therapist",
      "play therapist",
      "creative arts therapist",
      "drama therapist",
      "dance movement therapist",
    ],
    strongDescription: [
      "ANZATA",
      "art therapy qualification",
      "music therapy qualification",
      "registered music therapist",
    ],
    weakDescription: [
      "creative expression",
      "art-based intervention",
      "expressive therap",
    ],
    disqualifying: [
      "art teacher",
      "music teacher",
    ],
  },
  {
    slug: "eating-disorder-dietitian",
    strongTitle: [
      "dietitian.*eating disorder",
      "eating disorder.*dietitian",
      "dietician.*eating",
    ],
    strongDescription: [
      "APD.*eating",
      "accredited practising dietitian",
      "eating disorder treatment",
      "nutritional rehabilitation",
    ],
    weakDescription: [
      "disordered eating",
      "body image",
      "anorexia",
      "bulimia",
      "binge eating",
    ],
    disqualifying: [
      "sports dietitian",
      "renal dietitian",
      "diabetes educator",
    ],
  },
  {
    slug: "peer-support-worker",
    strongTitle: [
      "peer support worker",
      "peer worker",
      "peer specialist",
      "consumer peer worker",
      "carer peer worker",
    ],
    strongDescription: [
      "lived experience.*peer",
      "peer work.*qualification",
      "Certificate IV.*peer work",
      "Cert IV.*mental health peer",
    ],
    weakDescription: [
      "lived experience",
      "consumer perspective",
      "recovery support",
    ],
    disqualifying: [
      "psychologist",
      "nurse",
      "social worker",
      "psychiatrist",
    ],
  },
  {
    slug: "lived-experience-worker",
    strongTitle: [
      "lived experience worker",
      "lived experience consultant",
      "consumer consultant",
      "carer consultant",
      "lived experience coordinator",
      "consumer representative",
    ],
    strongDescription: [
      "lived experience.*workforce",
      "consumer participation",
      "consumer engagement",
    ],
    weakDescription: [
      "personal recovery journey",
      "co-design",
      "consumer advocate",
    ],
    disqualifying: [
      "psychologist",
      "nurse",
      "social worker",
    ],
  },
  {
    slug: "mental-health-support-worker",
    strongTitle: [
      "mental health support worker",
      "support worker.*mental health",
      "NDIS.*support worker.*mental",
      "psychosocial support worker",
      "community support worker.*mental",
    ],
    strongDescription: [
      "NDIS.*psychosocial",
      "mental health.*support",
      "community mental health.*support",
    ],
    weakDescription: [
      "daily living support",
      "community access",
      "recovery-oriented",
      "NDIS participant",
    ],
    disqualifying: [
      "psychologist",
      "nurse",
      "disability.*physical",
      "aged care",
    ],
  },
  {
    slug: "aod-worker",
    strongTitle: [
      "AOD worker",
      "AOD counsellor",
      "AOD clinician",
      "alcohol.*drug.*worker",
      "drug.*alcohol.*worker",
      "D&A worker",
      "D&A clinician",
      "substance.*use.*worker",
      "alcohol.*other.*drug",
    ],
    strongDescription: [
      "Certificate IV.*alcohol.*other.*drug",
      "Cert IV.*AOD",
      "AOD sector",
      "addiction.*treatment",
    ],
    weakDescription: [
      "motivational interviewing",
      "withdrawal management",
      "harm reduction",
      "detox",
      "rehabilitation",
      "substance use",
    ],
    disqualifying: [
      "psychologist",
      "psychiatrist",
      "nurse.*only",
    ],
  },
  {
    slug: "youth-mental-health-worker",
    strongTitle: [
      "youth mental health worker",
      "youth worker.*mental health",
      "CAMHS.*worker",
      "child.*adolescent.*mental health",
      "headspace.*clinician",
      "headspace.*worker",
    ],
    strongDescription: [
      "CAMHS",
      "child.*adolescent.*mental health",
      "headspace",
      "youth mental health",
    ],
    weakDescription: [
      "young people",
      "youth engagement",
      "early intervention",
      "youth-specific",
    ],
    disqualifying: [
      "aged care",
      "geriatric",
    ],
  },
  {
    slug: "case-manager",
    strongTitle: [
      "case manager.*mental health",
      "mental health.*case manager",
      "care coordinator.*mental health",
      "mental health.*care coordinator",
      "clinical care coordinator",
    ],
    strongDescription: [
      "case management.*mental health",
      "care coordination",
      "NDIS.*care coordination",
    ],
    weakDescription: [
      "care plan",
      "service coordination",
      "intake assessment",
      "referral pathway",
    ],
    disqualifying: [
      "insurance case manager",
      "workers compensation",
      "property manager",
    ],
  },
  {
    slug: "clinical-lead",
    strongTitle: [
      "clinical lead.*mental health",
      "mental health.*clinical lead",
      "team leader.*mental health",
      "mental health.*team leader",
      "clinical manager.*mental health",
      "senior clinician.*mental health",
      "program manager.*mental health",
    ],
    strongDescription: [
      "clinical leadership",
      "team leadership.*mental health",
      "clinical governance",
      "practice lead",
    ],
    weakDescription: [
      "supervise clinicians",
      "manage a team",
      "service delivery",
      "quality improvement",
    ],
    disqualifying: [
      "IT team leader",
      "sales manager",
      "warehouse",
    ],
  },
  {
    slug: "mental-health-educator",
    strongTitle: [
      "mental health educator",
      "mental health trainer",
      "mental health first aid.*instructor",
      "MHFA.*instructor",
      "mental health promotion",
    ],
    strongDescription: [
      "mental health training",
      "workforce development.*mental health",
      "mental health literacy",
    ],
    weakDescription: [
      "training delivery",
      "psychoeducation",
      "community education",
      "health promotion",
    ],
    disqualifying: [
      "school teacher",
      "lecturer.*university",
      "academic",
    ],
  },
];
