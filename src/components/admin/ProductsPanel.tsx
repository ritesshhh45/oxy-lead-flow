import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProducts, mediaUrl, type Product } from "@/lib/cms";
import { uploadMedia } from "@/lib/admin";

type Draft = Partial<Product>;

export function ProductsPanel() {
  const { data: products, isLoading } = useProducts(true);
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["products"] });

  async function save(id: string, patch: Draft) {
    setBusy(id);
    const { error } = await supabase.from("products").update(patch as never).eq("id", id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Product saved");
    void refresh();
  }

  async function create() {
    const { error } = await supabase.from("products").insert({
      name: "New pack",
      size: "",
      description: "",
      display_order: (products?.length ?? 0) + 1,
    } as never);
    if (error) return toast.error(error.message);
    void refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product permanently?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    void refresh();
  }

  if (isLoading) return <Loader2 className="mx-auto mt-10 h-5 w-5 animate-spin" />;

  return (
    <div className="space-y-5">
      <Button onClick={() => void create()}>
        <Plus className="mr-1 h-4 w-4" /> Add product
      </Button>
      {(products ?? []).map((p) => (
        <ProductRow
          key={p.id}
          product={p}
          busy={busy === p.id}
          onSave={(patch) => void save(p.id, patch)}
          onDelete={() => void remove(p.id)}
          onUploaded={refresh}
        />
      ))}
    </div>
  );
}

function ProductRow({
  product,
  busy,
  onSave,
  onDelete,
  onUploaded,
}: {
  product: Product;
  busy: boolean;
  onSave: (patch: Draft) => void;
  onDelete: () => void;
  onUploaded: () => void;
}) {
  const [d, setD] = useState<Product>(product);
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof Product, v: unknown) => setD((p) => ({ ...p, [k]: v }) as Product);

  async function onFile(file: File) {
    setUploading(true);
    try {
      const { path } = await uploadMedia(file, `${d.name} image`);
      set("image_url", path);
      onSave({ image_url: path });
      onUploaded();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const img = mediaUrl(d.image_url);

  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 lg:grid-cols-[160px_minmax(0,1fr)]">
      <div className="space-y-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
          {img ? (
            <img src={img} alt={d.image_alt ?? d.name} className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-muted-foreground">No image</span>
          )}
        </div>
        <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs hover:bg-accent">
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Upload image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
        </label>
      </div>

      <div className="min-w-0 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <Input value={d.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Size (e.g. 500 mL)">
            <Input value={d.size ?? ""} onChange={(e) => set("size", e.target.value)} />
          </Field>
          <Field label="Price (optional)">
            <Input value={d.price ?? ""} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Display order">
            <Input
              type="number"
              value={d.display_order}
              onChange={(e) => set("display_order", Number(e.target.value))}
            />
          </Field>
          <Field label="Image alt text">
            <Input value={d.image_alt ?? ""} onChange={(e) => set("image_alt", e.target.value)} />
          </Field>
          <Field label="Ideal for (comma separated)">
            <Input
              value={(d.ideal_for ?? []).join(", ")}
              onChange={(e) =>
                set(
                  "ideal_for",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
        </div>
        <Field label="Description">
          <Textarea rows={2} value={d.description ?? ""} onChange={(e) => set("description", e.target.value)} />
        </Field>

        <div className="flex flex-wrap items-center gap-5">
          <Toggle label="Visible" checked={d.is_active} onChange={(v) => set("is_active", v)} />
          <Toggle label="Featured" checked={d.is_featured} onChange={(v) => set("is_featured", v)} />
          <div className="ml-auto flex gap-2">
            <Button size="sm" onClick={() => onSave(d)} disabled={busy}>
              {busy && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />} Save
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Switch checked={checked} onCheckedChange={onChange} /> {label}
    </label>
  );
}
