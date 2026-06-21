const EDUCATION = [
  {
    institution: "The University of Zambia",
    credential: "B.A. Economics with Business Administration",
    period: "2023 — Present",
    detail:
      "Coursework: Corporate Finance, Financial Management, Money & Banking, Cost Accounting, Econometric Analysis, Statistical Methods, Micro & Macro Economics. GPA 3.3.",
  },
  {
    institution: "Munali Boys Secondary School",
    credential: "High School Certificate",
    period: "2019 — 2021",
    detail: "6 points across Math, English, Science, Biology, and Commerce.",
  },
];

export function EducationSection() {
  return (
    <section id="about" className="border-b border-hairline bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
          Foundation
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Education
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {EDUCATION.map((ed) => (
            <div
              key={ed.institution}
              className="rounded-xl border border-hairline bg-paper-dim p-6"
            >
              <p className="font-mono text-xs text-slate">{ed.period}</p>
              <h3 className="mt-2 font-display text-lg text-ink">
                {ed.institution}
              </h3>
              <p className="mt-1 text-sm font-medium text-brass">
                {ed.credential}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                {ed.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
