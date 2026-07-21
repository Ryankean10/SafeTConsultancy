const cards = [
  {
    title: "Leads",
    body: "Enquiries captured from the site, worked through a sales pipeline.",
    status: "Milestone 2",
  },
  {
    title: "Traffic",
    body: "First-party visitor analytics, with each lead's journey before they enquired.",
    status: "Milestone 3",
  },
  {
    title: "Lead scoring",
    body: "Automatic ranking of leads by fit and intent so the hottest surface first.",
    status: "Milestone 4",
  },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-navy">Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Welcome to the Safe-T Consultancy management area. The foundation is live — the
        sections below arrive over the next milestones.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-lg border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-navy">{c.title}</h2>
              <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-medium text-navy-light">
                {c.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
