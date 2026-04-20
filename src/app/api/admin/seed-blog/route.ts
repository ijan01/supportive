import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { createBlogPost } from "@/lib/blog";

const POSTS = [
  {
    title: "How to become a psychologist in Australia",
    slug: "how-to-become-psychologist-australia",
    excerpt: "A complete guide to the qualifications, registration, and career pathways for psychologists in Australia — from undergraduate study through to clinical endorsement.",
    author: "Supportive",
    content: `Becoming a psychologist in Australia is a structured but rewarding pathway that typically takes six to eight years of study and supervised practice. Here is what you need to know.

## Undergraduate study

The first step is completing a four-year undergraduate degree in psychology accredited by the Australian Psychology Accreditation Council (APAC). This is usually a Bachelor of Psychology or a Bachelor of Science/Arts with a psychology major, followed by an honours year. The honours year is essential — without it, you cannot progress to registration.

## Postgraduate pathways

After honours, you have two main pathways to general registration as a psychologist:

- **5+1 pathway**: Complete a one-year postgraduate diploma or approved coursework, followed by one year of supervised practice
- **4+2 pathway**: Complete two years of supervised practice under an approved supervisor (this pathway is being phased out in some states)
- **Masters or Doctoral pathway**: Complete a two-year masters or three-year doctoral program in a specialisation such as clinical, counselling, forensic, or organisational psychology

## AHPRA registration

All psychologists in Australia must be registered with the Psychology Board of Australia through AHPRA (Australian Health Practitioner Regulation Agency). General registration allows you to practise as a psychologist. Area of Practice Endorsements — such as Clinical Psychology — require additional postgraduate qualifications and supervised experience.

## Clinical psychologist endorsement

Clinical psychology endorsement is the most sought-after specialisation. It requires:

1. A masters or doctoral degree in clinical psychology from an APAC-accredited program
2. A registrar program of supervised clinical practice (typically one to two years post-masters)
3. Passing the national psychology examination

Clinical psychologists can access higher Medicare rebates under the Better Access scheme, making this endorsement financially significant.

## Career outlook

Psychologists are in strong demand across Australia, particularly in regional areas and within the public mental health system. Salaries range from $85,000 to $140,000 depending on experience, endorsement, and setting. Private practice psychologists with established caseloads can earn significantly more.

## Key organisations

- **AHPRA / Psychology Board of Australia** — registration and regulation
- **Australian Psychological Society (APS)** — professional body and advocacy
- **APAC** — accreditation of psychology programs`,
  },
  {
    title: "What is a Peer Support Worker? A guide to peer work in Australia",
    slug: "what-is-peer-support-worker-australia",
    excerpt: "Peer support work is one of the fastest-growing roles in Australia's mental health workforce. Here is what the role involves, how to get qualified, and what to expect.",
    author: "Supportive",
    content: `Peer support work is built on a simple but powerful idea: people who have experienced mental health challenges themselves are uniquely placed to support others going through similar experiences.

## What peer support workers do

Peer support workers use their own **lived experience** of mental health recovery as a core professional tool. Day-to-day responsibilities include:

- Providing one-on-one emotional support to consumers
- Facilitating peer-led group programs
- Sharing their recovery story to build hope and connection
- Supporting consumers to navigate the mental health system
- Advocating alongside consumers in treatment planning meetings
- Connecting people with community resources and services

The role is fundamentally different from clinical roles. Peer workers do not diagnose, prescribe, or deliver therapy. Their value lies in the shared understanding and genuine connection that comes from lived experience.

## How to become a peer support worker

The primary qualification pathway in Australia is the **Certificate IV in Mental Health Peer Work**. This is a nationally recognised vocational qualification delivered by registered training organisations across the country.

### Entry requirements

- Lived experience of mental health challenges and recovery (essential)
- Willingness to share your story in a professional context
- No specific prior qualifications required

### Other pathways

Some employers accept a **Certificate IV in Mental Health** combined with demonstrated lived experience. A growing number of universities also offer peer work units within broader mental health degrees.

## Where peer support workers work

- **headspace** centres (youth mental health)
- Community mental health services (state-funded)
- **NDIS** providers delivering psychosocial support
- Residential rehabilitation services
- Hospital-based mental health units
- Peer-led organisations like **Flourish Australia** and **Neami National**

## Salary expectations

Peer support workers in Australia typically earn between **$65,000 and $90,000** per year, depending on the employer, location, and award. Most not-for-profit employers offer **salary packaging** of up to $15,900 per year, which adds approximately $3,000 to $5,000 to your effective take-home pay.

## Career progression

Peer work is still a relatively new profession, but career pathways are developing rapidly:

1. Peer Support Worker
2. Senior Peer Worker / Peer Lead
3. Peer Work Coordinator
4. Lived Experience Advisor or Consultant
5. Peer Work Manager / Director of Lived Experience

Many organisations now have executive-level lived experience roles, reflecting the growing recognition of peer work as a distinct and valued discipline.`,
  },
  {
    title: "Mental health salary guide Australia 2026",
    slug: "mental-health-salary-guide-australia-2026",
    excerpt: "A practical guide to salary ranges across clinical, allied health, peer work, and community mental health roles in Australia for 2026.",
    author: "Supportive",
    content: `Salaries in the mental health sector vary significantly by role, employer type, location, and experience level. This guide provides realistic ranges based on enterprise agreements, award rates, and advertised positions.

## Clinical roles

### Psychologist
- **General psychologist**: $85,000 – $120,000
- **Clinical psychologist (endorsed)**: $110,000 – $150,000
- **Private practice**: $120,000 – $200,000+ (dependent on caseload)
- Highest demand in regional areas and public health settings

### Psychiatrist
- **Public sector**: $200,000 – $350,000
- **Private practice**: $300,000 – $500,000+
- Psychiatrists remain the highest-paid mental health professionals in Australia

### Mental health nurse
- **Registered nurse (MH)**: $75,000 – $100,000
- **Clinical nurse specialist**: $95,000 – $115,000
- **Nurse practitioner (MH)**: $120,000 – $150,000
- Public sector nurses benefit from strong enterprise agreements and penalty rates

## Allied health roles

### Mental health social worker
- **Early career**: $75,000 – $90,000
- **Experienced / senior**: $90,000 – $115,000
- **Team leader**: $110,000 – $130,000

### Counsellor
- **Community sector**: $70,000 – $95,000
- **Senior / specialist**: $90,000 – $110,000
- Counsellors in private practice set their own rates, typically $120 – $200 per session

### Occupational therapist (mental health)
- **Early career**: $75,000 – $90,000
- **Senior OT**: $95,000 – $120,000

## Community and peer roles

### Peer support worker
- **Entry level**: $65,000 – $75,000
- **Experienced**: $75,000 – $90,000
- **Senior / coordinator**: $85,000 – $100,000

### AOD worker
- **Certificate IV level**: $65,000 – $80,000
- **Degree-qualified**: $75,000 – $95,000
- **Senior / specialist**: $90,000 – $110,000

### Case manager / care coordinator
- **Early career**: $70,000 – $85,000
- **Experienced**: $85,000 – $100,000

## The salary packaging advantage

Most not-for-profit mental health employers offer **salary packaging** under the FBT exemption for public benevolent institutions. This allows you to package up to **$15,900** per year of your pre-tax salary for everyday expenses, plus an additional **$2,650** for meal entertainment.

The practical effect is an increase of approximately **$3,000 – $6,000** in your annual take-home pay compared to a for-profit employer paying the same gross salary. This is a significant benefit that should be factored into any salary comparison.

## Location impacts

- **Regional and remote loadings**: 5% – 15% salary premium, plus relocation allowances
- **Capital cities**: Standard award rates, higher cost of living
- **Telehealth roles**: Typically paid at the same rate as in-person roles

## Key award references

- **SCHADS Award** (Social, Community, Home Care and Disability Services) — covers most community mental health and NGO roles
- **Nurses Award** / state health enterprise agreements — covers nursing roles
- **Health Professionals Award** — covers allied health in private sector`,
  },
  {
    title: "Understanding the NDIS for mental health workers",
    slug: "understanding-ndis-mental-health-workers",
    excerpt: "A practical guide to the NDIS for mental health and community services workers — including psychosocial disability, support categories, and what it means for your practice.",
    author: "Supportive",
    content: `The National Disability Insurance Scheme has transformed how mental health support is funded and delivered in Australia. Whether you work in a clinical, community, or peer support role, understanding the NDIS is now an essential part of practice.

## What is psychosocial disability?

The NDIS uses the term **psychosocial disability** to describe the functional impairment that can result from a mental health condition. Importantly, NDIS eligibility is based on the _impact_ of the condition on daily functioning — not on the diagnosis itself.

A person with schizophrenia, bipolar disorder, severe depression, or complex PTSD may be eligible for NDIS funding if their condition significantly affects their ability to participate in daily life, social activities, or employment on a permanent or likely permanent basis.

## How the NDIS works alongside the mental health system

The NDIS and the clinical mental health system operate in parallel, not in sequence:

- **Clinical mental health services** (public and private) provide treatment — therapy, medication, crisis intervention
- **The NDIS** funds disability support — daily living, social participation, capacity building, and community access

A person can access both systems simultaneously. Mental health workers need to understand where clinical treatment ends and disability support begins, as the boundary is often unclear in practice.

## Key NDIS support categories for mental health

### Assistance with daily living
Support workers help participants with daily routines, personal care, household tasks, and building independent living skills.

### Social and community participation
Workers support participants to access community activities, build social connections, maintain relationships, and develop social skills.

### Improved daily living (capacity building)
This is where most allied health professionals work within the NDIS. It funds:

- Psychological therapy and counselling
- Occupational therapy for functional capacity
- Social work and care coordination
- Behaviour support
- Peer support programs

### Support coordination
Support coordinators help participants understand and implement their NDIS plans, connect with service providers, and navigate the system.

## What this means for your practice

If you work in mental health, you will encounter NDIS participants regardless of your setting. Key things to know:

- **Service agreements** are required between providers and participants
- **NDIS pricing** is regulated — the NDIA publishes a price guide and support catalogue annually
- **Registration** is required for some support types (behaviour support, specialist disability accommodation) but not all
- **Plan reviews** happen regularly — your reports and assessments may be used as evidence for funding decisions
- **Recovery-oriented practice** aligns well with the NDIS capacity building framework

## Getting started

- Read the **NDIS Practice Standards** relevant to your discipline
- Complete the **NDIS Worker Orientation Module** (free online)
- Obtain an **NDIS Worker Screening Check** in your state
- Familiarise yourself with the **NDIS Price Guide and Support Catalogue**`,
  },
  {
    title: "How to write a stand-out mental health job application",
    slug: "how-to-write-mental-health-job-application",
    excerpt: "What mental health hiring managers actually look for in applications — and how to write a cover letter and address selection criteria that get you shortlisted.",
    author: "Supportive",
    content: `Applying for a role in the mental health sector requires a different approach to a generic job application. Here is what hiring managers are actually looking for.

## Lead with your why

Mental health employers want to know _why_ you want to work in this sector. This is not a throwaway question. Open your cover letter with a genuine, specific reason — not a vague statement about wanting to help people.

**Weak**: "I am passionate about helping people and would love to work in mental health."

**Strong**: "I am applying for this role because I want to work in an organisation that takes recovery-oriented practice seriously. My experience at [organisation] showed me how powerful community-based support can be, and I want to contribute to that model at [employer]."

## Demonstrate your understanding of recovery-oriented practice

Most mental health employers in Australia operate within a recovery-oriented framework. Show you understand what this means in practice:

- Use the language of the sector: _lived experience_, _consumer_, _carer_, _recovery journey_
- Reference specific frameworks or models you have used (e.g., the Collaborative Recovery Model, Strengths Model)
- Describe how you centre the consumer's voice in your work

## Address selection criteria properly

Most public sector and not-for-profit mental health roles use formal **selection criteria**. Each criterion should be addressed with a specific example using the **STAR format**:

1. **Situation**: Briefly set the scene
2. **Task**: What was your responsibility?
3. **Action**: What did you specifically do?
4. **Result**: What was the outcome?

Keep each response to 200–400 words. Be concrete — name the tools, frameworks, and approaches you used. Avoid generic statements that could apply to any applicant.

## Be specific about your clinical or support experience

Do not just list job titles and employers. Describe:

- The **presentations** you have worked with (e.g., psychosis, complex trauma, dual diagnosis)
- The **therapeutic modalities** you use (e.g., CBT, DBT, EMDR, motivational interviewing)
- The **populations** you have experience with (e.g., youth, older adults, Aboriginal and Torres Strait Islander communities)
- The **settings** you have worked in (e.g., acute inpatient, community outreach, residential rehabilitation)

## Highlight sector-relevant qualifications and checks

Make sure your application clearly states:

- Your **professional registration** (AHPRA, AASW membership, etc.)
- Your **working with children check** and **NDIS worker screening** status
- Any **specialist training** relevant to the role (e.g., suicide prevention, trauma-informed care, eating disorder competency)
- Your **driver's licence** status (required for most community and outreach roles)

## Common mistakes to avoid

- Writing a generic cover letter that could apply to any job in any sector
- Failing to address every selection criterion (if criteria are listed, all must be addressed)
- Focusing on what you want from the role rather than what you bring to it
- Neglecting to research the employer — mention something specific about their services or approach
- Submitting without proofreading (presentation matters in a professional application)`,
  },
  {
    title: "Working in rural and remote mental health: what to expect",
    slug: "working-rural-remote-mental-health-australia",
    excerpt: "Thinking about a rural or remote mental health role? Here is what the work is really like, what incentives are available, and how to prepare for the move.",
    author: "Supportive",
    content: `Rural and remote mental health work offers a unique combination of professional challenge, community impact, and lifestyle opportunity. It is also consistently the hardest part of the sector to recruit for.

## What makes rural practice different

The defining feature of rural mental health practice is **generalism**. In a metropolitan setting, you might specialise in one presentation, age group, or treatment modality. In a rural setting, you will likely work across all of them.

A typical week for a rural mental health clinician might include:

- An assessment for a young person with emerging psychosis
- A therapy session with an older adult experiencing grief
- A risk assessment in the emergency department
- A case conference with the local GP and school counsellor
- A telehealth supervision session with a colleague in the city

This breadth is what draws many practitioners to rural work — and what makes it professionally demanding.

## Financial incentives

Rural mental health roles typically come with financial incentives that can significantly increase your total package:

- **Salary loadings**: 5% – 20% above metropolitan rates
- **Relocation allowances**: $5,000 – $15,000 to cover moving costs
- **Accommodation support**: Subsidised or free housing in some remote locations
- **HECS-HELP repayment benefit**: Reduced HECS repayments for eligible practitioners working in designated rural areas
- **Salary packaging**: Standard NFP packaging ($15,900 + $2,650) applies in most community organisations
- **Professional development allowances**: Often more generous than metropolitan roles to support ongoing learning

## The reality of professional isolation

The biggest challenge of rural practice is **professional isolation**. You may be the only mental health clinician in your town or region. This means:

- Limited access to in-person peer consultation and supervision
- Greater responsibility for complex clinical decisions
- Less ability to refer on to specialist services
- More reliance on telehealth supervision and online professional development

Building a strong **remote supervision relationship** before you start is essential. Most employers will arrange and fund this, but you should confirm the arrangement during the interview process.

## Community embeddedness

In a rural community, the boundary between your professional and personal life is thinner than in a city. You will see your clients at the supermarket, the pub, and the school pickup. This requires a mature approach to **dual relationships** and strong self-care practices.

The upside is that community embeddedness also means deeper therapeutic relationships, a clearer understanding of your clients' context, and a genuine sense of making a visible difference.

## How to prepare

1. **Build generalist skills** before going rural — experience across age groups and presentations is more valuable than deep specialisation
2. **Arrange supervision** early — confirm the clinical supervision model before accepting the role
3. **Visit first** if possible — spend a few days in the community to get a feel for the town, services, and lifestyle
4. **Connect with the rural health network** — organisations like the National Rural Health Alliance and Rural Health Workforce agencies can provide support and advice
5. **Be realistic about isolation** — if you thrive on daily peer interaction and city amenities, a remote posting may not suit you long-term

## Key employers

- **State health services** (community mental health teams in rural LHDs/HHSs)
- **Royal Flying Doctor Service** (mental health outreach)
- **headspace** (rural and regional centres)
- **Aboriginal Community Controlled Health Organisations**
- **PHN-commissioned services** (various providers in each region)`,
  },
];

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];
  for (const post of POSTS) {
    try {
      const created = await createBlogPost({ ...post, published: true });
      results.push({ title: post.title, status: "created", id: created.id });
    } catch (err) {
      results.push({ title: post.title, status: "error", error: String(err) });
    }
  }

  return NextResponse.json({ ok: true, results });
}
