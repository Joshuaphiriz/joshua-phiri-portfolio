"use client";

import { useState } from "react";
import type { Project, MediaItem } from "@/lib/types/content";
import {
  upsertProject,
  deleteProject,
  setProjectCoverImage,
  type ProjectInput,
} from "@/app/actions/projects";
import { registerMediaItem, deleteMediaItem } from "@/app/actions/media";
import { publicMediaUrl } from "@/lib/media";
import { AdminCard } from "@/components/admin/AdminUI";
import { FileUploader } from "@/components/admin/FileUploader";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  FileText,
  Video,
  ExternalLink,
  EyeOff,
} from "lucide-react";

type FormState = {
  id: string | null;
  title: string;
  summary: string;
  body: string;
  tags: string;
  link_url: string;
  sort_order: number;
  is_published: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  summary: "",
  body: "",
  tags: "",
  link_url: "",
  sort_order: 0,
  is_published: true,
};

export function ProjectsManager({
  initialProjects,
  initialMedia,
}: {
  initialProjects: Project[];
  initialMedia: MediaItem[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [media, setMedia] = useState(initialMedia);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function openNew() {
    setForm({ ...EMPTY_FORM, sort_order: projects.length * 10 + 10 });
    setError(null);
  }

  function openEdit(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      summary: p.summary,
      body: p.body ?? "",
      tags: p.tags.join(", "),
      link_url: p.link_url ?? "",
      sort_order: p.sort_order,
      is_published: p.is_published,
    });
    setError(null);
  }

  async function handleSave() {
    if (!form) return;
    if (!form.title || !form.summary) {
      setError("Title and summary are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const input: ProjectInput = {
      title: form.title,
      summary: form.summary,
      body: form.body,
      tags: form.tags.split(",").map((t) => t.trim()),
      link_url: form.link_url,
      sort_order: form.sort_order,
      is_published: form.is_published,
    };

    const result = await upsertProject(form.id, input);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Delete this project? Attached media records will also be removed."
      )
    )
      return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await deleteProject(id);
  }

  async function handleCoverUpload(
    projectId: string,
    storagePath: string
  ) {
    await setProjectCoverImage(projectId, storagePath);
    window.location.reload();
  }

  async function handleMediaUpload(
    projectId: string | null,
    kind: MediaItem["kind"],
    storagePath: string,
    fileName: string
  ) {
    await registerMediaItem({
      project_id: projectId,
      kind,
      storage_path: storagePath,
      file_name: fileName,
    });
    window.location.reload();
  }

  async function handleDeleteMedia(item: MediaItem) {
    if (!confirm(`Delete "${item.file_name}"?`)) return;
    setMedia((prev) => prev.filter((m) => m.id !== item.id));
    await deleteMediaItem(item.id, item.storage_path);
  }

  return (
    <div className="space-y-10">
      {/* General media library (not tied to a project) */}
      <AdminCard>
        <h2 className="font-display text-lg text-ink">General media library</h2>
        <p className="mt-1 text-sm text-slate">
          Upload documents, photos, or videos that aren&apos;t tied to a
          specific project — e.g. certificates, your transcript, or general
          photos.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <FileUploader
            pathPrefix="general"
            accept="image/*"
            label="Upload photo"
            onUploaded={(path, name) =>
              handleMediaUpload(null, "image", path, name)
            }
          />
          <FileUploader
            pathPrefix="general"
            accept=".pdf,.doc,.docx"
            label="Upload document"
            onUploaded={(path, name) =>
              handleMediaUpload(null, "document", path, name)
            }
          />
          <FileUploader
            pathPrefix="general"
            accept="video/*"
            label="Upload video"
            onUploaded={(path, name) =>
              handleMediaUpload(null, "video", path, name)
            }
          />
        </div>

        <MediaGrid
          items={media.filter((m) => m.project_id === null)}
          onDelete={handleDeleteMedia}
        />
      </AdminCard>

      {/* Projects */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Projects</h2>
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink-soft"
          >
            <Plus size={16} />
            Add project
          </button>
        </div>

        {form && (
          <AdminCard className="mb-6 border-brass/40">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg text-ink">
                {form.id ? "Edit project" : "New project"}
              </h3>
              <button onClick={() => setForm(null)} className="text-slate hover:text-ink">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Title">
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </Field>
              <Field label="Summary (shown on the project card)">
                <textarea
                  rows={2}
                  className="admin-input"
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                />
              </Field>
              <Field label="Full description (optional, longer write-up)">
                <textarea
                  rows={4}
                  className="admin-input"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tags (comma separated)">
                  <input
                    className="admin-input"
                    value={form.tags}
                    onChange={(e) =>
                      setForm({ ...form, tags: e.target.value })
                    }
                  />
                </Field>
                <Field label="External link (optional)">
                  <input
                    className="admin-input"
                    value={form.link_url}
                    onChange={(e) =>
                      setForm({ ...form, link_url: e.target.value })
                    }
                  />
                </Field>
                <Field label="Sort order">
                  <input
                    type="number"
                    className="admin-input"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({ ...form, sort_order: Number(e.target.value) })
                    }
                  />
                </Field>
                <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) =>
                      setForm({ ...form, is_published: e.target.checked })
                    }
                  />
                  Published (visible on live site)
                </label>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-brass px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-brass-soft disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save project"}
              </button>
              <button
                onClick={() => setForm(null)}
                className="rounded-lg border border-hairline px-5 py-2.5 text-sm text-charcoal"
              >
                Cancel
              </button>
            </div>
            {!form.id && (
              <p className="mt-3 text-xs text-slate">
                Save the project first, then you can upload a cover image and
                media for it.
              </p>
            )}
          </AdminCard>
        )}

        <div className="space-y-4">
          {projects.map((project) => {
            const projectMedia = media.filter(
              (m) => m.project_id === project.id
            );
            const coverUrl = publicMediaUrl(project.cover_image_path);
            const expanded = expandedId === project.id;

            return (
              <AdminCard key={project.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-hairline bg-paper-dim">
                      {coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coverUrl}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate/40">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display text-base text-ink">
                          {project.title}
                        </p>
                        {!project.is_published && (
                          <span className="flex items-center gap-1 rounded-full bg-paper-dim px-2 py-0.5 text-xs text-slate">
                            <EyeOff size={11} /> Draft
                          </span>
                        )}
                      </div>
                      <p className="mt-1 max-w-md text-sm text-charcoal/75">
                        {project.summary}
                      </p>
                      {project.link_url && (
                        <a
                          href={project.link_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-brass hover:underline"
                        >
                          <ExternalLink size={11} /> {project.link_url}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => openEdit(project)}
                      className="rounded-lg border border-hairline p-2 text-slate hover:border-brass hover:text-brass"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded-lg border border-hairline p-2 text-slate hover:border-red-400 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setExpandedId(expanded ? null : project.id)
                  }
                  className="mt-4 text-xs font-medium text-brass hover:underline"
                >
                  {expanded
                    ? "Hide media"
                    : `Manage media (${projectMedia.length + (project.cover_image_path ? 1 : 0)})`}
                </button>

                {expanded && (
                  <div className="mt-4 border-t border-hairline pt-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate">
                      Cover image
                    </p>
                    <FileUploader
                      pathPrefix={`projects/${project.id}`}
                      accept="image/*"
                      label={coverUrl ? "Replace cover image" : "Upload cover image"}
                      onUploaded={(path) => handleCoverUpload(project.id, path)}
                    />

                    <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-slate">
                      Additional media (photos, documents, videos)
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <FileUploader
                        pathPrefix={`projects/${project.id}`}
                        accept="image/*"
                        label="Add photo"
                        onUploaded={(path, name) =>
                          handleMediaUpload(project.id, "image", path, name)
                        }
                      />
                      <FileUploader
                        pathPrefix={`projects/${project.id}`}
                        accept=".pdf,.doc,.docx"
                        label="Add document"
                        onUploaded={(path, name) =>
                          handleMediaUpload(project.id, "document", path, name)
                        }
                      />
                      <FileUploader
                        pathPrefix={`projects/${project.id}`}
                        accept="video/*"
                        label="Add video"
                        onUploaded={(path, name) =>
                          handleMediaUpload(project.id, "video", path, name)
                        }
                      />
                    </div>

                    <MediaGrid items={projectMedia} onDelete={handleDeleteMedia} />
                  </div>
                )}
              </AdminCard>
            );
          })}
          {projects.length === 0 && !form && (
            <p className="text-sm text-slate">
              No projects yet. Add your first one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaGrid({
  items,
  onDelete,
}: {
  items: MediaItem[];
  onDelete: (item: MediaItem) => void;
}) {
  if (items.length === 0) {
    return <p className="mt-4 text-xs text-slate">No files uploaded yet.</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => {
        const url = publicMediaUrl(item.storage_path);
        return (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-lg border border-hairline bg-paper-dim"
          >
            {item.kind === "image" && url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={item.file_name}
                className="h-24 w-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-full flex-col items-center justify-center gap-1 text-slate">
                {item.kind === "video" ? (
                  <Video size={20} />
                ) : (
                  <FileText size={20} />
                )}
                <span className="px-2 text-center text-[10px] leading-tight">
                  {item.file_name}
                </span>
              </div>
            )}
            <button
              onClick={() => onDelete(item)}
              className="absolute right-1.5 top-1.5 rounded-full bg-ink/80 p-1.5 text-paper opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 size={12} />
            </button>
          </div>
        );
      })}
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
