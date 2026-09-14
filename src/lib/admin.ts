import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an image to private Cloud storage and records it in media_assets.
 * Returns the storage path, which is rendered through /api/public/media/<path>
 * so links stay valid after every deployment.
 */
export async function uploadMedia(file: File, label?: string) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw new Error(error.message);

  const url = `/api/public/media/${path}`;
  const { error: rowError } = await supabase
    .from("media_assets")
    .insert({ path, url, label: label ?? file.name } as never);
  if (rowError) throw new Error(rowError.message);

  return { path, url };
}

export async function deleteMedia(id: string, path: string) {
  await supabase.storage.from("media").remove([path]);
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]!);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
