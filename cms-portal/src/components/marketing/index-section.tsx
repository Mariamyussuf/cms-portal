import Link from "next/link";

const departments = [
  { name: "Accounting", slug: "accounting", note: "ND, HND & professional pathway" },
  { name: "Business Administration", slug: "business-administration", note: "ND & HND" },
  { name: "Banking & Finance", slug: "banking-finance", note: "ND & HND" },
  { name: "Marketing", slug: "marketing", note: "ND & HND" },
  { name: "Office Technology & Management", slug: "office-technology-management", note: "ND & HND" },
];

const associations = [
  { name: "Accounting Students' Association", slug: "asa" },
  { name: "Business Administration Students' Association", slug: "basa" },
  { name: "National Association of Banking & Finance Students", slug: "nabfs" },
  { name: "Marketing Students' Association", slug: "mksa" },
];

export function IndexSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid gap-16 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ink-900">Departments</h2>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {departments.map((dept) => (
              <li key={dept.slug}>
                <Link
                  href={`/departments/${dept.slug}`}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="text-ink-900 group-hover:text-brass-600">
                    {dept.name}
                  </span>
                  <span className="shrink-0 text-sm text-ink-muted">
                    {dept.note}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink-900">Associations</h2>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {associations.map((assoc) => (
              <li key={assoc.slug}>
                <Link
                  href={`/associations/${assoc.slug}`}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="text-ink-900 group-hover:text-brass-600">
                    {assoc.name}
                  </span>
                  <span className="shrink-0 text-sm text-ink-muted">
                    View →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            Each association manages its own leadership, events, and dues.
          </p>
        </div>
      </div>
    </section>
  );
}
