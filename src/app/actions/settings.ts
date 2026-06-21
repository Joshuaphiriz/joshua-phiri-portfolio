"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SettingsInput = {
  full_name: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string;
};

export async function updateSiteSettings(id: string, input: SettingsInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("site_settings")
    .update({
      full_name: input.full_name,
      headline: input.headline,
      bio: input.bio,
      email: input.email,
      phone: input.phone,
      location: input.location,
      linkedin_url: input.linkedin_url || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { error: null };
}

export async function updateProfileImage(id: string, path: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("site_settings")
    .update({ profile_image_path: path })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { error: null };
}

export async function updateCvFile(id: string, path: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("site_settings")
    .update({ cv_storage_path: path })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { error: null };
}
