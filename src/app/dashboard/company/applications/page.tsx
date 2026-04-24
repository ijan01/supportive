import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { sql } from "@/lib/db";
import { APPLICATION_STATUS_COLORS } from "@/constants";
import ApplicationActions from "./client";

export const dynamic = "force-dynamic";

interface AppRow {
  id: number;
  job_id: number;
  name: string;
  email: string;
  phone: string | null;
  ahpra_number: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  status: string;
  read_at: string | null;
  created_at: string;
  job_title: string;
  job_company: string;
}

export default async function EmployerApplicationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "company") redirect("/dashboard/seeker");
  const result = await sql`
    SELECT a.*, j.title AS job_title, j.company AS job_company
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    WHERE j.user_id = ${Number(session.user.id)}
    ORDER BY a.created_at DESC
  `;
  const apps = result.rows as AppRow[];

  // Mark unread as read
  const unreadIds = apps.filter((a) => !a.read_at).map((a) => a.id);
  if (unreadIds.length > 0) {
    for (const id of unreadIds) {
      await sql`UPDATE applications SET read_at = NOW() WHERE id = ${id} AND read_at IS NULL`;
    }
  }

  // Group by job
  const grouped = new Map<number, { title: string; apps: AppRow[] }>();
  for (const app of apps) {
    const existing = grouped.get(app.job_id);
    if (existing) {
      existing.apps.push(app);
    } else {
      grouped.set(app.job_id, { title: app.job_title, apps: [app] });
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm mb-1">
        <Link href="/dashboard/company" className="text-violet-600 hover:text-violet-700 font-medium">Dashboard</Link>
        <span className="text-slate-300">&rsaquo;</span>
        <span className="text-slate-500">Applications</span>
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Applications ({apps.length})</h1>

      {apps.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No applications received yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {[...grouped.entries()].map(([jobId, { title, apps: jobApps }]) => (
            <div key={jobId}>
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                <Link href={`/jobs/${jobId}`} className="hover:text-violet-600 transition-colors">{title}</Link>
                <span className="text-slate-400 text-sm font-normal ml-2">({jobApps.length})</span>
              </h2>
              <div className="space-y-3">
                {jobApps.map((app) => {
                  const statusColor = APPLICATION_STATUS_COLORS[app.status] || "bg-slate-100 text-slate-600";
                  return (
                    <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{app.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>{app.status}</span>
                            {!app.read_at && <span className="w-2 h-2 rounded-full bg-violet-500" title="New" />}
                          </div>
                          <p className="text-sm text-slate-500">{app.email}{app.phone && ` · ${app.phone}`}</p>
                          {app.ahpra_number && (
                            <p className="text-sm text-slate-500 mt-0.5">
                              AHPRA: {app.ahpra_number} —{" "}
                              <a href="https://www.ahpra.gov.au/Registration/Registers-of-Practitioners.aspx" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                                Verify on AHPRA register
                              </a>
                            </p>
                          )}
                          {app.cover_letter && (
                            <details className="mt-2">
                              <summary className="text-sm text-violet-600 cursor-pointer font-medium">Read cover note</summary>
                              <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">{app.cover_letter}</p>
                            </details>
                          )}
                          {app.resume_url && (
                            <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-violet-600 hover:underline font-medium">
                              View resume
                            </a>
                          )}
                          <p className="text-xs text-slate-400 mt-2">Applied {new Date(app.created_at).toLocaleDateString("en-AU")}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <ApplicationActions appId={app.id} currentStatus={app.status} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
