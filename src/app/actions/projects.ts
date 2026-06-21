"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProjectInput = {
  title: string;
  summary: string;
  body: string;
  tags: string[];
  link_url: string;
  sort_order: number;
  is_published: boolean;
};

export async function upsertProject(id: string | null, input: ProjectInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated.", id: null };

  const payload = {
    title: input.title,
    summary: input.summary,
    body: input.body || null,
    tags: input.tags.filter((t) => t.trim().length > 0),
    link_url: input.link_url || null,
    sort_order: input.sort_order,
    is_published: input.is_published,
  };

  if (id) {
    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message, id: null };
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { error: null, id };
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message, id: null };
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { error: null, id: data.id as string };
  }
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { error: null };
}

export async function setProjectCoverImage(
  projectId: string,
  storagePath: string | null
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("projects")
    .update({ cover_image_path: storagePath })
    .eq("id", projectId);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { error: null };
}
