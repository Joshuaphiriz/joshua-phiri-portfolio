import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import type { Project, MediaItem } from "@/lib/types/content";

export default async function ProjectsAdminPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: media }] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("media_items").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Projects & Media"
        description="Upload photos, documents, and videos, and attach them to projects."
      />
      <div className="px-6 py-8 md:px-10">
        <ProjectsManager
          initialProjects={(projects as Project[]) ?? []}
          initialMedia={(media as MediaItem[]) ?? []}
        />
      </div>
    </div>
  );
}
