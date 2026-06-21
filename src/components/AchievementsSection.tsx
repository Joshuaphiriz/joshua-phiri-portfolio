import type { Achievement } from "@/lib/types/content";

export function AchievementsSection({ items }: { items: Achievement[] }) {
  if (items.length === 0) return null;

  return (
    <section id="achievements" className="border-b border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
          Track Record
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Achievements & certifications
        </h2>

        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brass" />
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="font-display text-base text-ink">
                    {item.title}
                  </h3>
                  {item.date_label && (
                    <span className="font-mono text-xs text-slate">
                      {item.date_label}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal/80">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
