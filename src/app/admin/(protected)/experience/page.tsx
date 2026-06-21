import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import type { Experience } from "@/lib/types/content";

export default async function ExperienceAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <AdminPageHeader
        title="Experience"
        description="Your work history, shown as statement entries on the public site."
      />
      <div className="px-6 py-8 md:px-10">
        <ExperienceManager initialItems={(data as Experience[]) ?? []} />
      </div>
    </div>
  );
}
