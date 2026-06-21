import type { Experience } from "@/lib/types/content";

function formatRange(start: string, end: string | null) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}

export function ExperienceSection({ items }: { items: Experience[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="border-b border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
              Statement of Experience
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Where the work happened
            </h2>
          </div>
        </div>

        <div className="divide-y divide-hairline border-t border-b border-hairline">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-3 py-8 sm:grid-cols-[200px_1fr] sm:gap-8"
            >
              <div className="font-mono text-sm text-slate">
                {formatRange(item.start_date, item.end_date)}
                {item.location && (
                  <div className="mt-1 text-xs text-slate/70">
                    {item.location}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-display text-xl text-ink">
                  {item.role}
                </h3>
                <p className="mt-1 text-sm font-medium text-brass">
                  {item.organisation}
                </p>
                <ul className="mt-4 space-y-2">
                  {item.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm leading-relaxed text-charcoal/85"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
