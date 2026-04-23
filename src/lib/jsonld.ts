import { Job, BlogPost, Employer } from "./types";
import { AU_LOCATIONS } from "@/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://supportive.com.au";

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  "Contract": "CONTRACTOR",
  "Internship": "INTERN",
  "Remote": "OTHER",
};

function parseJobLocation(locationName: string): {
  city: string | null;
  state: string | null;
  isRemote: boolean;
} {
  const loc = AU_LOCATIONS.find((l) => l.name === locationName);
  if (loc) {
    const isRemote = loc.slug === "remote-australia";
    const city = loc.state ? loc.name.split(", ")[0] : null;
    return { city, state: loc.state, isRemote };
  }
  const parts = locationName.split(", ");
  return { city: parts[0] ?? locationName, state: parts[1] ?? null, isRemote: false };
}

export function buildJobPostingSchema(job: Job): Record<string, unknown> {
  const datePosted = new Date(job.created_at).toISOString().split("T")[0];
  const validThrough = new Date(
    new Date(job.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
  ).toISOString().split("T")[0];

  const { city, state, isRemote } = parseJobLocation(job.location);
  const telecommute = isRemote || job.job_type === "Remote";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted,
    validThrough,
    employmentType: EMPLOYMENT_TYPE_MAP[job.job_type] ?? "OTHER",
    url: `${SITE_URL}/jobs/${job.id}`,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: `${SITE_URL}/employers`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(city && { addressLocality: city }),
        ...(state && { addressRegion: state }),
        addressCountry: "AU",
      },
    },
  };

  if (job.salary_min && job.salary_max) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "AUD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: "YEAR",
      },
    };
  }

  if (telecommute) {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = { "@type": "Country", name: "Australia" };
  }

  return schema;
}

export function buildBlogPostingSchema(post: BlogPost): Record<string, unknown> {
  const keywords = [
    post.primary_keyword,
    ...(post.secondary_keywords ? post.secondary_keywords.split(",").map((k) => k.trim()) : []),
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Supportive",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    datePublished: post.published_at,
    dateModified: post.published_at,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    ...(keywords.length > 0 && { keywords: keywords.join(", ") }),
  };
}

export function buildOrganizationSchema(employer: Employer): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: employer.name,
    url: employer.website || `${SITE_URL}/employers/${employer.slug}`,
    ...(employer.logo_url && {
      logo: {
        "@type": "ImageObject",
        url: employer.logo_url,
      },
    }),
    ...(employer.description && { description: employer.description }),
    address: {
      "@type": "PostalAddress",
      addressCountry: "AU",
    },
    sameAs: employer.website ? [employer.website] : [],
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url && { item: `${SITE_URL}${item.url}` }),
    })),
  };
}

export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Supportive",
    url: SITE_URL,
    description: "Mental health and supportive services careers across Australia.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/jobs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildCollectionPageSchema(
  name: string,
  description: string,
  url: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    publisher: {
      "@type": "Organization",
      name: "Supportive",
      url: SITE_URL,
    },
  };
}
