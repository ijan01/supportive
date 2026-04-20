import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostById } from "@/lib/blog";
import BlogPostForm from "@/components/BlogPostForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const id = parseInt(params.id || "", 10);
  if (!id) notFound();

  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/blog" className="text-sm text-violet-600 hover:text-violet-700 font-medium">Blog posts</Link>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Edit post</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <BlogPostForm
          mode="edit"
          initialData={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            author: post.author,
            published: !!post.published_at,
          }}
        />
      </div>
    </div>
  );
}
