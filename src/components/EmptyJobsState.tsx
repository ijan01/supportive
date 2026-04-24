import Link from "next/link";

interface EmptyJobsStateProps {
  label: string;
  href?: string;
  linkText?: string;
}

export default function EmptyJobsState({
  label,
  href = "/jobs",
  linkText = "Browse all roles",
}: EmptyJobsStateProps) {
  return (
    <div className="bg-lavender border border-violet-100 rounded-2xl p-8 mb-10 text-center">
      <p className="text-slate-700 font-medium mb-2">{label}</p>
      <p className="text-slate-500 text-sm mb-4">
        New roles are added daily. Check back soon or browse all current roles.
      </p>
      <Link
        href={href}
        className="inline-block px-6 py-2.5 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition-all text-sm"
      >
        {linkText}
      </Link>
    </div>
  );
}
