"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Trophy,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects & Media", icon: FolderKanban },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-hairline bg-ink text-paper md:h-screen md:w-60 md:border-r">
      <div className="border-b border-paper/10 px-5 py-5">
        <p className="font-display text-base">Portfolio Admin</p>
        <p className="mt-0.5 text-xs text-paper/50">Joshua Phiri</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-brass/15 text-brass-soft"
                  : "text-paper/70 hover:bg-paper/5 hover:text-paper"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-paper/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-paper/70 transition hover:bg-paper/5 hover:text-paper"
        >
          <ExternalLink size={16} />
          View live site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-paper/70 transition hover:bg-paper/5 hover:text-paper"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
