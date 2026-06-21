"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types/content";
import {
  updateSiteSettings,
  updateProfileImage,
  updateCvFile,
} from "@/app/actions/settings";
import { publicMediaUrl } from "@/lib/media";
import { AdminCard } from "@/components/admin/AdminUI";
import { FileUploader } from "@/components/admin/FileUploader";
import { FileText, Check } from "lucide-react";

export function SettingsManager({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({
    full_name: settings.full_name,
    headline: settings.headline,
    bio: settings.bio,
    email: settings.email,
    phone: settings.phone,
    location: settings.location,
    linkedin_url: settings.linkedin_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileImageUrl = publicMediaUrl(settings.profile_image_path);
  const cvUrl = publicMediaUrl(settings.cv_storage_path);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    const result = await updateSiteSettings(settings.id, form);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleProfileUpload(path: string) {
    await updateProfileImage(settings.id, path);
    window.location.reload();
  }

  async function handleCvUpload(path: string) {
    await updateCvFile(settings.id, path);
    window.location.reload();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <AdminCard>
        <h2 className="font-display text-lg text-ink">Profile</h2>
        <div className="mt-4 space-y-4">
          <Field label="Full name">
            <input
              className="admin-input"
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />
          </Field>
          <Field label="Headline (shown under your photo)">
            <input
              className="admin-input"
              value={form.headline}
              onChange={(e) =>
                setForm({ ...form, headline: e.target.value })
              }
            />
          </Field>
          <Field label="Bio (shown in the hero section)">
            <textarea
              rows={4}
              className="admin-input"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input
                className="admin-input"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </Field>
            <Field label="Phone">
              <input
                className="admin-input"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </Field>
            <Field label="Location">
              <input
                className="admin-input"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </Field>
            <Field label="LinkedIn URL">
              <input
                className="admin-input"
                value={form.linkedin_url}
                onChange={(e) =>
                  setForm({ ...form, linkedin_url: e.target.value })
                }
              />
            </Field>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 flex items-center gap-2 rounded-lg bg-brass px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-brass-soft disabled:opacity-60"
        >
          {saved && <Check size={15} />}
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
      </AdminCard>

      <div className="space-y-6">
        <AdminCard>
          <h2 className="font-display text-lg text-ink">Profile photo</h2>
          <div className="mt-4 aspect-[4/5] w-full overflow-hidden rounded-lg border border-hairline bg-paper-dim">
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate">
                Using default photo
              </div>
            )}
          </div>
          <div className="mt-4">
            <FileUploader
              pathPrefix="profile"
              accept="image/*"
              label="Upload new photo"
              onUploaded={(path) => handleProfileUpload(path)}
            />
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display text-lg text-ink">CV / Resume</h2>
          {cvUrl ? (
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-2 rounded-lg border border-hairline px-3 py-2.5 text-sm text-charcoal hover:border-brass hover:text-brass"
            >
              <FileText size={15} />
              View current CV
            </a>
          ) : (
            <p className="mt-2 text-xs text-slate">No CV uploaded yet.</p>
          )}
          <div className="mt-4">
            <FileUploader
              pathPrefix="cv"
              accept=".pdf,.doc,.docx"
              label={cvUrl ? "Replace CV" : "Upload CV"}
              onUploaded={(path) => handleCvUpload(path)}
            />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate">
        {label}
      </span>
      {children}
    </label>
  );
}
