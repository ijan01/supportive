import Link from "next/link";
import { getAdminStats } from "@/lib/admin";
import { getContentPlanStats } from "@/lib/content-plan";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, contentStats] = await Promise.all([
    getAdminStats(),
    getContentPlanStats().catch(() => ({} as Record<string, number>)),
  ]);
  const contentActionable = (contentStats["Planned"] || 0) + (contentStats["Brief Ready"] || 0);

  const cards = [
    { label: "Total users", value: stats.totalUsers, href: "/admin/users" },
    { label: "Companies", value: stats.companiesCount, href: "/admin/companies" },
    { label: "Total jobs", value: stats.totalJobs, href: "/admin/jobs" },
    { label: "Active jobs", value: stats.activeJobs, href: "/admin/jobs?status=active" },
    { label: "Pending review", value: stats.pendingReview, href: "/admin/review-queue" },
    { label: "Applications", value: stats.totalApplications, href: null },
  ];

  const navItems = [
    { label: "Content Plan", description: `Plan and track 100 SEO articles${contentActionable > 0 ? ` (${contentActionable} need action)` : ""}`, href: "/admin/content" },
    { label: "Blog", description: "Create, edit, and publish blog posts", href: "/admin/blog" },
    { label: "Jobs", description: "View, search, and manage all jobs", href: "/admin/jobs" },
    { label: "Users", description: "View all users and manage roles", href: "/admin/users" },
    { label: "Companies", description: "View employer accounts and their activity", href: "/admin/companies" },
    { label: "Review queue", description: "Approve or reject queued job listings", href: "/admin/review-queue" },
    { label: "Feed ingestion", description: "Run Adzuna ingestion manually", href: "/admin/feeds" },
    { label: "Feed history", description: "View past ingestion runs and stats", href: "/admin/feed-runs" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Admin dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {cards.map((card) => {
          const inner = (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-violet-300 hover:shadow-md transition-all">
              <div className="text-2xl font-extrabold text-violet-600">{card.value}</div>
              <div className="text-sm text-slate-500 mt-1">{card.label}</div>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>{inner}</Link>
          ) : (
            <div key={card.label}>{inner}</div>
          );
        })}
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Manage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="block bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-300 hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
            <p className="text-sm text-slate-500">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
