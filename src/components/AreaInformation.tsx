import type { CityData, TransportMode } from "@/constants/location-data";

interface Props {
  city: string;
  cityData: CityData;
  summary: string | null;
}

function TransportIcon({ mode }: { mode: TransportMode }) {
  if (mode === "train") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="4" y="3" width="16" height="14" rx="3" />
        <path d="M4 13h16M8 17l-2 4M16 17l2 4M8 7h8" strokeLinecap="round" />
        <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (mode === "tram") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M6 4h12M6 4v12a2 2 0 002 2h8a2 2 0 002-2V4M9 18l-1 3M15 18l1 3" strokeLinecap="round" />
        <path d="M6 10h12M9 7h6" strokeLinecap="round" />
        <circle cx="9.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (mode === "ferry") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 17l2-8h14l2 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17c0 1.1 3.6 2 9 2s9-.9 9-2" />
        <path d="M12 9V5M9 5h6" strokeLinecap="round" />
      </svg>
    );
  }
  // bus
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18M7 19l-1 2M17 19l1 2M7 9V6M17 9V6" strokeLinecap="round" />
      <circle cx="7.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const MODE_COLOURS: Record<TransportMode, string> = {
  train: "bg-orange-50 text-orange-600 border-orange-100",
  tram:  "bg-emerald-50 text-emerald-600 border-emerald-100",
  ferry: "bg-blue-50 text-blue-600 border-blue-100",
  bus:   "bg-slate-50 text-slate-500 border-slate-200",
};

export default function AreaInformation({ city, cityData, summary }: Props) {
  const maxCount = Math.max(...cityData.amenities.map((a) => a.count));

  return (
    <section className="mt-10 pt-8 border-t border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-5">Area information</h2>

      {/* Summary blurb */}
      {summary && (
        <div className="mb-6 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Supportive · {city} area insights
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Transport & access */}
      <div className="mb-7">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Transport &amp; access</h3>
        <p className="text-xs text-violet-500 mb-3">Nearby options in {city}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {cityData.transport.map((t) => (
            <div
              key={t.name}
              className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${MODE_COLOURS[t.mode]}`}
            >
              <TransportIcon mode={t.mode} />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{t.name}</p>
                <p className="text-xs opacity-70">{t.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby amenities */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">Nearby amenities</h3>
        <p className="text-xs text-violet-500 mb-3">Within the {city} area</p>
        <div className="space-y-2">
          {cityData.amenities.map((a) => {
            const pct = Math.round((a.count / maxCount) * 100);
            return (
              <div key={a.label} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-40 shrink-0 text-right">{a.label}</span>
                <div className="flex-1 relative h-5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-violet-200 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="absolute inset-y-0 left-2 flex items-center text-xs font-semibold text-violet-700">
                    {a.count.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Area data for {city}, {cityData.state}. Updated {cityData.updatedMonth}.
        </p>
      </div>
    </section>
  );
}
