import Link from "next/link";
import Hero from "@/components/Hero";
import JobCard from "@/components/JobCard";
import StatsSection from "@/components/StatsSection";
import { getFeaturedJobs } from "@/lib/jobs";
import { getBlogPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredJobs = await getFeaturedJobs(6);
  const blogPosts = (await getBlogPosts()).slice(0, 3);

  return (
    <>
      <Hero />
      <StatsSection />

      {/* Employer strip */}
      <section className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-1">For employers</p>
              <h2 className="text-xl font-bold text-slate-900">Hiring in mental health or community services?</h2>
              <p className="text-slate-500 text-sm mt-1">Post a role and reach candidates who are already looking for exactly what you offer. Free to list.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/employers" className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm">
                Learn more
              </Link>
              <Link href="/auth/register" className="px-5 py-2.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all text-sm">
                Post a role
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Latest roles</h2>
              <Link href="/jobs" className="text-violet-600 font-medium hover:text-violet-700 transition-colors">
                View all roles &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Career Insights</h2>
              <Link href="/blog" className="text-violet-600 font-medium hover:text-violet-700 transition-colors">
                Read more &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="text-sm text-violet-600 font-medium mb-2">
                      {new Date(post.published_at!).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-violet-600 transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3">{post.excerpt}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to find your next role?</h2>
          <p className="text-purple-100 text-lg mb-8">Browse mental health and supportive services roles posted by mission-aligned employers across Australia.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs" className="px-8 py-3.5 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition-all shadow-lg">
              Browse Jobs
            </Link>
            <Link href="/auth/register" className="px-8 py-3.5 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
