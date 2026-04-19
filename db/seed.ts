import { sql } from "./index";
import { initSchema } from "./schema";
import { hashSync } from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function seed() {
  await initSchema();

  await sql`DELETE FROM saved_jobs`;
  await sql`DELETE FROM applications`;
  await sql`DELETE FROM blog_posts`;
  await sql`DELETE FROM jobs`;
  await sql`DELETE FROM users`;

  const companyHash = hashSync("password123", 12);
  const seekerHash = hashSync("password123", 12);

  const companyResult = await sql`
    INSERT INTO users (email, password_hash, name, role, company_name)
    VALUES ('company@demo.com', ${companyHash}, 'Demo Employer', 'company', 'Neami National')
    RETURNING id
  `;
  await sql`
    INSERT INTO users (email, password_hash, name, role, company_name)
    VALUES ('seeker@demo.com', ${seekerHash}, 'Alex Smith', 'seeker', NULL)
  `;

  const userId = companyResult.rows[0].id as number;

  const jobs: Array<[number, string, string, string, string, string, number | null, number | null, string, string, string, number]> = [
    [userId, "Peer Support Worker", "headspace", "Melbourne, VIC", "Peer Support Worker", "Part-time", 70000, 85000,
      "headspace is Australia's national youth mental health foundation, dedicated to improving the wellbeing of young Australians.\n\nWe are seeking a passionate Peer Support Worker to join our Melbourne centre. In this role you will draw on your own lived experience of mental health challenges to provide genuine peer support to young people aged 12–25.\n\nYou will work alongside a multidisciplinary clinical team to deliver group programs, one-on-one support, and community engagement activities.",
      "Lived experience of mental health challenges (essential)\nCertificate IV in Mental Health Peer Work or willingness to complete\nExperience working with young people in a support capacity\nStrong communication and interpersonal skills\nWorking with Children Check\nNDIS Worker Screening Check",
      "https://headspace.org.au/careers", 1],

    [userId, "Clinical Psychologist", "Black Dog Institute", "Sydney, NSW", "Clinical Psychologist", "Full-time", 115000, 140000,
      "The Black Dog Institute is a world-leading medical research institute and global leader in the diagnosis, treatment, and prevention of mental illness.\n\nWe are looking for an experienced Clinical Psychologist to join our clinical services team in Sydney. You will provide evidence-based psychological assessment and treatment to adults experiencing mood disorders, anxiety, and related conditions.\n\nYou will contribute to translational research activities, supervise provisional psychologists, and participate in professional development and quality improvement initiatives.",
      "AHPRA registration as a Clinical Psychologist (essential)\nEndorsement in Clinical Psychology or working towards it\nExperience delivering CBT and other evidence-based therapies\nExperience with mood disorders and anxiety presentations\nStrong written and verbal communication skills\nResearch experience desirable",
      "https://blackdoginstitute.org.au/careers", 1],

    [userId, "Mental Health Social Worker", "Neami National", "Brisbane, QLD", "Mental Health Social Worker", "Full-time", 90000, 105000,
      "Neami National is a community mental health service supporting people living with mental illness to improve their health, wellbeing, and social inclusion.\n\nWe have an opportunity for a qualified Mental Health Social Worker to join our Brisbane team. You will provide recovery-oriented support to consumers with complex mental health needs, working across community and residential settings.\n\nYour work will include individual support planning, advocacy, family engagement, and connection to community resources.",
      "Degree in Social Work with AASW eligibility (essential)\nExperience in mental health or community services\nKnowledge of recovery-oriented practice frameworks\nExperience with NDIS participants desirable\nCurrent driver's licence\nNational Police Check",
      "https://neaminational.org.au/careers", 1],

    [userId, "AOD Worker", "Odyssey House", "Melbourne, VIC", "AOD Worker", "Full-time", 80000, 95000,
      "Odyssey House Victoria provides a range of alcohol and other drug treatment services to individuals and families across Victoria.\n\nWe are seeking a skilled AOD Worker to join our residential treatment team in Melbourne. You will deliver person-centred assessment, counselling, and case management to clients presenting with substance use disorders.\n\nThis role involves facilitating group therapy programs, supporting clients through withdrawal and recovery, and coordinating with external services including mental health, housing, and family support.",
      "Certificate IV in Alcohol and Other Drugs (or higher)\nExperience in AOD, mental health, or community services\nKnowledge of motivational interviewing and brief intervention techniques\nExperience facilitating group programs\nAbility to work a rotating roster including some weekend shifts\nCurrent driver's licence",
      "https://odysseyhouse.com.au/careers", 0],

    [userId, "Mental Health Nurse", "NSW Health", "Newcastle, NSW", "Mental Health Nurse", "Full-time", 100000, 120000,
      "NSW Health is the largest health system in Australia, providing public health services across New South Wales.\n\nHunter New England Local Health District is seeking experienced Mental Health Nurses to join our inpatient and community mental health teams in Newcastle. You will provide direct nursing care, mental state assessment, medication management, and risk assessment for consumers across acute and subacute settings.\n\nNSW Health offers excellent salary packaging, ongoing professional development, and a supportive work environment.",
      "Current AHPRA registration as a Registered Nurse\nPost-graduate qualifications in Mental Health Nursing or working towards\nExperience in a mental health inpatient or community setting\nKnowledge of the Mental Health Act NSW\nStrong clinical assessment and risk management skills\nAbility to work rotating shifts including nights and weekends",
      "https://www.health.nsw.gov.au/careers", 0],

    [userId, "Youth Mental Health Worker", "ReachOut", "Remote (Australia)", "Youth Mental Health Worker", "Part-time", 75000, 90000,
      "ReachOut is Australia's leading online mental health organisation for young people and the adults who support them.\n\nWe are looking for a Youth Mental Health Worker to join our digital services team in a part-time, fully remote capacity. You will provide online peer support, develop mental health resources, and facilitate digital group programs for young Australians aged 16–25.\n\nThis role suits someone passionate about digital mental health, comfortable working independently in a remote environment, and skilled at engaging young people through online channels.",
      "Degree in Psychology, Social Work, Mental Health Nursing, or related field\nExperience working with young people in a mental health or youth work context\nComfort with digital tools and online communication platforms\nKnowledge of youth mental health frameworks and early intervention approaches\nExcellent written communication skills\nLived experience of mental health challenges welcomed",
      "https://about.au.reachout.com/careers", 0],
  ];

  for (const j of jobs) {
    await sql`
      INSERT INTO jobs (user_id, title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url, is_featured)
      VALUES (${j[0]}, ${j[1]}, ${j[2]}, ${j[3]}, ${j[4]}, ${j[5]}, ${j[6]}, ${j[7]}, ${j[8]}, ${j[9]}, ${j[10]}, ${j[11]})
    `;
  }

  const posts: Array<[string, string, string, string, string, string]> = [
    ["How to write a stand-out mental health job application", "how-to-write-mental-health-job-application", "Applying for a role in the mental health sector requires a different approach to a standard job application. Here is what hiring managers are actually looking for.\n\n## Lead with your why\nMental health employers want to know why you want to work in this sector. Open your cover letter with a genuine, specific reason.\n\n## Demonstrate your understanding of recovery-oriented practice\nShow you understand the shift from a medical model to a recovery-oriented approach. Use the language of the sector: lived experience, consumer, carer, recovery journey.\n\n## Be specific about your clinical or support experience\nDon't just list roles — describe the presentations you have worked with, the frameworks you use, and the outcomes you have contributed to.\n\n## Address the selection criteria carefully\nMost public sector and not-for-profit mental health roles use formal selection criteria. Answer each one with a specific example using the STAR format.", "What mental health hiring managers look for in applications, and how to write a cover letter that stands out.", "Jordan Lee", "2026-04-10"],

    ["Understanding the NDIS: a guide for mental health workers", "understanding-ndis-mental-health-workers", "The National Disability Insurance Scheme has transformed how mental health support is funded and delivered in Australia. Here is what every mental health worker needs to know.\n\n## What is psychosocial disability?\nThe NDIS funds supports for people with psychosocial disability — functional impairment arising from a mental health condition. Eligibility depends on the impact of the condition, not the diagnosis itself.\n\n## NDIS and the mental health system\nThe NDIS and the mental health system operate in parallel, not in sequence. Workers need to understand how to navigate both systems.\n\n## Support categories relevant to mental health\nThe key support categories for mental health workers are Improved Daily Living, Assistance with Social and Community Participation, and Improved Living Arrangements.", "A practical overview of the NDIS for mental health and community services workers, including psychosocial disability and support categories.", "Sam Nguyen", "2026-04-08"],

    ["Peer work in Australia: what it is and why it matters", "peer-work-australia-what-it-is-why-it-matters", "Peer work is one of the fastest-growing roles in the Australian mental health workforce. But what exactly is it, and how does it differ from other support roles?\n\n## Defining peer work\nA peer worker is someone who uses their own lived experience of mental health challenges — and their recovery — to support others. The lived experience is not just a personal attribute, it is a core professional qualification.\n\n## The evidence base\nResearch consistently shows that peer support improves engagement, reduces hospitalisation, and increases hope and self-efficacy for consumers.\n\n## Getting qualified\nThe Certificate IV in Mental Health Peer Work is the primary qualification pathway in Australia.", "An introduction to peer work in the Australian mental health sector — what it is, the evidence behind it, and how to get started.", "Mia Tran", "2026-04-05"],

    ["Salary benchmarks for mental health roles in Australia (2026)", "salary-benchmarks-mental-health-australia-2026", "Salaries in the mental health sector vary significantly by role, sector, and location. Here is a general guide based on enterprise agreements and advertised positions.\n\n## Clinical roles\nPsychologists in private practice typically earn between $120,000 and $180,000. Salaried clinical psychologists in the public sector earn $110,000–$140,000. Psychiatrists range from $200,000 to $350,000+.\n\n## Allied health and community roles\nMental Health Social Workers and Counsellors in the not-for-profit sector typically earn $85,000–$110,000 under the SCHADS Award. Peer Support Workers and AOD Workers have seen pay improvements following the Fair Work Commission's equal pay case.\n\n## The value of salary packaging\nMost not-for-profit mental health employers offer salary packaging of up to $15,900 per year, effectively adding $3,000–$5,000 to your take-home pay.", "A 2026 guide to salary ranges across clinical, allied health, and community mental health roles in Australia.", "Taylor Kim", "2026-04-01"],
  ];

  for (const p of posts) {
    await sql`
      INSERT INTO blog_posts (title, slug, content, excerpt, author, published_at)
      VALUES (${p[0]}, ${p[1]}, ${p[2]}, ${p[3]}, ${p[4]}, ${p[5]})
    `;
  }

  const userCount = await sql`SELECT COUNT(*)::integer as c FROM users`;
  const jobCount = await sql`SELECT COUNT(*)::integer as c FROM jobs`;
  const postCount = await sql`SELECT COUNT(*)::integer as c FROM blog_posts`;

  console.log("Seeded successfully:");
  console.log(`  - ${userCount.rows[0].c} users`);
  console.log(`  - ${jobCount.rows[0].c} jobs`);
  console.log(`  - ${postCount.rows[0].c} blog posts`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
