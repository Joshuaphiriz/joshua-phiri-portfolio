import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { AchievementsManager } from "@/components/admin/AchievementsManager";
import type { Achievement } from "@/lib/types/content";

export default async function AchievementsAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <AdminPageHeader
        title="Achievements"
        description="Certifications, awards, and notable accomplishments."
      />
      <div className="px-6 py-8 md:px-10">
        <AchievementsManager initialItems={(data as Achievement[]) ?? []} />
      </div>
    </div>
  );
}
