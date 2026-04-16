import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getJobById } from "@/lib/jobs";
import { formatSalary } from "@/lib/utils";
import { JOB_TYPE_COLORS } from "@/constants";
import JobDetailClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(Number(id));
  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title} at ${job.company}`,
    description: `${job.title} - ${job.job_type} position at ${job.company} in ${job.location}. ${formatSalary(job.salary_min, job.salary_max)}`,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: `${job.job_type} position in ${job.location}`,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJobById(Number(id));
  if (!job) notFound();

  const badgeColor = JOB_TYPE_COLORS[job.job_type] || "bg-slate-100 text-slate-700";
  const salary = formatSalary(job.salary_min, job.salary_max);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } },
    employmentType: job.job_type.toUpperCase().replace("-", "_").replace(" ", "_"),
    ...(job.salary_min && job.salary_max
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: { "@type": "QuantitativeValue", minValue: job.salary_min, maxValue: job.salary_max, unitText: "YEAR" },
          },
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-500 mb-6">
          <a href="/" className="hover:text-violet-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/jobs" className="hover:text-violet-600">Jobs</a>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{job.title}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
                {job.company.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">{job.title}</h1>
                <p className="text-purple-100 text-lg">{job.company}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">{job.location}</span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">{job.job_type}</span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">{job.category}</span>
              {salary && <span className="px-3 py-1 rounded-full bg-amber-400/90 text-slate-900 text-sm font-semibold">{salary}</span>}
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <JobDetailClient jobId={job.id} jobTitle={job.title} />

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Job Description</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.requirements}</div>
            </section>

            {job.apply_url && (
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Apply on Company Site
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
