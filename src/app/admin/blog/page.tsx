import Link from "next/link";
import { getAllBlogPostsAdmin } from "@/lib/blog";
import AdminBlogActions from "./client";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsAdmin();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <Link href="/admin" className="text-violet-600 hover:text-violet-700 font-medium">Admin</Link>
            <span className="text-slate-300">&rsaquo;</span>
            <span className="text-slate-500">Blog</span>
            <span className="text-slate-300 mx-1">|</span>
            <Link href="/admin/content" className="text-violet-600 hover:text-violet-700 font-medium">Content Plan</Link>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Blog posts ({posts.length})</h1>
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
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Created</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{post.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{post.author}</td>
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
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(post.created_at).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3">
                    <AdminBlogActions postId={post.id} slug={post.slug} isPublished={!!post.published_at} />
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No blog posts yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
