import Link from "next/link";

export function SiteHeader({ fullName }: { fullName: string }) {
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="#top"
          className="flex items-center gap-2.5 font-display text-lg tracking-tight text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brass/60 text-xs font-medium text-brass">
            {initials}
          </span>
          {fullName}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-charcoal/80 md:flex">
          <Link href="#about" className="transition hover:text-ink">
            About
          </Link>
          <Link href="#experience" className="transition hover:text-ink">
            Experience
          </Link>
          <Link href="#projects" className="transition hover:text-ink">
            Projects
          </Link>
          <Link href="#achievements" className="transition hover:text-ink">
            Achievements
          </Link>
          <Link
            href="#contact"
            className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-ink-soft"
          >
            Get in touch
          </Link>
        </nav>
        <Link
          href="#contact"
          className="rounded-full bg-ink px-3.5 py-2 text-xs text-paper md:hidden"
        >
          Contact
        </Link>
      </div>
    </header>
  );
}
