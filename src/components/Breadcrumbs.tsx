import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
        {items.map((item, i) => (
          <span key={i}>
            {item.href ? (
              <Link href={item.href} className="hover:text-violet-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-medium">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="mx-2 text-slate-300">/</span>}
          </span>
        ))}
      </nav>
    </>
  );
}
