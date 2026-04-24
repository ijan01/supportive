import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { sql } from "@/lib/db";
import { SITE_URL } from "@/lib/config";

export const maxDuration = 60;

interface SeedArticle {
  n: number;
  title: string;
  type: "PILLAR" | "CLUSTER" | "CONVERSION";
  keyword: string;
  role: string | null;
  parent: number | null;
  status?: "Published";
  slug?: string;
}

const ARTICLES: SeedArticle[] = [
  // PSYCHOLOGIST GROUP
  { n: 1, title: "Psychologist Salary Guide Australia 2026", type: "PILLAR", keyword: "psychologist salary australia", role: "psychologist", parent: null },
  { n: 2, title: "How to Become a Psychologist in Australia", type: "PILLAR", keyword: "how to become a psychologist australia", role: "psychologist", parent: null, status: "Published", slug: "/how-to-become-psychologist-australia" },
  { n: 3, title: "Clinical Psychologist vs General Psychologist: Career Paths Compared", type: "CLUSTER", keyword: "clinical vs general psychologist", role: "clinical-psychologist", parent: 1 },
  { n: 4, title: "Psychologist Salary by State: Where You'll Earn the Most", type: "CLUSTER", keyword: "psychologist salary by state", role: "psychologist", parent: 1 },
  { n: 5, title: "Private Practice vs Hospital: Which Path is Right for You?", type: "CLUSTER", keyword: "private practice psychologist", role: "psychologist", parent: 1 },
  { n: 6, title: "NDIS Psychologist Billing Rates and What to Expect", type: "CLUSTER", keyword: "ndis psychologist rates", role: "psychologist", parent: 1 },
  { n: 7, title: "Provisional Psychologist Supervision: A Practical Guide", type: "CLUSTER", keyword: "provisional psychologist supervision", role: "psychologist", parent: 2 },
  { n: 8, title: "Medicare Better Access: What Mental Health Professionals Need to Know", type: "CLUSTER", keyword: "medicare better access mental health", role: "psychologist", parent: 1 },
  // COUNSELLOR GROUP
  { n: 9, title: "Counsellor Salary Guide Australia 2026", type: "PILLAR", keyword: "counsellor salary australia", role: "counsellor", parent: null },
  { n: 10, title: "How to Become a Counsellor in Australia: ACA vs PACFA Pathways", type: "PILLAR", keyword: "how to become a counsellor australia", role: "counsellor", parent: null },
  { n: 11, title: "Mental Health Counsellor vs Psychologist: What's the Difference?", type: "CLUSTER", keyword: "counsellor vs psychologist", role: "counsellor", parent: 9 },
  { n: 12, title: "Telehealth Counselling Jobs: What You Need to Know", type: "CLUSTER", keyword: "telehealth counsellor jobs", role: "counsellor", parent: 9 },
  { n: 13, title: "ACA Membership Levels Explained: Which Level Do You Need?", type: "CLUSTER", keyword: "aca membership levels", role: "counsellor", parent: 10 },
  { n: 14, title: "Relationship Counselling Careers: Working with Couples and Families", type: "CLUSTER", keyword: "relationship counselling career", role: "family-relationship-therapist", parent: 9 },
  // MENTAL HEALTH NURSE GROUP
  { n: 15, title: "Mental Health Nurse Salary Guide Australia 2026", type: "PILLAR", keyword: "mental health nurse salary australia", role: "mental-health-nurse", parent: null },
  { n: 16, title: "How to Become a Mental Health Nurse in Australia", type: "PILLAR", keyword: "how to become mental health nurse", role: "mental-health-nurse", parent: null },
  { n: 17, title: "Credentialled Mental Health Nurse: What It Means and How to Get There", type: "CLUSTER", keyword: "credentialled mental health nurse", role: "mental-health-nurse", parent: 16 },
  { n: 18, title: "Mental Health Nurse vs Psychologist: Two Paths to the Same Goal", type: "CLUSTER", keyword: "mental health nurse vs psychologist", role: "mental-health-nurse", parent: 15 },
  { n: 19, title: "Agency and Locum Mental Health Nursing: Is It Right for You?", type: "CLUSTER", keyword: "locum mental health nurse", role: "mental-health-nurse", parent: 15 },
  { n: 20, title: "Rural Mental Health Nursing: Incentives, Challenges, and How to Find Roles", type: "CLUSTER", keyword: "rural mental health nurse", role: "mental-health-nurse", parent: 15 },
  // SOCIAL WORKER GROUP
  { n: 21, title: "Social Worker Salary Guide Australia 2026", type: "PILLAR", keyword: "social worker salary australia", role: "social-worker", parent: null },
  { n: 22, title: "How to Become a Mental Health Social Worker: AASW Pathway Explained", type: "PILLAR", keyword: "mental health social worker accreditation", role: "social-worker", parent: null },
  { n: 23, title: "Hospital vs Community Social Work: Comparing Two Career Paths", type: "CLUSTER", keyword: "hospital social worker vs community", role: "social-worker", parent: 21 },
  { n: 24, title: "AMHSW Credential: How Accredited Mental Health Social Workers Can Bill Medicare", type: "CLUSTER", keyword: "accredited mental health social worker", role: "social-worker", parent: 22 },
  { n: 25, title: "Child Protection Social Work: Salary, Stress, and Career Progression", type: "CLUSTER", keyword: "child protection social worker salary", role: "social-worker", parent: 21 },
  { n: 26, title: "NDIS Social Work: What the Role Involves and What You'll Earn", type: "CLUSTER", keyword: "ndis social worker", role: "social-worker", parent: 21 },
  // OCCUPATIONAL THERAPIST GROUP
  { n: 27, title: "Occupational Therapist Salary Guide Australia 2026 (Mental Health Focus)", type: "PILLAR", keyword: "occupational therapist salary mental health", role: "occupational-therapist", parent: null },
  { n: 28, title: "Mental Health OT vs Physical Rehab OT: Which Path Should You Choose?", type: "CLUSTER", keyword: "mental health occupational therapist", role: "occupational-therapist", parent: 27 },
  { n: 29, title: "NDIS Occupational Therapist: Roles, Rates, and Career Outlook", type: "CLUSTER", keyword: "ndis occupational therapist", role: "occupational-therapist", parent: 27 },
  // BEHAVIOUR SUPPORT GROUP
  { n: 30, title: "Behaviour Support Practitioner Salary Guide Australia 2026", type: "PILLAR", keyword: "behaviour support practitioner salary", role: "behaviour-support-practitioner", parent: null },
  { n: 31, title: "How to Become a Behaviour Support Practitioner in Australia", type: "PILLAR", keyword: "how to become behaviour support practitioner", role: "behaviour-support-practitioner", parent: null },
  { n: 32, title: "Understanding the NDIS for Mental Health Workers", type: "CLUSTER", keyword: "ndis mental health workers", role: "behaviour-support-practitioner", parent: 30, status: "Published", slug: "/understanding-ndis-mental-health-workers" },
  { n: 33, title: "Core vs Specialist BSP: NDIS Registration Levels Explained", type: "CLUSTER", keyword: "ndis behaviour support registration", role: "behaviour-support-practitioner", parent: 31 },
  { n: 34, title: "Positive Behaviour Support Plans: What BSPs Actually Do Day to Day", type: "CLUSTER", keyword: "positive behaviour support plan", role: "behaviour-support-practitioner", parent: 30 },
  { n: 35, title: "Restrictive Practices and BSPs: Understanding the Legal Framework", type: "CLUSTER", keyword: "restrictive practices ndis", role: "behaviour-support-practitioner", parent: 31 },
  // DRUG & ALCOHOL GROUP
  { n: 36, title: "AOD Worker Salary Guide Australia 2026", type: "PILLAR", keyword: "aod worker salary australia", role: "drug-alcohol-worker", parent: null },
  { n: 37, title: "How to Become a Drug and Alcohol Counsellor in Australia", type: "PILLAR", keyword: "how to become drug alcohol counsellor", role: "drug-alcohol-worker", parent: null },
  { n: 38, title: "Certificate IV in Alcohol and Other Drugs: Is It Worth It?", type: "CLUSTER", keyword: "cert iv alcohol other drugs", role: "drug-alcohol-worker", parent: 37 },
  { n: 39, title: "AOD vs Mental Health: Are They Really Different Careers?", type: "CLUSTER", keyword: "aod vs mental health worker", role: "drug-alcohol-worker", parent: 36 },
  { n: 40, title: "Dual Diagnosis Work: Careers Supporting People with Co-Occurring MH and Substance Issues", type: "CLUSTER", keyword: "dual diagnosis worker", role: "drug-alcohol-worker", parent: 36 },
  { n: 41, title: "Lived Experience in AOD: How Personal Recovery Becomes Professional Expertise", type: "CLUSTER", keyword: "lived experience aod worker", role: "drug-alcohol-worker", parent: 36 },
  // PEER SUPPORT & LIVED EXPERIENCE GROUP
  { n: 42, title: "Peer Support Worker Salary Guide Australia 2026", type: "PILLAR", keyword: "peer support worker salary", role: "peer-support-worker", parent: null },
  { n: 43, title: "Lived Experience Worker Careers: A Growing Profession in Australian Mental Health", type: "PILLAR", keyword: "lived experience worker mental health", role: "lived-experience-worker", parent: null },
  { n: 44, title: "What is a Peer Support Worker? A Guide to Peer Work in Australia", type: "CLUSTER", keyword: "peer support worker australia", role: "peer-support-worker", parent: 42, status: "Published", slug: "/what-is-peer-support-worker-australia" },
  { n: 45, title: "Cert IV in Mental Health Peer Work: What You Need to Know", type: "CLUSTER", keyword: "cert iv mental health peer work", role: "peer-support-worker", parent: 42 },
  { n: 46, title: "Consumer Consultant vs Peer Support Worker: Understanding the Difference", type: "CLUSTER", keyword: "consumer consultant mental health", role: "lived-experience-worker", parent: 43 },
  { n: 47, title: "Psychosocial Recovery Coach: What the Role Involves and How to Get Started", type: "CLUSTER", keyword: "psychosocial recovery coach", role: "psychosocial-recovery-coach", parent: 42 },
  // YOUTH MENTAL HEALTH GROUP
  { n: 48, title: "Youth Worker Salary Guide Australia 2026", type: "PILLAR", keyword: "youth worker salary australia", role: "youth-worker-mh", parent: null },
  { n: 49, title: "How to Become a Youth Worker in Mental Health", type: "PILLAR", keyword: "how to become youth worker australia", role: "youth-worker-mh", parent: null },
  { n: 50, title: "Working at headspace: What to Expect", type: "CLUSTER", keyword: "working at headspace", role: "youth-worker-mh", parent: 48 },
  { n: 51, title: "Youth Mental Health vs Adult Mental Health: Comparing Two Career Paths", type: "CLUSTER", keyword: "youth mental health career", role: "youth-worker-mh", parent: 48 },
  { n: 52, title: "School-Based Youth Health Workers: Careers in Education Settings", type: "CLUSTER", keyword: "school based youth health worker", role: "youth-worker-mh", parent: 49 },
  // ALLIED HEALTH ASSISTANT GROUP
  { n: 53, title: "Allied Health Assistant Salary Guide Australia 2026", type: "PILLAR", keyword: "allied health assistant salary", role: "allied-health-assistant", parent: null },
  { n: 54, title: "How to Become an Allied Health Assistant in Mental Health", type: "PILLAR", keyword: "allied health assistant mental health", role: "allied-health-assistant", parent: null },
  { n: 55, title: "AHA vs Registered Clinician: Understanding Scope of Practice and Supervision", type: "CLUSTER", keyword: "allied health assistant scope of practice", role: "allied-health-assistant", parent: 54 },
  { n: 56, title: "NDIS Allied Health Assistant: A Growing Role in Disability Support", type: "CLUSTER", keyword: "ndis allied health assistant", role: "allied-health-assistant", parent: 53 },
  // ART/MUSIC THERAPY GROUP
  { n: 57, title: "Art Therapist and Music Therapist Salary Guide Australia 2026", type: "PILLAR", keyword: "art therapist salary australia", role: "art-music-therapist", parent: null },
  { n: 58, title: "How to Become an Art Therapist in Australia", type: "PILLAR", keyword: "how to become art therapist australia", role: "art-music-therapist", parent: null },
  { n: 59, title: "Music Therapy vs Art Therapy: Choosing Your Creative Therapy Career", type: "CLUSTER", keyword: "music therapy vs art therapy", role: "art-music-therapist", parent: 57 },
  { n: 60, title: "ANZACATA Registration: What Creative Arts Therapists Need to Know", type: "CLUSTER", keyword: "anzacata registration", role: "art-music-therapist", parent: 58 },
  // EXERCISE PHYSIOLOGY GROUP
  { n: 61, title: "Exercise Physiologist Salary Guide Australia 2026", type: "PILLAR", keyword: "exercise physiologist salary australia", role: "exercise-physiologist-mh", parent: null },
  { n: 62, title: "Exercise Physiology and Mental Health: A Career at the Intersection", type: "PILLAR", keyword: "exercise physiology mental health", role: "exercise-physiologist-mh", parent: null },
  { n: 63, title: "NDIS Exercise Physiologist: What the Role Involves and What You'll Earn", type: "CLUSTER", keyword: "ndis exercise physiologist", role: "exercise-physiologist-mh", parent: 61 },
  // FAMILY & RELATIONSHIP THERAPY GROUP
  { n: 64, title: "Family Therapist Salary Guide Australia 2026", type: "PILLAR", keyword: "family therapist salary australia", role: "family-relationship-therapist", parent: null },
  { n: 65, title: "How to Become a Family Therapist in Australia", type: "PILLAR", keyword: "how to become family therapist australia", role: "family-relationship-therapist", parent: null },
  { n: 66, title: "Working at Relationships Australia: Careers, Salary, and Culture", type: "CLUSTER", keyword: "relationships australia careers", role: "family-relationship-therapist", parent: 64 },
  { n: 67, title: "EAP Counsellor Roles: Working in Employee Assistance Programmes", type: "CLUSTER", keyword: "eap counsellor jobs australia", role: "family-relationship-therapist", parent: 64 },
  // PSYCHIATRIST GROUP
  { n: 68, title: "Psychiatrist Salary Guide Australia 2026", type: "PILLAR", keyword: "psychiatrist salary australia", role: "psychiatrist", parent: null },
  { n: 69, title: "How to Become a Psychiatrist in Australia: The RANZCP Pathway", type: "PILLAR", keyword: "how to become psychiatrist australia", role: "psychiatrist", parent: null },
  { n: 70, title: "Child and Adolescent Psychiatry vs Adult: Comparing Two Specialisations", type: "CLUSTER", keyword: "child adolescent psychiatrist", role: "psychiatrist", parent: 68 },
  { n: 71, title: "Rural Psychiatry: Addressing Australia's Most Acute Workforce Shortage", type: "CLUSTER", keyword: "rural psychiatrist australia", role: "psychiatrist", parent: 68 },
  // CROSS-ROLE / SECTOR PILLARS
  { n: 72, title: "Mental Health Salary Guide Australia 2026: All Roles Compared", type: "PILLAR", keyword: "mental health salary guide australia", role: null, parent: null, status: "Published", slug: "/mental-health-salary-guide-australia-2026" },
  { n: 73, title: "AHPRA Registration Explained: What Mental Health Workers Need to Know", type: "PILLAR", keyword: "ahpra registration mental health", role: null, parent: null },
  { n: 74, title: "Telehealth in Mental Health: The Complete Guide for Practitioners", type: "PILLAR", keyword: "telehealth mental health australia", role: null, parent: null },
  { n: 75, title: "Salary Packaging for NFP Mental Health Workers: The Complete Guide", type: "CLUSTER", keyword: "salary packaging mental health", role: null, parent: 72 },
  { n: 76, title: "Understanding the SCHADS Award: Pay Rates for Mental Health and Community Workers", type: "CLUSTER", keyword: "schads award mental health", role: null, parent: 72 },
  { n: 77, title: "Medicare Better Access Initiative: How It Works and Which Professionals Can Bill", type: "CLUSTER", keyword: "medicare better access", role: null, parent: 73 },
  { n: 78, title: "Supervision Requirements in Australian Mental Health: A Cross-Role Guide", type: "CLUSTER", keyword: "supervision mental health australia", role: null, parent: 73 },
  // LOCATION-SPECIFIC CONVERSION
  { n: 79, title: "Working in Rural and Remote Mental Health: What to Expect", type: "CONVERSION", keyword: "rural mental health jobs", role: null, parent: null, status: "Published", slug: "/working-rural-remote-mental-health-australia" },
  { n: 80, title: "Mental Health Jobs in Sydney: Employers, Sectors, and Salaries", type: "CONVERSION", keyword: "mental health jobs sydney", role: null, parent: null },
  { n: 81, title: "Mental Health Jobs in Melbourne: The Complete Career Guide", type: "CONVERSION", keyword: "mental health jobs melbourne", role: null, parent: null },
  { n: 82, title: "Mental Health Jobs in Brisbane: Opportunities Across Queensland", type: "CONVERSION", keyword: "mental health jobs brisbane", role: null, parent: null },
  { n: 83, title: "Mental Health Jobs in Perth: A Growing Market for MH Professionals", type: "CONVERSION", keyword: "mental health jobs perth", role: null, parent: null },
  { n: 84, title: "Mental Health Jobs in Regional Australia: Why You Should Consider It", type: "CONVERSION", keyword: "mental health jobs regional australia", role: null, parent: null },
  // EMPLOYER-FACING CONVERSION
  { n: 85, title: "How to Write a Mental Health Job Ad That Attracts the Right Candidates", type: "CONVERSION", keyword: "mental health job ad", role: null, parent: null },
  { n: 86, title: "What Mental Health Professionals Look for in an Employer", type: "CONVERSION", keyword: "what psychologists look for employer", role: null, parent: null },
  { n: 87, title: "NDIS Provider Hiring Guide: Recruiting Mental Health and Support Staff", type: "CONVERSION", keyword: "ndis provider hiring", role: null, parent: null },
  { n: 88, title: "How to Hire a Psychologist for Your Practice: A Step-by-Step Guide", type: "CONVERSION", keyword: "how to hire a psychologist australia", role: null, parent: null },
  { n: 89, title: "Telehealth Staffing: Building a Remote Mental Health Team", type: "CONVERSION", keyword: "telehealth staffing mental health", role: null, parent: null },
  // JOB SEEKER CONVERSION
  { n: 90, title: "How to Write a Stand-Out Mental Health Job Application", type: "CONVERSION", keyword: "mental health job application", role: null, parent: null, status: "Published", slug: "/how-to-write-mental-health-job-application" },
  { n: 91, title: "10 Questions to Ask Before Accepting a Mental Health Role", type: "CONVERSION", keyword: "questions to ask mental health interview", role: null, parent: null },
  { n: 92, title: "Mental Health Workforce Shortage Australia: The Data Behind the Crisis", type: "CONVERSION", keyword: "mental health workforce shortage australia", role: null, parent: null },
  { n: 93, title: "Career Change into Mental Health: Pathways for Mid-Career Professionals", type: "CONVERSION", keyword: "career change mental health australia", role: null, parent: null },
  { n: 94, title: "New Graduate Mental Health Jobs: Where to Start Your Career", type: "CONVERSION", keyword: "new graduate mental health jobs australia", role: null, parent: null },
  { n: 95, title: "How to Find Supervised Practice as a Provisional Psychologist", type: "CONVERSION", keyword: "provisional psychologist supervision placement", role: "psychologist", parent: null },
  { n: 96, title: "Building Your Mental Health Career in the NDIS Sector", type: "CONVERSION", keyword: "ndis mental health career", role: null, parent: null },
  { n: 97, title: "The Best Mental Health Employers in Australia", type: "CONVERSION", keyword: "best mental health employers australia", role: null, parent: null },
  { n: 98, title: "Burnout in Mental Health Work: How to Protect Your Career", type: "CONVERSION", keyword: "mental health worker burnout", role: null, parent: null },
  { n: 99, title: "International Mental Health Professionals: Working in Australia", type: "CONVERSION", keyword: "overseas psychologist australia registration", role: null, parent: null },
  { n: 100, title: "Mental Health CPD Requirements by Role: Staying Registered and Current", type: "CONVERSION", keyword: "mental health cpd requirements australia", role: null, parent: null },
];

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existing = await sql`SELECT COUNT(*)::int AS count FROM content_plan`;
  if (existing.rows[0].count > 0) {
    return NextResponse.json({ ok: false, message: `Table already has ${existing.rows[0].count} rows. Delete them first if you want to re-seed.` });
  }

  let inserted = 0;
  for (const a of ARTICLES) {
    await sql`
      INSERT INTO content_plan (
        article_number, title, slug, content_type, target_keyword,
        target_role, pillar_parent_id, status, published_url, published_at
      ) VALUES (
        ${a.n}, ${a.title}, ${a.slug || null}, ${a.type}, ${a.keyword},
        ${a.role}, ${a.parent}, ${a.status || "Planned"},
        ${a.status === "Published" && a.slug ? SITE_URL + "/blog" + a.slug : null},
        ${a.status === "Published" ? new Date().toISOString() : null}
      )
    `;
    inserted++;
  }

  return NextResponse.json({ ok: true, inserted });
}
