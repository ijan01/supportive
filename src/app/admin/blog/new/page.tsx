import Link from "next/link";
import BlogPostForm from "@/components/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/blog" className="text-sm text-violet-600 hover:text-violet-700 font-medium">Blog posts</Link>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">New blog post</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <BlogPostForm mode="create" />
      </div>
    </div>
  );
}
