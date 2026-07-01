import Link from "next/link";
import { getAdminStats, type AdminStats } from "@/lib/admin";
import { getContentPlanStats } from "@/lib/content-plan";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getBlogStats() {
  const [published, drafts] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM blog_posts WHERE published_at IS NOT NULL`,
    sql`SELECT COUNT(*)::int AS count FROM blog_posts WHERE published_at IS NULL`,
  ]);
  return { published: published.rows[0].count as number, drafts: drafts.rows[0].count as number };
}

export default async function AdminDashboard() {
  const defaultStats: AdminStats = { totalUsers: 0, totalJobs: 0, activeJobs: 0, pendingReview: 0, totalApplications: 0, companiesCount: 0 };
  const [stats, contentStats, blogStats] = await Promise.all([
    getAdminStats().catch(() => defaultStats),
    getContentPlanStats().catch(() => ({} as Record<string, number>)),
    getBlogStats().catch(() => ({ published: 0, drafts: 0 })),
  ]);

  const contentTotal = Object.values(contentStats).reduce((a, b) => a + b, 0);
  const contentPublished = contentStats["Published"] || 0;
  const contentActionable = (contentStats["Planned"] || 0) + (contentStats["Brief Ready"] || 0);

  const statCards = [
    { label: "Total users", value: stats.totalUsers, href: "/admin/users" },
    { label: "Companies", value: stats.companiesCount, href: "/admin/companies" },
    { label: "Active jobs", value: stats.activeJobs, href: "/admin/jobs?status=active" },
    { label: "Pending review", value: stats.pendingReview, href: "/admin/review-queue" },
    { label: "Applications", value: stats.totalApplications, href: null },
    { label: "Blog posts", value: blogStats.published, href: "/admin/blog" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Admin dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {statCards.map((card) => {
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

      {/* Content section */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Content</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/content" className="block bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900">Content Plan</h3>
            {contentActionable > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">{contentActionable} need action</span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-3">Plan and track SEO articles across pillar, cluster, and conversion content.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span><strong className="text-slate-600">{contentPublished}</strong> published</span>
            <span><strong className="text-slate-600">{contentStats["Draft"] || 0}</strong> drafts</span>
            <span><strong className="text-slate-600">{contentTotal}</strong> total</span>
          </div>
        </Link>

        <Link href="/admin/blog" className="block bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900">Blog</h3>
            {blogStats.drafts > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">{blogStats.drafts} draft{blogStats.drafts !== 1 ? "s" : ""}</span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-3">Create, edit, and publish blog posts. Published posts appear on /blog.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span><strong className="text-slate-600">{blogStats.published}</strong> published</span>
            <span><strong className="text-slate-600">{blogStats.drafts}</strong> drafts</span>
          </div>
        </Link>

        <Link href="/admin/agent" className="block bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-300 hover:shadow-md transition-all">
          <h3 className="font-bold text-slate-900 mb-2">Content Agent</h3>
          <p className="text-sm text-slate-500">Configure the AI model and system prompt used for article generation.</p>
        </Link>
      </div>

      {/* Manage section */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Manage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Jobs", description: "View, search, and manage all jobs", href: "/admin/jobs" },
          { label: "Users", description: "View all users and manage roles", href: "/admin/users" },
          { label: "Companies", description: "View employer accounts and their activity", href: "/admin/companies" },
          { label: "Review queue", description: "Approve or reject queued job listings", href: "/admin/review-queue" },
          { label: "Feed ingestion", description: "Run Adzuna ingestion manually", href: "/admin/feeds" },
          { label: "Feed history", description: "View past ingestion runs and stats", href: "/admin/feed-runs" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="block bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-300 hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
            <p className="text-sm text-slate-500">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
