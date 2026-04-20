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

      {/* How it works */}
      <section className="py-20 bg-lavender">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-violet-200 bg-white text-violet-600 text-sm font-medium mb-4">
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Find your next role in{" "}
              <span className="text-highlight">three&nbsp;simple&nbsp;steps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                heading: "Browse roles",
                body: "Search across 18 role categories, filter by location, specialisation, and employment type. Every listing is in mental health or community services.",
              },
              {
                step: "02",
                heading: "Create your profile",
                body: "Sign up for free in 30 seconds. Save roles you like, track your applications, and get notified when new roles match your interests.",
              },
              {
                step: "03",
                heading: "Apply with confidence",
                body: "Apply directly through Supportive or on the employer's site. Every role is posted by a mission-aligned organisation in the sector.",
              },
            ].map(({ step, heading, body }) => (
              <div key={step} className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm mb-5">
                  {step}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{heading}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-600 text-sm font-medium mb-3">
                  Latest roles
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  Take a look at{" "}
                  <span className="text-highlight">recent&nbsp;openings</span>
                </h2>
              </div>
              <Link href="/jobs" className="px-6 py-2.5 rounded-full border border-violet-200 text-violet-600 font-medium hover:bg-violet-50 transition-all text-sm shrink-0">
                View all roles
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

      {/* Why Supportive */}
      <section className="py-20 bg-lavender">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-violet-200 bg-white text-violet-600 text-sm font-medium mb-4">
              Why Supportive
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Built specifically for{" "}
              <span className="text-highlight">mental&nbsp;health&nbsp;careers</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                heading: "Purpose-built for the sector",
                body: "Every role on Supportive is in mental health, AOD, NDIS, or community services. No noise — just the roles that matter to you.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                ),
              },
              {
                heading: "18 role categories",
                body: "From psychologists and mental health nurses to peer support workers and AOD counsellors — search using the job titles your sector actually uses.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg>
                ),
              },
              {
                heading: "Completely free",
                body: "Free for job seekers. Free for employers during launch. No hidden fees, no paywall on applications, no premium listings.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                ),
              },
              {
                heading: "Australia-wide coverage",
                body: "Roles across all states and territories — Sydney, Melbourne, Brisbane, Perth, and regional areas. Plus remote and hybrid options.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                ),
              },
            ].map(({ heading, body, icon }) => (
              <div key={heading} className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 mb-5">
                  {icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{heading}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer strip */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-violet-600 rounded-3xl p-10 sm:p-14 text-white text-center">
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-white text-sm font-medium mb-6">
              For employers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Hiring in mental health?
            </h2>
            <p className="text-violet-100 text-lg max-w-xl mx-auto mb-8">
              Post a role and reach candidates who are already looking for exactly what you offer. Free to list during launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register" className="px-8 py-3.5 rounded-full bg-white text-violet-600 font-semibold hover:bg-violet-50 transition-all">
                Post a role
              </Link>
              <Link href="/employers" className="px-8 py-3.5 rounded-full border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section className="py-20 bg-lavender">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full border border-violet-200 bg-white text-violet-600 text-sm font-medium mb-3">
                  Career insights
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900">Latest from the blog</h2>
              </div>
              <Link href="/blog" className="px-6 py-2.5 rounded-full border border-violet-200 text-violet-600 font-medium hover:bg-white transition-all text-sm shrink-0">
                Read more
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-violet-200 hover:shadow-lg transition-all">
                    <div className="text-sm text-violet-600 font-medium mb-2">
                      {new Date(post.published_at!).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors mb-2">
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
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Ready to find your{" "}
            <span className="text-highlight">next&nbsp;role?</span>
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
            Browse mental health and supportive services roles posted by mission-aligned employers across Australia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs" className="px-8 py-3.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-all">
              Browse roles
            </Link>
            <Link href="/auth/register" className="px-8 py-3.5 rounded-full border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
