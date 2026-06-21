import { createClient } from "@/lib/supabase/server";
import type {
  Achievement,
  Experience,
  Project,
  SiteSettings,
} from "@/lib/types/content";

const FALLBACK_SETTINGS: SiteSettings = {
  id: "fallback",
  full_name: "Joshua Phiri",
  headline: "Finance & SMEs, built on smart technology",
  bio: "Final-year Economics and Business Administration student at the University of Zambia, focused on finance, investments, and helping SMEs access smart financial solutions through modern technology.",
  email: "phirijoshua784@gmail.com",
  phone: "+260 772 366133",
  location: "Lusaka, Zambia",
  linkedin_url: "https://www.linkedin.com/in/phiri-joshua",
  cv_storage_path: null,
  profile_image_path: null,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return FALLBACK_SETTINGS;
    return data as SiteSettings;
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function getExperience(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Experience[];
  } catch {
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Project[];
  } catch {
    return [];
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as Achievement[];
  } catch {
    return [];
  }
}

export { publicMediaUrl } from "@/lib/media";
