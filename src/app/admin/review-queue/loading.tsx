export default function ReviewQueueLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 h-14 animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-32 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
