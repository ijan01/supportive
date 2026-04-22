import Link from "next/link";
import { getBlogPostsAdminPaginated } from "@/lib/blog";
import AdminBlogActions from "./client";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

const TYPE_STYLES: Record<string, string> = {
  PILLAR: "bg-violet-100 text-violet-700",
  CLUSTER: "bg-blue-100 text-blue-700",
  CONVERSION: "bg-amber-100 text-amber-700",
};

function TypeBadge({ type }: { type: string | null }) {
  if (!type) return null;
  const cls = TYPE_STYLES[type] ?? "bg-slate-100 text-slate-600";
  const label = type.charAt(0) + type.slice(1).toLowerCase();
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const { posts, total } = await getBlogPostsAdminPaginated(page, PER_PAGE);
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <Link href="/admin" className="text-violet-600 hover:text-violet-700 font-medium">Admin</Link>
            <span className="text-slate-300">&rsaquo;</span>
            <span className="text-slate-500">Blog</span>
            <span className="text-slate-300 mx-1">|</span>
            <Link href="/admin/content" className="text-violet-600 hover:text-violet-700 font-medium">Content Plan</Link>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Blog posts ({total})
          </h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-5 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
        >
          New post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 w-8">#</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Keyword</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {post.article_number ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 leading-tight">{post.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={post.content_type} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {post.target_role
                      ? post.target_role.replace(/-/g, " ")
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs max-w-[180px]">
                    <span className="line-clamp-2">
                      {post.target_keyword || <span className="text-slate-300">—</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {post.published_at ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-AU")
                      : new Date(post.created_at).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3">
                    <AdminBlogActions postId={post.id} slug={post.slug} isPublished={!!post.published_at} />
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No blog posts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} &mdash; {total} posts total
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/blog?page=${page - 1}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white transition-colors"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/blog?page=${page + 1}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
