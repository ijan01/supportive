import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPostBySlugAdmin, getAllBlogSlugs } from "@/lib/blog";
import { getSession } from "@/lib/session";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import BlogContent from "./content";
import { buildBlogPostingSchema, buildBreadcrumbSchema } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const keywordList = [
    post.primary_keyword,
    ...(post.secondary_keywords ? post.secondary_keywords.split(",").map((k) => k.trim()) : []),
  ].filter(Boolean) as string[];

  return {
    title: post.title,
    description: post.excerpt,
    keywords: keywordList.length ? keywordList : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/opengraph-image"],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogSlugs();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post = await getBlogPostBySlug(slug);
  let isDraft = false;

  // Allow admins to preview unpublished drafts
  if (!post) {
    const session = await getSession();
    if (session?.user?.role === "admin") {
      post = await getBlogPostBySlugAdmin(slug);
      if (post) isDraft = true;
    }
  }
  if (!post) notFound();

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const articleSchema = buildBlogPostingSchema(post);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title },
  ]);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {isDraft && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
          Draft preview — this post is not published yet. Only admins can see this page.
        </div>
      )}
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: post.title },
      ]} />

      <header className="mb-10">
        <div className="text-sm text-violet-600 font-semibold uppercase tracking-wide mb-3">{date}</div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">{post.title}</h1>
        <p className="text-xl text-slate-500 mb-6">{post.excerpt}</p>
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
            {post.author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{post.author}</div>
            <div className="text-xs text-slate-500">Writer at Supportive</div>
          </div>
        </div>
      </header>

      <BlogContent content={post.content} />
    </article>
  );
}
