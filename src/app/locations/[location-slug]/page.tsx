import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { AU_LOCATIONS, MH_ROLES } from "@/constants";
import { getJobs, getJobCount } from "@/lib/jobs";
import { LOCATION_CONTENT } from "@/content/locations";
import JobCard from "@/components/JobCard";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildCollectionPageSchema, buildBreadcrumbSchema } from "@/lib/jsonld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://supportive.com.au";

export function generateStaticParams() {
  return AU_LOCATIONS.map((l) => ({ "location-slug": l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "location-slug": string }>;
}): Promise<Metadata> {
  const p = await params;
  const loc = AU_LOCATIONS.find((l) => l.slug === p["location-slug"]);
  if (!loc) return { title: "Not found" };

  const content = LOCATION_CONTENT[p["location-slug"]];

  let count = 0;
  try {
    count = await getJobCount({ location: loc.name });
  } catch {
    // DB not available at build time
  }

  const description = content?.summary ?? `Browse ${count > 0 ? `${count} ` : ""}mental health and supportive services roles in ${loc.name}. Find clinical, allied health, community, and NDIS positions on Supportive.`;

  return {
    title: `Mental health jobs in ${loc.name}`,
    description,
    alternates: { canonical: `/locations/${p["location-slug"]}` },
    openGraph: {
      title: `Mental health jobs in ${loc.name}`,
      description,
      type: "website",
      url: `${siteUrl}/locations/${p["location-slug"]}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `Mental health jobs in ${loc.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Mental health jobs in ${loc.name}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function LocationHubPage({
  params,
}: {
  params: Promise<{ "location-slug": string }>;
}) {
  const p = await params;
  const loc = AU_LOCATIONS.find((l) => l.slug === p["location-slug"]);
  if (!loc) notFound();

  const content = LOCATION_CONTENT[p["location-slug"]];

  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  let total = 0;
  try {
    [jobs, total] = await Promise.all([
      getJobs({ location: loc.name, limit: 6 }),
      getJobCount({ location: loc.name }),
    ]);
  } catch {
    // DB not available at build time
  }

  const description = content?.summary ?? `Browse mental health and supportive services roles in ${loc.name}. Find clinical, allied health, community, and NDIS positions on Supportive.`;
  const collectionSchema = buildCollectionPageSchema(
    `Mental health jobs in ${loc.name}`,
    description,
    `/locations/${p["location-slug"]}`
  );
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: loc.name },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Locations", href: "/locations" },
        { label: loc.name },
      ]} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Mental health jobs in {loc.name}</h1>
      <p className="text-slate-500 mb-8">
        {total > 0
          ? `${total} current role${total !== 1 ? "s" : ""} available`
          : "No current listings — check back soon."}
      </p>

      {/* Live job listings */}
      {jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {total > 6 && (
            <div className="mb-10">
              <Link
                href={`/jobs?location=${encodeURIComponent(loc.name)}`}
                className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
              >
                View all {total} roles in {loc.name} &rarr;
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="bg-lavender border border-violet-100 rounded-2xl p-8 mb-10 text-center">
          <p className="text-slate-600 font-medium mb-2">No roles in {loc.name} right now</p>
          <p className="text-slate-500 text-sm mb-4">New roles are added daily. Check back soon or browse all current roles.</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
          >
            Browse all roles
          </Link>
        </div>
      )}

      {/* Editorial content */}
      {content && (
        <div className="mt-12 space-y-10 border-t border-slate-100 pt-10">
          <section>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">Mental health work in {loc.name}</h2>
            <div className="space-y-4">
              {content.about.map((para, i) => (
                <p key={i} className="text-slate-600 leading-relaxed">{para}</p>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Workforce demand</h2>
            <p className="text-sm text-slate-600">{content.demandNote}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Key employers in {loc.name}</h2>
            <ul className="flex flex-wrap gap-2">
              {content.keyEmployers.map((employer) => (
                <li key={employer} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-sm text-slate-600">
                  {employer}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Browse roles in {loc.name}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MH_ROLES.map((role) => (
            <li key={role.slug}>
              <Link
                href={`/roles/${role.slug}/${p["location-slug"]}`}
                className="block px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all"
              >
                {role.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
