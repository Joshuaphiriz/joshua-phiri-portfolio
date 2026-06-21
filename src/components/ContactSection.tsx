import type { SiteSettings } from "@/lib/types/content";

export function ContactSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="contact" className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass-soft">
              Let&apos;s work together
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              Open to finance, investment & SME-focused roles
            </h2>
            <p className="mt-5 max-w-lg text-paper/75">
              If you&apos;re looking for someone who can bring financial
              rigour, data analysis, and a builder&apos;s instinct for
              automation to your team — I&apos;d welcome the conversation.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-paper/15 bg-ink-soft p-7">
            <ContactRow label="Email" value={settings.email} href={`mailto:${settings.email}`} />
            <ContactRow label="Phone" value={settings.phone} href={`tel:${settings.phone.replace(/\s/g, "")}`} />
            <ContactRow label="Location" value={settings.location} />
            {settings.linkedin_url && (
              <ContactRow
                label="LinkedIn"
                value="phiri-joshua"
                href={settings.linkedin_url}
              />
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-paper/50 sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} {settings.full_name}. All rights reserved.</p>
          <p>Built with care in Lusaka.</p>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="hover:text-brass-soft">
      {value}
    </a>
  ) : (
    <span>{value}</span>
  );

  return (
    <div className="flex items-center justify-between border-b border-paper/10 pb-3 last:border-0 last:pb-0">
      <span className="font-mono text-xs uppercase tracking-wider text-paper/50">
        {label}
      </span>
      <span className="text-sm text-paper/90">{content}</span>
    </div>
  );
}
