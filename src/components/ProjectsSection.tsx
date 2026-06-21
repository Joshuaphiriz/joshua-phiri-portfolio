import Image from "next/image";
import type { Project } from "@/lib/types/content";
import { publicMediaUrl } from "@/lib/media";

export function ProjectsSection({ items }: { items: Project[] }) {
  if (items.length === 0) return null;

  return (
    <section id="projects" className="border-b border-hairline bg-paper-dim">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
          Selected Work
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Things I&apos;ve built
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => {
            const coverUrl = publicMediaUrl(project.cover_image_path);
            return (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-hairline bg-paper transition hover:border-brass/50 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-soft">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-paper/30">
                      {project.title}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/80">
                    {project.summary}
                  </p>
                  {project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-hairline px-2.5 py-1 text-xs text-slate"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link_url && (
                    <a
                      href={project.link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 text-sm font-medium text-brass hover:text-ink"
                    >
                      View project →
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
