import { MetadataRoute } from "next";
import { getAllJobIds } from "@/lib/jobs";
import { getAllBlogSlugs } from "@/lib/blog";
import { MH_ROLES, AU_LOCATIONS, AU_SPECIALTIES } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://supportive.com.au";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/roles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/locations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/specialties`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/employers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // /roles/[role-slug]
  const roleRoutes: MetadataRoute.Sitemap = MH_ROLES.map((role) => ({
    url: `${baseUrl}/roles/${role.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // /roles/[role-slug]/[location-slug] — programmatic SEO pages
  const roleLocationRoutes: MetadataRoute.Sitemap = MH_ROLES.flatMap((role) =>
    AU_LOCATIONS
      .filter((loc) => loc.state !== null)
      .map((loc) => ({
        url: `${baseUrl}/roles/${role.slug}/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
  );

  // /locations/[location-slug]
  const locationRoutes: MetadataRoute.Sitemap = AU_LOCATIONS
    .filter((loc) => loc.state !== null)
    .map((loc) => ({
      url: `${baseUrl}/locations/${loc.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // /specialties/[specialty-slug]
  const specialtyRoutes: MetadataRoute.Sitemap = AU_SPECIALTIES.map((s) => ({
    url: `${baseUrl}/specialties/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  let jobRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];
  let employerRoutes: MetadataRoute.Sitemap = [];

  try {
    const jobIds = await getAllJobIds();
    jobRoutes = jobIds.map((id) => ({
      url: `${baseUrl}/jobs/${id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not available at build time
  }

  try {
    const slugs = await getAllBlogSlugs();
    blogRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
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
