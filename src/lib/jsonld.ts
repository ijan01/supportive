import { Job } from "./types";
import { AU_LOCATIONS } from "@/constants";

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
  // Fallback for unrecognised locations: split "City, STATE"
  const parts = locationName.split(", ");
  return { city: parts[0] ?? locationName, state: parts[1] ?? null, isRemote: false };
}

export function buildJobPostingSchema(job: Job): Record<string, unknown> {
  const datePosted = new Date(job.created_at).toISOString().split("T")[0];
  const validThrough = new Date(
    new Date(job.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  const { city, state, isRemote } = parseJobLocation(job.location);
  const isRemoteType = job.job_type === "Remote";
  const telecommute = isRemote || isRemoteType;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted,
    validThrough,
    employmentType: EMPLOYMENT_TYPE_MAP[job.job_type] ?? "OTHER",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
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
    schema.applicantLocationRequirements = {
      "@type": "Country",
      name: "Australia",
    };
  }

  return schema;
}
