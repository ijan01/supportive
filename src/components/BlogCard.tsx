import Link from "next/link";
import { BlogPost } from "@/lib/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
        <div className="h-40 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center">
          <span className="text-5xl">📝</span>
        </div>
        <div className="p-6">
          <div className="text-xs text-violet-600 font-semibold uppercase tracking-wide mb-2">{date}</div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-violet-600 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
          <div className="text-sm text-slate-400">By {post.author}</div>
        </div>
      </article>
    </Link>
  );
}
