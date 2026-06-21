"use client";

import { useState } from "react";
import type { Experience } from "@/lib/types/content";
import { upsertExperience, deleteExperience } from "@/app/actions/experience";
import { AdminCard } from "@/components/admin/AdminUI";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type FormState = {
  id: string | null;
  organisation: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string;
  sort_order: number;
};

const EMPTY_FORM: FormState = {
  id: null,
  organisation: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  bullets: "",
  sort_order: 0,
};

export function ExperienceManager({
  initialItems,
}: {
  initialItems: Experience[];
}) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setForm({ ...EMPTY_FORM, sort_order: items.length * 10 + 10 });
    setError(null);
  }

  function openEdit(item: Experience) {
    setForm({
      id: item.id,
      organisation: item.organisation,
      role: item.role,
      location: item.location ?? "",
      start_date: item.start_date,
      end_date: item.end_date ?? "",
      bullets: item.bullets.join("\n"),
      sort_order: item.sort_order,
    });
    setError(null);
  }

  async function handleSave() {
    if (!form) return;
    if (!form.organisation || !form.role || !form.start_date) {
      setError("Organisation, role, and start date are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const result = await upsertExperience(form.id, {
      organisation: form.organisation,
      role: form.role,
      location: form.location,
      start_date: form.start_date,
      end_date: form.end_date || null,
      bullets: form.bullets.split("\n"),
      sort_order: form.sort_order,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Optimistically refresh local list shape; a full reload would also work
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience entry? This can't be undone.")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteExperience(id);
  }

  return (
    <div className="space-y-6">
      <button
        onClick={openNew}
        className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink-soft"
      >
        <Plus size={16} />
        Add experience
      </button>

      {form && (
        <AdminCard className="border-brass/40">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">
              {form.id ? "Edit entry" : "New entry"}
            </h3>
            <button
              onClick={() => setForm(null)}
              className="text-slate hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organisation">
              <input
                className="admin-input"
                value={form.organisation}
                onChange={(e) =>
                  setForm({ ...form, organisation: e.target.value })
                }
              />
            </Field>
            <Field label="Role / Title">
              <input
                className="admin-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
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
            <Field label="Sort order (lower = earlier)">
              <input
                type="number"
                className="admin-input"
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Start date">
              <input
                type="date"
                className="admin-input"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
              />
            </Field>
            <Field label="End date (leave blank for Present)">
              <input
                type="date"
                className="admin-input"
                value={form.end_date}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Highlights (one per line)">
              <textarea
                rows={5}
                className="admin-input"
                value={form.bullets}
                onChange={(e) => setForm({ ...form, bullets: e.target.value })}
              />
            </Field>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-brass px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-brass-soft disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save entry"}
            </button>
            <button
              onClick={() => setForm(null)}
              className="rounded-lg border border-hairline px-5 py-2.5 text-sm text-charcoal"
            >
              Cancel
            </button>
          </div>
        </AdminCard>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <AdminCard
            key={item.id}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <p className="font-display text-base text-ink">{item.role}</p>
              <p className="text-sm text-brass">{item.organisation}</p>
              <p className="mt-1 text-xs text-slate">
                {item.start_date} → {item.end_date ?? "Present"}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => openEdit(item)}
                className="rounded-lg border border-hairline p-2 text-slate hover:border-brass hover:text-brass"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-lg border border-hairline p-2 text-slate hover:border-red-400 hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </AdminCard>
        ))}
        {items.length === 0 && !form && (
          <p className="text-sm text-slate">
            No experience entries yet. Add your first one above.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate">
        {label}
      </span>
      {children}
    </label>
  );
}
