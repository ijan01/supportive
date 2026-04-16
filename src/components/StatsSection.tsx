export default function StatsSection() {
  const stats = [
    { label: "Active Jobs", value: "500+" },
    { label: "Companies", value: "100+" },
    { label: "Categories", value: "10+" },
    { label: "Hired", value: "2,000+" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-slate-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
