"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ExperienceInput = {
  organisation: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  bullets: string[];
  sort_order: number;
};

export async function upsertExperience(id: string | null, input: ExperienceInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const payload = {
    organisation: input.organisation,
    role: input.role,
    location: input.location || null,
    start_date: input.start_date,
    end_date: input.end_date || null,
    bullets: input.bullets.filter((b) => b.trim().length > 0),
    sort_order: input.sort_order,
  };

  const { error } = id
    ? await supabase.from("experience").update(payload).eq("id", id)
    : await supabase.from("experience").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { error: null };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { error: null };
}
