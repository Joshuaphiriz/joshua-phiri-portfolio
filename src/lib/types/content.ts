export type Experience = {
  id: string;
  organisation: string;
  role: string;
  location: string | null;
  start_date: string; // ISO date, day-of-month not significant
  end_date: string | null; // null = present
  bullets: string[];
  sort_order: number;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  body: string | null;
  cover_image_path: string | null;
  tags: string[];
  link_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type MediaItem = {
  id: string;
  project_id: string | null;
  kind: "image" | "document" | "video";
  storage_path: string;
  file_name: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string | null;
  date_label: string | null;
  sort_order: number;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin_url: string | null;
  cv_storage_path: string | null;
  profile_image_path: string | null;
};
