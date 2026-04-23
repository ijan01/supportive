import { MetadataRoute } from "next";
import { getAllJobIds } from "@/lib/jobs";
import { getAllBlogSlugs } from "@/lib/blog";
import { MH_ROLES, AU_LOCATIONS, AU_SPECIALTIES } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://supportive.com.au";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/roles`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/locations`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/specialties`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/employers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const roleRoutes: MetadataRoute.Sitemap = MH_ROLES.map((role) => ({
    url: `${baseUrl}/roles/${role.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const roleLocationRoutes: MetadataRoute.Sitemap = MH_ROLES.flatMap((role) =>
    AU_LOCATIONS
      .filter((loc) => loc.state !== null)
      .map((loc) => ({
        url: `${baseUrl}/roles/${role.slug}/${loc.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
  );

  const locationRoutes: MetadataRoute.Sitemap = AU_LOCATIONS
    .filter((loc) => loc.state !== null)
    .map((loc) => ({
      url: `${baseUrl}/locations/${loc.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const specialtyRoutes: MetadataRoute.Sitemap = AU_SPECIALTIES.map((s) => ({
    url: `${baseUrl}/specialties/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  let jobRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];
  let employerRoutes: MetadataRoute.Sitemap = [];

  try {
    const jobs = await getAllJobIds();
    jobRoutes = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: new Date(job.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not available at build time
  }

  try {
    const posts = await getAllBlogSlugs();
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not available at build time
  }

  try {
    const { getAllEmployers } = await import("@/lib/employers");
    const employers = await getAllEmployers();
    employerRoutes = employers
      .filter((e) => e.directory_visible)
      .map((e) => ({
        url: `${baseUrl}/employers/${e.slug}`,
        lastModified: new Date(e.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
  } catch {
    // DB not available at build time
  }

  return [
    ...staticRoutes,
    ...roleRoutes,
    ...roleLocationRoutes,
    ...locationRoutes,
    ...specialtyRoutes,
    ...jobRoutes,
    ...blogRoutes,
    ...employerRoutes,
  ];
}
