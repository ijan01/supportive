import { sql } from "./index";
import { initSchema } from "./schema";
import { hashSync } from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function seed() {
  await initSchema();

  // Clear existing data
  await sql`DELETE FROM saved_jobs`;
  await sql`DELETE FROM applications`;
  await sql`DELETE FROM blog_posts`;
  await sql`DELETE FROM jobs`;
  await sql`DELETE FROM users`;

  // Create demo users
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

  const jobs: Array<[number, string, string, string, string, string, number | null, number | null, string, string, string, number]> = [
    [userId, "Senior Frontend Engineer", "TechCorp", "San Francisco, CA", "Engineering", "Full-time", 150000, 200000, "We're looking for a Senior Frontend Engineer to lead our UI team. You'll architect and build complex web applications using React and TypeScript.\n\nYou'll work closely with designers and backend engineers to deliver exceptional user experiences. Our tech stack includes Next.js, TypeScript, and Tailwind CSS.", "5+ years of frontend development experience\nExpert in React and TypeScript\nExperience with Next.js\nStrong CSS/Tailwind skills\nExperience leading technical projects", "https://example.com/apply", 1],
    [userId, "Product Designer", "DesignStudio", "Remote", "Design", "Full-time", 120000, 160000, "Join our design team to create beautiful, intuitive interfaces for our SaaS platform. You'll own the design process from research to final implementation.", "4+ years of product design experience\nProficiency in Figma\nExperience with design systems\nStrong portfolio", "https://example.com/apply", 1],
    [userId, "Marketing Manager", "GrowthCo", "New York, NY", "Marketing", "Full-time", 90000, 130000, "Lead our marketing efforts and drive growth across all channels. You'll develop and execute marketing strategies.", "3+ years of marketing experience\nExperience with digital marketing channels\nStrong analytical skills", "https://example.com/apply", 0],
    [userId, "Data Analyst", "DataDriven", "Chicago, IL", "Data Science", "Part-time", 40000, 60000, "We need a part-time Data Analyst to help us make sense of our growing datasets. You'll create dashboards and run analyses.", "2+ years of data analysis experience\nProficiency in SQL and Python\nExperience with visualization tools", "https://example.com/apply", 0],
    [userId, "DevOps Engineer", "CloudScale", "Seattle, WA", "DevOps", "Remote", 140000, 180000, "Join our infrastructure team to build and maintain our cloud platform. You'll work on CI/CD pipelines, container orchestration, and monitoring systems.", "4+ years of DevOps/SRE experience\nStrong AWS or GCP experience\nKubernetes and Docker expertise\nExperience with Terraform", "https://example.com/apply", 1],
    [userId, "Junior Software Developer", "StartupXYZ", "Austin, TX", "Engineering", "Full-time", 70000, 95000, "Great opportunity for a junior developer to grow their skills in a fast-paced startup environment. You'll work on full-stack features using modern web technologies.", "1+ years of programming experience\nFamiliarity with JavaScript/TypeScript\nBasic understanding of databases\nEager to learn and grow", "https://example.com/apply", 0],
    [userId, "Sales Representative", "SalesForce Inc", "Miami, FL", "Sales", "Full-time", 60000, 90000, "Drive revenue growth by building relationships with enterprise clients. You'll manage the full sales cycle from prospecting to closing.", "2+ years of B2B sales experience\nExcellent communication skills\nCRM experience (Salesforce preferred)\nSelf-motivated and goal-oriented", "https://example.com/apply", 0],
    [userId, "UX Researcher", "UserFirst", "Boston, MA", "Design", "Contract", 80000, 110000, "6-month contract to lead UX research for our product redesign. You'll plan and conduct user studies, synthesize findings, and drive design decisions.", "3+ years of UX research experience\nExperience with qualitative and quantitative methods\nStrong presentation skills", "https://example.com/apply", 0],
    [userId, "Customer Support Lead", "HelpDesk Pro", "Denver, CO", "Customer Support", "Full-time", 55000, 75000, "Lead our customer support team and ensure exceptional service delivery. You'll manage a team of 5 support agents.", "3+ years of customer support experience\n1+ years in a leadership role\nExperience with helpdesk software\nExcellent problem-solving skills", "https://example.com/apply", 0],
    [userId, "Financial Analyst", "FinCorp", "New York, NY", "Finance", "Full-time", 85000, 120000, "Analyze financial data and create models to support strategic decision-making. You'll work with the CFO and leadership team.", "2+ years of financial analysis experience\nAdvanced Excel and financial modeling skills\nExperience with ERP systems\nCFA or MBA preferred", "https://example.com/apply", 0],
    [userId, "Backend Engineer (Python)", "APIWorks", "Remote", "Engineering", "Full-time", 130000, 175000, "Build scalable APIs and microservices using Python and FastAPI. You'll design systems that handle millions of requests per day.", "4+ years of Python backend development\nExperience with FastAPI or Django\nDatabase design (PostgreSQL, Redis)\nAPI design and documentation", "https://example.com/apply", 1],
    [userId, "HR Coordinator", "PeopleFirst", "Los Angeles, CA", "Human Resources", "Full-time", 50000, 70000, "Support our HR operations including onboarding, benefits administration, and employee relations.", "1+ years of HR or administrative experience\nFamiliarity with HR software\nExcellent organizational skills\nStrong interpersonal skills", "https://example.com/apply", 0],
    [userId, "Content Marketing Specialist", "ContentKing", "Remote", "Marketing", "Part-time", 45000, 65000, "Create compelling content that drives organic traffic and engagement. You'll write blog posts, case studies, and social media content.", "2+ years of content writing experience\nSEO knowledge\nExperience with CMS platforms\nStrong research skills", "https://example.com/apply", 0],
    [userId, "Product Manager", "InnovateTech", "San Francisco, CA", "Product", "Full-time", 140000, 190000, "Define product strategy and roadmap for our flagship SaaS product. You'll work at the intersection of business, technology, and design.", "5+ years of product management experience\nTechnical background preferred\nExperience with agile methodologies\nStrong data analysis skills", "https://example.com/apply", 1],
    [userId, "Machine Learning Engineer", "AI Solutions", "Seattle, WA", "Data Science", "Full-time", 160000, 220000, "Build and deploy ML models that power our AI-driven products. You'll work on NLP, computer vision, and recommendation systems.", "3+ years of ML engineering experience\nPython, PyTorch/TensorFlow\nExperience deploying models to production\nStrong math/statistics foundation", "https://example.com/apply", 1],
    [userId, "React Native Developer", "MobileApps Co", "Austin, TX", "Engineering", "Contract", 100000, 140000, "Build cross-platform mobile apps using React Native. 6-month contract with potential for extension.", "3+ years of React Native experience\niOS and Android development knowledge\nExperience with app store deployment\nStrong JavaScript/TypeScript skills", "https://example.com/apply", 0],
    [userId, "Growth Marketing Intern", "LaunchPad", "Remote", "Marketing", "Internship", null, null, "Learn growth marketing from experienced mentors. You'll get hands-on experience with paid ads, email marketing, and analytics.", "Currently enrolled in college\nInterest in digital marketing\nBasic understanding of social media\nEager to learn", "https://example.com/apply", 0],
    [userId, "Site Reliability Engineer", "Uptime Inc", "Chicago, IL", "DevOps", "Full-time", 135000, 170000, "Keep our systems running at 99.99% uptime. You'll build monitoring, alerting, and auto-remediation systems.", "4+ years of SRE/DevOps experience\nLinux systems administration\nPrometheus/Grafana experience\nIncident management experience", "https://example.com/apply", 0],
  ];

  for (const j of jobs) {
    await sql`
      INSERT INTO jobs (user_id, title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url, is_featured)
      VALUES (${j[0]}, ${j[1]}, ${j[2]}, ${j[3]}, ${j[4]}, ${j[5]}, ${j[6]}, ${j[7]}, ${j[8]}, ${j[9]}, ${j[10]}, ${j[11]})
    `;
  }

  const posts: Array<[string, string, string, string, string, string]> = [
    ["10 Tips for Landing Your Dream Tech Job", "10-tips-landing-dream-tech-job", "Looking for your next tech role? Here are 10 proven strategies to help you stand out.\n\n## 1. Tailor Your Resume\nCustomize your resume for each application. Highlight relevant skills and experiences that match the job description.\n\n## 2. Build a Portfolio\nShowcase your best work. A strong portfolio speaks louder than a resume.\n\n## 3. Network Actively\nAttend meetups, conferences, and engage on LinkedIn. Many jobs are filled through referrals.\n\n## 4. Practice Coding Interviews\nUse platforms like LeetCode and HackerRank to sharpen your skills.\n\n## 5. Research the Company\nUnderstand the company's mission, products, and culture before your interview.\n\n## 6. Prepare STAR Stories\nUse the Situation, Task, Action, Result framework for behavioral questions.\n\n## 7. Follow Up\nSend a thoughtful thank-you email after every interview.\n\n## 8. Negotiate Your Offer\nDon't accept the first offer. Research market rates and negotiate confidently.\n\n## 9. Stay Current\nKeep learning new technologies and frameworks relevant to your field.\n\n## 10. Be Patient\nJob searching takes time. Stay persistent and don't get discouraged.", "Proven strategies to help you stand out in the competitive tech job market and land the role you've been dreaming of.", "Sarah Johnson", "2026-04-10"],
    ["The Rise of Remote Work: What Employers Need to Know", "rise-of-remote-work-employers-guide", "Remote work is here to stay. Here's how employers can adapt and thrive.\n\n## The New Normal\nSince 2020, remote work has transformed from a perk to an expectation. Companies that embrace it gain access to a global talent pool.\n\n## Building Remote Culture\nCulture doesn't happen by accident in remote teams. Schedule regular virtual social events, create dedicated Slack channels for non-work topics, and invest in annual retreats.\n\n## Tools for Success\nEquip your team with the right tools: Slack for communication, Zoom for meetings, Notion for documentation, and GitHub for collaboration.\n\n## Managing Performance\nFocus on outcomes, not hours. Set clear goals and trust your team to deliver.\n\n## The Hybrid Approach\nMany companies find success with a hybrid model.", "Remote work has fundamentally changed the employment landscape. Learn how to build effective remote teams and attract top talent.", "Michael Chen", "2026-04-08"],
    ["Salary Negotiation: A Complete Guide", "salary-negotiation-complete-guide", "Don't leave money on the table. Here's how to negotiate your salary like a pro.\n\n## Do Your Research\nUse sites like Glassdoor, Levels.fyi, and Payscale to understand market rates for your role and location.\n\n## Know Your Worth\nList your accomplishments, skills, and unique value. Quantify your impact wherever possible.\n\n## Timing Matters\nNegotiate after you receive an offer, not during early interviews.\n\n## The Conversation\nExpress enthusiasm first, then state your case.\n\n## Beyond Base Salary\nConsider the total package: equity, signing bonus, PTO, remote work, professional development budget, and other benefits.\n\n## Practice\nRehearsal your negotiation with a friend or mentor.\n\n## Walking Away\nKnow your minimum acceptable offer before you start negotiating.", "Learn proven techniques for negotiating your salary and total compensation package to maximize your earning potential.", "Emily Rodriguez", "2026-04-05"],
    ["How to Write a Job Description That Attracts Top Talent", "write-job-description-attracts-top-talent", "Your job description is your first impression. Make it count.\n\n## Start with a Hook\nOpen with what makes your company and role exciting. Skip the boring corporate boilerplate.\n\n## Be Specific About the Role\nDescribe what a typical day or week looks like.\n\n## List Requirements Honestly\nOnly list truly required qualifications.\n\n## Include Salary Range\nTransparency builds trust. Companies that list salary ranges get 30% more applications.\n\n## Highlight Growth\nTop candidates want to know how they'll develop.\n\n## Showcase Culture\nDescribe your team dynamics, work style, and values.\n\n## Keep It Scannable\nUse bullet points, headers, and short paragraphs.", "Learn how to craft compelling job descriptions that attract qualified candidates and reduce time-to-hire.", "David Park", "2026-04-01"],
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
