import { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Career Blog",
  description: "Career advice, job search tips, and insights for professionals and hiring managers.",
  openGraph: {
    title: "Career Blog | JobBoard",
    description: "Career advice, job search tips, and insights for professionals.",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Career Blog</h1>
        <p className="text-slate-500">Tips, insights, and advice for your career journey</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">No blog posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
