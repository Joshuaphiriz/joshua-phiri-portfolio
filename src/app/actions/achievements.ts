"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AchievementInput = {
  title: string;
  description: string;
  date_label: string;
  sort_order: number;
};

export async function upsertAchievement(
  id: string | null,
  input: AchievementInput
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const payload = {
    title: input.title,
    description: input.description || null,
    date_label: input.date_label || null,
    sort_order: input.sort_order,
  };

  const { error } = id
    ? await supabase.from("achievements").update(payload).eq("id", id)
    : await supabase.from("achievements").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/achievements");
  return { error: null };
}

export async function deleteAchievement(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/achievements");
  return { error: null };
}
