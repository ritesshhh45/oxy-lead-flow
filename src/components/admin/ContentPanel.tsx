import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contentDefaults, mediaUrl, useContentMap } from "@/lib/cms";
import { uploadMedia } from "@/lib/admin";
import { Field, Toggle } from "./ProductsPanel";

const SECTIONS: [string, string][] = [
  ["contact", "Contact details"],
  ["hero", "Home hero"],
  ["products_section", "Products section"],
  ["business", "Business section"],
  ["events", "Events section"],
  ["distributor", "Distributor section"],
  ["quality", "Quality section"],
  ["about", "About"],
  ["why", "Why OXYTIVE"],
  ["footer", "Footer"],
];

const IMAGE_KEYS = new Set(["image_url", "certificates", "lab_reports", "manufacturing"]);
type Block = Record<string, unknown>;

export function ContentPanel() {
  const { data, isLoading } = useContentMap();
  if (isLoading) return <Loader2 className="mx-auto mt-10 h-5 w-5 animate-spin" />;
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Edit the text shown on the public website. Empty fields fall back to the built-in default.
      </p>
      {SECTIONS.map(([key, label]) => (
        <SectionEditor key={key} k={key} label={label} stored={data?.[key]} />
      ))}
    </div>
  );
}

function SectionEditor({ k, label, stored }: { k: string; label: string; stored?: Block }) {
  const qc = useQueryClient();
  const [d, setD] = useState<Block>({ ...(contentDefaults[k] ?? {}), ...(stored ?? {}) });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert({ key: k, value: d } as never, { onConflict: "key" });
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success(`${label} saved`);
    void qc.invalidateQueries({ queryKey: ["site_content"] });
  }

  async function upload(field: string, file: File) {
    setUploading(field);
    try {
      const { path } = await uploadMedia(file, `${label} ${field}`);
      setD((p) => ({ ...p, [field]: path }));
      toast.success("Uploaded - press Save to publish");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  return (
    <details className="rounded-2xl border border-border bg-card p-5" open={k === "contact"}>
      <summary className="cursor-pointer text-base font-medium">{label}</summary>
      <div className="mt-4 space-y-3">
        {Object.entries(d).map(([field, value]) => {
          if (typeof value === "boolean") {
            return <Toggle key={field} label={field.replace(/_/g, " ")} checked={value} onChange={(v) => setD({ ...d, [field]: v })} />;
          }
          if (Array.isArray(value)) {
            const rows = value as { title?: string; text?: string }[];
            return (
              <Field key={field} label={field}>
                <div className="space-y-2">
                  {rows.map((r, i) => (
                    <div key={i} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_2fr_auto]">
                      <Input value={r.title ?? ""} placeholder="Title" onChange={(e) => setD({ ...d, [field]: rows.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} />
                      <Input value={r.text ?? ""} placeholder="Text" onChange={(e) => setD({ ...d, [field]: rows.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} />
                      <Button size="icon" variant="ghost" onClick={() => setD({ ...d, [field]: rows.filter((_, j) => j !== i) })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => setD({ ...d, [field]: [...rows, { title: "", text: "" }] })}>
                    <Plus className="mr-1 h-4 w-4" /> Add item
                  </Button>
                </div>
              </Field>
            );
          }
          if (typeof value !== "string") return null;
          const long = value.length > 80 || /text|subtitle|tagline/.test(field);
          const isImg = IMAGE_KEYS.has(field);
          const preview = isImg ? mediaUrl(value) : null;
          return (
            <Field key={field} label={field.replace(/_/g, " ")}>
              {long ? (
                <Textarea rows={3} value={value} onChange={(e) => setD({ ...d, [field]: e.target.value })} />
              ) : (
                <Input value={value} onChange={(e) => setD({ ...d, [field]: e.target.value })} />
              )}
              {isImg && (
                <div className="mt-1.5 flex items-center gap-3">
                  {preview && <img src={preview} alt="" className="h-12 w-12 rounded border border-border object-contain" />}
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
                    {uploading === field ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(field, f); }} />
                  </label>
                </div>
              )}
            </Field>
          );
        })}
        <Button onClick={() => void save()} disabled={busy}>
          {busy && <Loader2 className="mr-1 h-4 w-4 animate-spin" />} Save {label}
        </Button>
      </div>
    </details>
  );
}
