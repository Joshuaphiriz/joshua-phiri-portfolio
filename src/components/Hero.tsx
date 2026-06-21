import Image from "next/image";

export function Hero({
  fullName,
  headline,
  bio,
  profileImageUrl,
  cvUrl,
}: {
  fullName: string;
  headline: string;
  bio: string;
  profileImageUrl: string | null;
  cvUrl: string | null;
}) {
  const firstName = fullName.split(" ")[0];

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-hairline bg-ink text-paper"
    >
      {/* subtle ledger-line texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 35px, #f7f4ee 35px, #f7f4ee 36px)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10 lg:py-28">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-soft">
            Finance · SMEs · Applied Technology
          </p>
          <h1 className="mt-6 font-display text-4xl leading-[1.08] tracking-tight text-paper sm:text-5xl lg:text-6xl">
            {firstName} builds the financial
            <br className="hidden sm:block" /> infrastructure SMEs
            <br className="hidden sm:block" /> can&apos;t afford to skip.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg">
            {bio}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-brass-soft"
            >
              Start a conversation
            </a>
            <a
              href="#experience"
              className="rounded-full border border-paper/25 px-6 py-3 text-sm font-medium text-paper/90 transition hover:border-paper/60"
            >
              View experience
            </a>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-brass-soft underline-offset-4 hover:underline"
              >
                Download CV ↓
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
          <div className="absolute -inset-3 rounded-2xl border border-brass/25" />
          <div className="relative overflow-hidden rounded-2xl border border-paper/10 bg-ink-soft shadow-2xl">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={fullName}
                width={480}
                height={600}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center text-paper/40">
                Photo coming soon
              </div>
            )}
          </div>
          <div className="absolute -bottom-5 left-1/2 w-[88%] -translate-x-1/2 rounded-xl border border-hairline bg-paper px-5 py-3 text-center shadow-lg">
            <p className="font-display text-sm text-ink">{headline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
