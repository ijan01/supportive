import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import BlogContent from "./content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({ slug }));
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
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.published_at,
    publisher: { "@type": "Organization", name: "Supportive" },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd data={jsonLd} />
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
