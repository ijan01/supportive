import type { Faq } from "@/lib/insights";

interface Props {
  faqs: Faq[];
  jobTitle: string;
  company: string;
}

export default function JobFaq({ faqs, jobTitle, company }: Props) {
  return (
    <section className="mt-10 pt-8 border-t border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-5">
        Frequently asked questions about {jobTitle} at {company}
      </h2>
      <div className="divide-y divide-slate-100">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-4" name="job-faq">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
              <span className="text-sm font-semibold text-slate-800 group-open:text-violet-700 transition-colors">
                {faq.question}
              </span>
              <svg
                className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
