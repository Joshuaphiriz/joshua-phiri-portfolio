"use client";

import { useState } from "react";
import type { Achievement } from "@/lib/types/content";
import {
  upsertAchievement,
  deleteAchievement,
} from "@/app/actions/achievements";
import { AdminCard } from "@/components/admin/AdminUI";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type FormState = {
  id: string | null;
  title: string;
  description: string;
  date_label: string;
  sort_order: number;
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  description: "",
  date_label: "",
  sort_order: 0,
};

export function AchievementsManager({
  initialItems,
}: {
  initialItems: Achievement[];
}) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setForm({ ...EMPTY_FORM, sort_order: items.length * 10 + 10 });
    setError(null);
  }

  function openEdit(item: Achievement) {
    setForm({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      date_label: item.date_label ?? "",
      sort_order: item.sort_order,
    });
    setError(null);
  }

  async function handleSave() {
    if (!form) return;
    if (!form.title) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const result = await upsertAchievement(form.id, form);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this achievement?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteAchievement(id);
  }

  return (
    <div className="space-y-6">
      <button
        onClick={openNew}
        className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink-soft"
      >
        <Plus size={16} />
        Add achievement
      </button>

      {form && (
        <AdminCard className="border-brass/40">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">
              {form.id ? "Edit achievement" : "New achievement"}
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
            <Field label="Description">
              <textarea
                rows={3}
                className="admin-input"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date label (e.g. 2021, or 2024/25)">
                <input
                  className="admin-input"
                  value={form.date_label}
                  onChange={(e) =>
                    setForm({ ...form, date_label: e.target.value })
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
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-brass px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-brass-soft disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save achievement"}
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
          <AdminCard key={item.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-base text-ink">{item.title}</p>
              {item.date_label && (
                <p className="text-xs text-slate">{item.date_label}</p>
              )}
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
          <p className="text-sm text-slate">No achievements yet.</p>
        )}
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
