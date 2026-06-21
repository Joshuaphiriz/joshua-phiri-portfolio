import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminUI";
import Link from "next/link";
import { Briefcase, FolderKanban, Trophy, ArrowRight } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ count: expCount }, { count: projCount }, { count: achCount }] =
    await Promise.all([
      supabase.from("experience").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase
        .from("achievements")
        .select("*", { count: "exact", head: true }),
    ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <AdminPageHeader
        title={`Welcome back${user?.email ? "" : ""}`}
        description={user?.email ?? undefined}
      />

      <div className="grid gap-5 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3 md:px-10">
        <StatCard
          icon={Briefcase}
          label="Experience entries"
          count={expCount ?? 0}
          href="/admin/experience"
        />
        <StatCard
          icon={FolderKanban}
          label="Projects"
          count={projCount ?? 0}
          href="/admin/projects"
        />
        <StatCard
          icon={Trophy}
          label="Achievements"
          count={achCount ?? 0}
          href="/admin/achievements"
        />
      </div>

      <div className="px-6 pb-10 md:px-10">
        <AdminCard>
          <h2 className="font-display text-lg text-ink">How this works</h2>
          <ul className="mt-3 space-y-2 text-sm text-charcoal/80">
            <li>
              • Anything you add, edit, or upload here appears on your live
              site immediately — no redeploying needed.
            </li>
            <li>
              • <strong>Projects &amp; Media</strong> is where you upload
              photos, documents, and videos, and attach them to specific
              projects.
            </li>
            <li>
              • <strong>Site Settings</strong> controls your headline, bio,
              contact details, profile photo, and downloadable CV.
            </li>
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  count,
  href,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-hairline bg-white/60 p-5 transition hover:border-brass/50 hover:shadow-sm"
    >
      <div>
        <div className="flex items-center gap-2 text-slate">
          <Icon size={16} />
          <span className="text-xs uppercase tracking-wide">{label}</span>
        </div>
        <p className="mt-2 font-display text-3xl text-ink">{count}</p>
      </div>
      <ArrowRight
        size={18}
        className="text-slate/50 transition group-hover:translate-x-0.5 group-hover:text-brass"
      />
    </Link>
  );
}
