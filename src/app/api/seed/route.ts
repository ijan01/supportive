import { NextResponse } from "next/server";
import { sql } from "../../../../db";
import { initSchema } from "../../../../db/schema";
import { hashSync } from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    await initSchema();

    const existing = await sql`SELECT COUNT(*)::integer as c FROM users`;
    if ((existing.rows[0].c as number) > 0) {
      return NextResponse.json({ message: "Database already seeded", users: existing.rows[0].c }, { status: 200 });
    }

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

    const jobs = [
      { title: "Peer Support Worker", company: "headspace", location: "Melbourne, VIC", category: "Peer Support Worker", job_type: "Part-time", salary_min: 70000, salary_max: 85000, description: "headspace is Australia's national youth mental health foundation, dedicated to improving the wellbeing of young Australians.\n\nWe are seeking a passionate Peer Support Worker to join our Melbourne centre. In this role you will draw on your own lived experience of mental health challenges to provide genuine peer support to young people aged 12–25.\n\nYou will work alongside a multidisciplinary clinical team to deliver group programs, one-on-one support, and community engagement activities.", requirements: "Lived experience of mental health challenges (essential)\nCertificate IV in Mental Health Peer Work or willingness to complete\nExperience working with young people in a support capacity\nStrong communication and interpersonal skills\nWorking with Children Check\nNDIS Worker Screening Check", apply_url: "https://headspace.org.au/careers", is_featured: 1 },
      { title: "Clinical Psychologist", company: "Black Dog Institute", location: "Sydney, NSW", category: "Clinical Psychologist", job_type: "Full-time", salary_min: 115000, salary_max: 140000, description: "The Black Dog Institute is a world-leading medical research institute and global leader in the diagnosis, treatment, and prevention of mental illness.\n\nWe are looking for an experienced Clinical Psychologist to join our clinical services team in Sydney. You will provide evidence-based psychological assessment and treatment to adults experiencing mood disorders, anxiety, and related conditions.\n\nYou will contribute to translational research activities, supervise provisional psychologists, and participate in professional development and quality improvement initiatives.", requirements: "AHPRA registration as a Clinical Psychologist (essential)\nEndorsement in Clinical Psychology or working towards it\nExperience delivering CBT and other evidence-based therapies\nExperience with mood disorders and anxiety presentations\nStrong written and verbal communication skills\nResearch experience desirable", apply_url: "https://blackdoginstitute.org.au/careers", is_featured: 1 },
      { title: "Mental Health Social Worker", company: "Neami National", location: "Brisbane, QLD", category: "Mental Health Social Worker", job_type: "Full-time", salary_min: 90000, salary_max: 105000, description: "Neami National is a community mental health service supporting people living with mental illness to improve their health, wellbeing, and social inclusion.\n\nWe have an opportunity for a qualified Mental Health Social Worker to join our Brisbane team. You will provide recovery-oriented support to consumers with complex mental health needs, working across community and residential settings.\n\nYour work will include individual support planning, advocacy, family engagement, and connection to community resources.", requirements: "Degree in Social Work with AASW eligibility (essential)\nExperience in mental health or community services\nKnowledge of recovery-oriented practice frameworks\nExperience with NDIS participants desirable\nCurrent driver's licence\nNational Police Check", apply_url: "https://neaminational.org.au/careers", is_featured: 1 },
      { title: "AOD Worker", company: "Odyssey House", location: "Melbourne, VIC", category: "AOD Worker", job_type: "Full-time", salary_min: 80000, salary_max: 95000, description: "Odyssey House Victoria provides a range of alcohol and other drug treatment services to individuals and families across Victoria.\n\nWe are seeking a skilled AOD Worker to join our residential treatment team in Melbourne. You will deliver person-centred assessment, counselling, and case management to clients presenting with substance use disorders.\n\nThis role involves facilitating group therapy programs, supporting clients through withdrawal and recovery, and coordinating with external services.", requirements: "Certificate IV in Alcohol and Other Drugs (or higher)\nExperience in AOD, mental health, or community services\nKnowledge of motivational interviewing and brief intervention techniques\nExperience facilitating group programs\nAbility to work a rotating roster including some weekend shifts\nCurrent driver's licence", apply_url: "https://odysseyhouse.com.au/careers", is_featured: 0 },
      { title: "Mental Health Nurse", company: "NSW Health", location: "Newcastle, NSW", category: "Mental Health Nurse", job_type: "Full-time", salary_min: 100000, salary_max: 120000, description: "NSW Health is the largest health system in Australia, providing public health services across New South Wales.\n\nHunter New England Local Health District is seeking experienced Mental Health Nurses to join our inpatient and community mental health teams in Newcastle. You will provide direct nursing care, mental state assessment, medication management, and risk assessment for consumers across acute and subacute settings.", requirements: "Current AHPRA registration as a Registered Nurse\nPost-graduate qualifications in Mental Health Nursing or working towards\nExperience in a mental health inpatient or community setting\nKnowledge of the Mental Health Act NSW\nStrong clinical assessment and risk management skills\nAbility to work rotating shifts including nights and weekends", apply_url: "https://www.health.nsw.gov.au/careers", is_featured: 0 },
      { title: "Youth Mental Health Worker", company: "ReachOut", location: "Remote (Australia)", category: "Youth Mental Health Worker", job_type: "Part-time", salary_min: 75000, salary_max: 90000, description: "ReachOut is Australia's leading online mental health organisation for young people and the adults who support them.\n\nWe are looking for a Youth Mental Health Worker to join our digital services team in a part-time, fully remote capacity. You will provide online peer support, develop mental health resources, and facilitate digital group programs for young Australians aged 16–25.", requirements: "Degree in Psychology, Social Work, Mental Health Nursing, or related field\nExperience working with young people in a mental health or youth work context\nComfort with digital tools and online communication platforms\nKnowledge of youth mental health frameworks and early intervention approaches\nExcellent written communication skills\nLived experience of mental health challenges welcomed", apply_url: "https://about.au.reachout.com/careers", is_featured: 0 },
    ];

    for (const j of jobs) {
      await sql`
        INSERT INTO jobs (user_id, title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url, is_featured)
        VALUES (${userId}, ${j.title}, ${j.company}, ${j.location}, ${j.category}, ${j.job_type}, ${j.salary_min}, ${j.salary_max}, ${j.description}, ${j.requirements}, ${j.apply_url}, ${j.is_featured})
      `;
    }

    const blogPosts = [
      { title: "How to write a stand-out mental health job application", slug: "how-to-write-mental-health-job-application", excerpt: "What mental health hiring managers look for in applications, and how to write a cover letter that stands out.", content: "Applying for a role in the mental health sector requires a different approach to a standard job application.\n\n## Lead with your why\nMental health employers want to know why you want to work in this sector.\n\n## Demonstrate your understanding of recovery-oriented practice\nUse the language of the sector: lived experience, consumer, carer, recovery journey.\n\n## Address the selection criteria carefully\nMost roles use formal selection criteria. Answer each one with a specific example using the STAR format.", author: "Jordan Lee", published_at: "2026-04-10" },
      { title: "Understanding the NDIS: a guide for mental health workers", slug: "understanding-ndis-mental-health-workers", excerpt: "A practical overview of the NDIS for mental health and community services workers.", content: "The National Disability Insurance Scheme has transformed how mental health support is funded and delivered in Australia.\n\n## What is psychosocial disability?\nThe NDIS funds supports for people with psychosocial disability — functional impairment arising from a mental health condition.\n\n## Support categories relevant to mental health\nThe key categories are Improved Daily Living, Assistance with Social and Community Participation, and Improved Living Arrangements.", author: "Sam Nguyen", published_at: "2026-04-08" },
      { title: "Peer work in Australia: what it is and why it matters", slug: "peer-work-australia-what-it-is-why-it-matters", excerpt: "An introduction to peer work in the Australian mental health sector.", content: "Peer work is one of the fastest-growing roles in the Australian mental health workforce.\n\n## Defining peer work\nA peer worker uses their own lived experience of mental health challenges to support others. The lived experience is a core professional qualification.\n\n## Getting qualified\nThe Certificate IV in Mental Health Peer Work is the primary qualification pathway in Australia.", author: "Mia Tran", published_at: "2026-04-05" },
      { title: "Salary benchmarks for mental health roles in Australia (2026)", slug: "salary-benchmarks-mental-health-australia-2026", excerpt: "A 2026 guide to salary ranges across clinical, allied health, and community mental health roles in Australia.", content: "Salaries in the mental health sector vary significantly by role, sector, and location.\n\n## Clinical roles\nPsychologists in private practice typically earn $120,000–$180,000. Public sector clinical psychologists earn $110,000–$140,000.\n\n## The value of salary packaging\nMost not-for-profit employers offer salary packaging of up to $15,900 per year, effectively adding $3,000–$5,000 to your take-home pay.", author: "Taylor Kim", published_at: "2026-04-01" },
    ];

    for (const p of blogPosts) {
      await sql`
        INSERT INTO blog_posts (title, slug, content, excerpt, author, published_at)
        VALUES (${p.title}, ${p.slug}, ${p.content}, ${p.excerpt}, ${p.author}, ${p.published_at})
      `;
    }

    return NextResponse.json({ message: "Database seeded successfully", jobs: jobs.length, blogPosts: blogPosts.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
