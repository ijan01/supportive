import { NextResponse } from "next/server";
import { sql } from "../../../../db";
import { initSchema } from "../../../../db/schema";
import { hashSync } from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  return POST();
}

export async function POST() {
  // Safety: only allow seeding in production once, or when DB is empty
  try {
    await initSchema();

    // Check if already seeded
    const existing = await sql`SELECT COUNT(*)::integer as c FROM users`;
    if ((existing.rows[0].c as number) > 0) {
      return NextResponse.json({ message: "Database already seeded", users: existing.rows[0].c }, { status: 200 });
    }

    const companyHash = hashSync("password123", 12);
    const seekerHash = hashSync("password123", 12);

    const companyResult = await sql`
      INSERT INTO users (email, password_hash, name, role, company_name)
      VALUES ('company@demo.com', ${companyHash}, 'Demo Company', 'company', 'TechCorp')
      RETURNING id
    `;
    await sql`
      INSERT INTO users (email, password_hash, name, role, company_name)
      VALUES ('seeker@demo.com', ${seekerHash}, 'Jane Smith', 'seeker', NULL)
    `;

    const userId = companyResult.rows[0].id as number;

    const jobs: Array<{ title: string; company: string; location: string; category: string; job_type: string; salary_min: number | null; salary_max: number | null; description: string; requirements: string; apply_url: string; is_featured: number }> = [
      { title: "Senior Frontend Engineer", company: "TechCorp", location: "San Francisco, CA", category: "Engineering", job_type: "Full-time", salary_min: 150000, salary_max: 200000, description: "We're looking for a Senior Frontend Engineer to lead our UI team. You'll architect and build complex web applications using React and TypeScript.\n\nYou'll work closely with designers and backend engineers to deliver exceptional user experiences.", requirements: "5+ years of frontend development experience\nExpert in React and TypeScript\nExperience with Next.js\nStrong CSS/Tailwind skills", apply_url: "https://example.com/apply", is_featured: 1 },
      { title: "Product Designer", company: "DesignStudio", location: "Remote", category: "Design", job_type: "Full-time", salary_min: 120000, salary_max: 160000, description: "Join our design team to create beautiful, intuitive interfaces for our SaaS platform. You'll own the design process from research to final implementation.", requirements: "4+ years of product design experience\nProficiency in Figma\nExperience with design systems\nStrong portfolio", apply_url: "https://example.com/apply", is_featured: 1 },
      { title: "Marketing Manager", company: "GrowthCo", location: "New York, NY", category: "Marketing", job_type: "Full-time", salary_min: 90000, salary_max: 130000, description: "Lead our marketing efforts and drive growth across all channels. You'll develop and execute marketing strategies.", requirements: "3+ years of marketing experience\nExperience with digital marketing channels\nStrong analytical skills", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "DevOps Engineer", company: "CloudScale", location: "Seattle, WA", category: "DevOps", job_type: "Remote", salary_min: 140000, salary_max: 180000, description: "Join our infrastructure team to build and maintain our cloud platform. You'll work on CI/CD pipelines, container orchestration, and monitoring systems.", requirements: "4+ years of DevOps/SRE experience\nStrong AWS or GCP experience\nKubernetes and Docker expertise\nExperience with Terraform", apply_url: "https://example.com/apply", is_featured: 1 },
      { title: "Backend Engineer (Python)", company: "APIWorks", location: "Remote", category: "Engineering", job_type: "Full-time", salary_min: 130000, salary_max: 175000, description: "Build scalable APIs and microservices using Python and FastAPI. You'll design systems that handle millions of requests per day.", requirements: "4+ years of Python backend development\nExperience with FastAPI or Django\nDatabase design (PostgreSQL, Redis)\nAPI design and documentation", apply_url: "https://example.com/apply", is_featured: 1 },
      { title: "Product Manager", company: "InnovateTech", location: "San Francisco, CA", category: "Product", job_type: "Full-time", salary_min: 140000, salary_max: 190000, description: "Define product strategy and roadmap for our flagship SaaS product. You'll work at the intersection of business, technology, and design.", requirements: "5+ years of product management experience\nTechnical background preferred\nExperience with agile methodologies\nStrong data analysis skills", apply_url: "https://example.com/apply", is_featured: 1 },
      { title: "Machine Learning Engineer", company: "AI Solutions", location: "Seattle, WA", category: "Data Science", job_type: "Full-time", salary_min: 160000, salary_max: 220000, description: "Build and deploy ML models that power our AI-driven products. You'll work on NLP, computer vision, and recommendation systems.", requirements: "3+ years of ML engineering experience\nPython, PyTorch/TensorFlow\nExperience deploying models to production\nStrong math/statistics foundation", apply_url: "https://example.com/apply", is_featured: 1 },
      { title: "Junior Software Developer", company: "StartupXYZ", location: "Austin, TX", category: "Engineering", job_type: "Full-time", salary_min: 70000, salary_max: 95000, description: "Great opportunity for a junior developer to grow their skills in a fast-paced startup environment.", requirements: "1+ years of programming experience\nFamiliarity with JavaScript/TypeScript\nBasic understanding of databases\nEager to learn and grow", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "Data Analyst", company: "DataDriven", location: "Chicago, IL", category: "Data Science", job_type: "Part-time", salary_min: 40000, salary_max: 60000, description: "We need a part-time Data Analyst to help us make sense of our growing datasets. You'll create dashboards and run analyses.", requirements: "2+ years of data analysis experience\nProficiency in SQL and Python\nExperience with visualization tools", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "Sales Representative", company: "SalesForce Inc", location: "Miami, FL", category: "Sales", job_type: "Full-time", salary_min: 60000, salary_max: 90000, description: "Drive revenue growth by building relationships with enterprise clients. You'll manage the full sales cycle from prospecting to closing.", requirements: "2+ years of B2B sales experience\nExcellent communication skills\nCRM experience (Salesforce preferred)\nSelf-motivated and goal-oriented", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "UX Researcher", company: "UserFirst", location: "Boston, MA", category: "Design", job_type: "Contract", salary_min: 80000, salary_max: 110000, description: "6-month contract to lead UX research for our product redesign. You'll plan and conduct user studies and synthesize findings.", requirements: "3+ years of UX research experience\nExperience with qualitative and quantitative methods\nStrong presentation skills", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "Customer Support Lead", company: "HelpDesk Pro", location: "Denver, CO", category: "Customer Support", job_type: "Full-time", salary_min: 55000, salary_max: 75000, description: "Lead our customer support team and ensure exceptional service delivery. You'll manage a team of 5 support agents.", requirements: "3+ years of customer support experience\n1+ years in a leadership role\nExperience with helpdesk software", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "Financial Analyst", company: "FinCorp", location: "New York, NY", category: "Finance", job_type: "Full-time", salary_min: 85000, salary_max: 120000, description: "Analyze financial data and create models to support strategic decision-making. You'll work with the CFO and leadership team.", requirements: "2+ years of financial analysis experience\nAdvanced Excel and financial modeling skills\nExperience with ERP systems", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "HR Coordinator", company: "PeopleFirst", location: "Los Angeles, CA", category: "Human Resources", job_type: "Full-time", salary_min: 50000, salary_max: 70000, description: "Support our HR operations including onboarding, benefits administration, and employee relations.", requirements: "1+ years of HR or administrative experience\nFamiliarity with HR software\nExcellent organizational skills", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "Content Marketing Specialist", company: "ContentKing", location: "Remote", category: "Marketing", job_type: "Part-time", salary_min: 45000, salary_max: 65000, description: "Create compelling content that drives organic traffic and engagement. You'll write blog posts, case studies, and social media content.", requirements: "2+ years of content writing experience\nSEO knowledge\nExperience with CMS platforms", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "React Native Developer", company: "MobileApps Co", location: "Austin, TX", category: "Engineering", job_type: "Contract", salary_min: 100000, salary_max: 140000, description: "Build cross-platform mobile apps using React Native. 6-month contract with potential for extension.", requirements: "3+ years of React Native experience\niOS and Android development knowledge\nExperience with app store deployment", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "Growth Marketing Intern", company: "LaunchPad", location: "Remote", category: "Marketing", job_type: "Internship", salary_min: null, salary_max: null, description: "Learn growth marketing from experienced mentors. You'll get hands-on experience with paid ads, email marketing, and analytics.", requirements: "Currently enrolled in college\nInterest in digital marketing\nBasic understanding of social media", apply_url: "https://example.com/apply", is_featured: 0 },
      { title: "Site Reliability Engineer", company: "Uptime Inc", location: "Chicago, IL", category: "DevOps", job_type: "Full-time", salary_min: 135000, salary_max: 170000, description: "Keep our systems running at 99.99% uptime. You'll build monitoring, alerting, and auto-remediation systems.", requirements: "4+ years of SRE/DevOps experience\nLinux systems administration\nPrometheus/Grafana experience", apply_url: "https://example.com/apply", is_featured: 0 },
    ];

    for (const j of jobs) {
      await sql`
        INSERT INTO jobs (user_id, title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url, is_featured)
        VALUES (${userId}, ${j.title}, ${j.company}, ${j.location}, ${j.category}, ${j.job_type}, ${j.salary_min}, ${j.salary_max}, ${j.description}, ${j.requirements}, ${j.apply_url}, ${j.is_featured})
      `;
    }

    const blogPosts = [
      { title: "10 Tips for Landing Your Dream Tech Job", slug: "10-tips-landing-dream-tech-job", excerpt: "Proven strategies to help you stand out in the competitive tech job market.", content: "Looking for your next tech role? Here are 10 proven strategies to help you stand out.\n\n## 1. Tailor Your Resume\nCustomize your resume for each application.\n\n## 2. Build a Portfolio\nShowcase your best work.\n\n## 3. Network Actively\nAttend meetups, conferences, and engage on LinkedIn.", author: "Sarah Johnson", published_at: "2026-04-10" },
      { title: "The Rise of Remote Work: What Employers Need to Know", slug: "rise-of-remote-work-employers-guide", excerpt: "Remote work has fundamentally changed the employment landscape.", content: "Remote work is here to stay. Here's how employers can adapt and thrive.\n\n## The New Normal\nSince 2020, remote work has transformed from a perk to an expectation.\n\n## Building Remote Culture\nCulture doesn't happen by accident in remote teams.", author: "Michael Chen", published_at: "2026-04-08" },
      { title: "Salary Negotiation: A Complete Guide", slug: "salary-negotiation-complete-guide", excerpt: "Learn proven techniques for negotiating your salary and total compensation.", content: "Don't leave money on the table. Here's how to negotiate your salary like a pro.\n\n## Do Your Research\nUse sites like Glassdoor and Levels.fyi to understand market rates.\n\n## Know Your Worth\nList your accomplishments, skills, and unique value.", author: "Emily Rodriguez", published_at: "2026-04-05" },
      { title: "How to Write a Job Description That Attracts Top Talent", slug: "write-job-description-attracts-top-talent", excerpt: "Learn how to craft compelling job descriptions that attract qualified candidates.", content: "Your job description is your first impression. Make it count.\n\n## Start with a Hook\nOpen with what makes your company and role exciting.\n\n## Be Specific About the Role\nDescribe what a typical day or week looks like.", author: "David Park", published_at: "2026-04-01" },
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
