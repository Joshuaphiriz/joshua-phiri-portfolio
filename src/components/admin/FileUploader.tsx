"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Loader2 } from "lucide-react";

export function FileUploader({
  pathPrefix,
  accept,
  label,
  onUploaded,
}: {
  /** Folder prefix inside the portfolio-media bucket, e.g. "projects/abc123" */
  pathPrefix: string;
  accept: string;
  label: string;
  onUploaded: (storagePath: string, fileName: string) => void | Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const safeName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const path = `${pathPrefix}/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-media")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      await onUploaded(path, file.name);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-lg border border-dashed border-hairline px-4 py-2.5 text-sm text-charcoal transition hover:border-brass hover:text-brass disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Upload size={15} />
        )}
        {uploading ? "Uploading…" : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
