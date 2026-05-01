import { Metadata } from "next";
import Link from "next/link";
import { getBlogPostsPaginated } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 12;

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Psychologist", value: "psychologist" },
  { label: "Counsellor", value: "counsellor" },
  { label: "Mental Health Nurse", value: "mental health nurse" },
  { label: "Social Worker", value: "social worker" },
  { label: "AOD & Substance Use", value: "aod" },
  { label: "Career Advice", value: "career" },
  { label: "For Employers", value: "employer" },
];

export const metadata: Metadata = {
  title: "Career Blog",
  description: "Career advice, job search tips, and insights for professionals and hiring managers.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Career Blog | Supportive",
    description: "Career advice, job search tips, and insights for professionals.",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "";
  const page = Math.max(1, Number(params.page) || 1);

  const { posts, total } = await getBlogPostsPaginated(page, POSTS_PER_PAGE, category || null);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  function buildUrl(p: number, cat: string) {
    const parts: string[] = [];
    if (cat) parts.push(`category=${encodeURIComponent(cat)}`);
    if (p > 1) parts.push(`page=${p}`);
    return parts.length ? `/blog?${parts.join("&")}` : "/blog";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Career Blog</h1>
        <p className="text-slate-500">Tips, insights, and advice for your career journey</p>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.value;
          return (
            <Link
              key={cat.value}
              href={buildUrl(1, cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-500">No blog posts found{category ? ` for "${category}"` : ""}.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link
              href={buildUrl(page - 1, category)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-violet-300"
            >
              Previous
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildUrl(p, category)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                p === page
                  ? "bg-violet-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:border-violet-300"
              }`}
            >
              {p}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={buildUrl(page + 1, category)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-violet-300"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
