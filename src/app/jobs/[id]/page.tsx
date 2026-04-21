import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getJobById, trackJobEvent } from "@/lib/jobs";
import { getSession } from "@/lib/session";
import { formatSalary } from "@/lib/utils";
import { buildJobPostingSchema } from "@/lib/jsonld";
import { ORGANISATION_TYPES, EMPLOYER_BENEFITS } from "@/constants";
import JobDetailClient from "./client";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(Number(id));
  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title} at ${job.company}`,
    description: `${job.title} - ${job.job_type} position at ${job.company} in ${job.location}. ${formatSalary(job.salary_min, job.salary_max)}`,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: `${job.job_type} position in ${job.location}`,
      type: "website",
    },
    alternates: {
      canonical: `/jobs/${job.id}`,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(Number(id));
  if (!job) notFound();

  // Track view server-side
  trackJobEvent(job.id, "view").catch(() => {});

  const salary = formatSalary(job.salary_min, job.salary_max);
  const jsonLd = buildJobPostingSchema(job);
  const session = await getSession();
  const orgType = ORGANISATION_TYPES.find((t) => t.value === job.employer_organisation_type);
  const benefits = (job.employer_benefits || [])
    .map((slug: string) => EMPLOYER_BENEFITS.find((b) => b.slug === slug))
    .filter(Boolean);

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Jobs", href: "/jobs" },
            { label: job.title },
          ]}
        />

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-violet-600 p-8 sm:p-10 text-white">
            <div className="flex items-start gap-4">
              {job.employer_logo_url ? (
                <img src={job.employer_logo_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/20 shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
                  {job.company.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">{job.title}</h1>
                <div className="flex items-center gap-2">
                  <Link href={`/employers/${job.employer_slug || job.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-violet-100 text-lg hover:text-white transition-colors">
                    {job.company}
                  </Link>
                  {orgType && orgType.value !== "other" && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/20 text-white">{orgType.label}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">{job.location}</span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">{job.job_type}</span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">{job.category}</span>
              {salary && (
                <span className="px-3 py-1 rounded-full bg-white text-violet-600 text-sm font-semibold">
                  {salary}
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 sm:p-10">
            <JobDetailClient jobId={job.id} jobTitle={job.title} userRole={session?.user?.role ?? null} />

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Job Description</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</div>
              {job.source === "adzuna" && (
                <p className="mt-4 text-sm text-slate-400">
                  This is a summary sourced from{" "}
                  <a href="https://www.adzuna.com.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
                    Adzuna
                  </a>
                  . The full description, requirements, and application form are available on the next page.
                </p>
              )}
            </section>

            {job.requirements && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.requirements}</div>
              </section>
            )}

            {benefits.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">What we offer</h2>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((b) => (
                    <span key={b!.slug} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {b!.label}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {job.apply_url && (
              <a
                href={job.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all"
              >
                {job.source === "adzuna" ? "View full listing & apply" : "Apply on company site"}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
