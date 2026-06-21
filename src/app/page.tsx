import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { EducationSection } from "@/components/EducationSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AchievementsSection } from "@/components/AchievementsSection";
import { ContactSection } from "@/components/ContactSection";
import {
  getSiteSettings,
  getExperience,
  getProjects,
  getAchievements,
} from "@/lib/content";
import { publicMediaUrl } from "@/lib/media";

export default async function Home() {
  const [settings, experience, projects, achievements] = await Promise.all([
    getSiteSettings(),
    getExperience(),
    getProjects(),
    getAchievements(),
  ]);

  const profileImageUrl =
    publicMediaUrl(settings.profile_image_path) ?? "/seed/joshua-profile.jpeg";
  const cvUrl = publicMediaUrl(settings.cv_storage_path) ?? "/seed/joshua-phiri-cv.pdf";

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader fullName={settings.full_name} />
      <Hero
        fullName={settings.full_name}
        headline={settings.headline}
        bio={settings.bio}
        profileImageUrl={profileImageUrl}
        cvUrl={cvUrl}
      />
      <EducationSection />
      <ExperienceSection items={experience} />
      <ProjectsSection items={projects} />
      <AchievementsSection items={achievements} />
      <ContactSection settings={settings} />
    </main>
  );
}
