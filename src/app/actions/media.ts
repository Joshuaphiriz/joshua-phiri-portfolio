"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { MediaItem } from "@/lib/types/content";

export async function registerMediaItem(input: {
  project_id: string | null;
  kind: MediaItem["kind"];
  storage_path: string;
  file_name: string;
  caption?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("media_items").insert({
    project_id: input.project_id,
    kind: input.kind,
    storage_path: input.storage_path,
    file_name: input.file_name,
    caption: input.caption || null,
    sort_order: 0,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { error: null };
}

export async function deleteMediaItem(id: string, storagePath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  // Remove the DB record first
  const { error: dbError } = await supabase
    .from("media_items")
    .delete()
    .eq("id", id);
  if (dbError) return { error: dbError.message };

  // Best-effort remove the underlying file
  await supabase.storage.from("portfolio-media").remove([storagePath]);

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { error: null };
}
