import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { SettingsManager } from "@/components/admin/SettingsManager";
import type { SiteSettings } from "@/lib/types/content";

export default async function SettingsAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <AdminPageHeader
        title="Site settings"
        description="Your headline, bio, contact details, profile photo, and CV."
      />
      <div className="px-6 py-8 md:px-10">
        {data ? (
          <SettingsManager settings={data as SiteSettings} />
        ) : (
          <p className="text-sm text-slate">
            No site settings row found. Run the seed SQL in your Supabase
            project to create one.
          </p>
        )}
      </div>
    </div>
  );
}
