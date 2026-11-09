import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMedia, mediaUrl } from "@/lib/cms";
import { deleteMedia, uploadMedia } from "@/lib/admin";

export function MediaPanel() {
  const { data: items, isLoading } = useMedia();
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["media_assets"] });

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const f of Array.from(files)) await uploadMedia(f);
      toast.success("Uploaded");
      void refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string, path: string) {
    if (!confirm("Delete this image? Pages using it will lose the image.")) return;
    try {
      await deleteMedia(id, path);
      void refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload images
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => void onFiles(e.target.files)} />
      </label>
      {isLoading ? (
        <Loader2 className="mx-auto mt-10 h-5 w-5 animate-spin" />
      ) : !items?.length ? (
        <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex aspect-square items-center justify-center bg-muted">
                <img src={mediaUrl(m.path) ?? ""} alt={m.label ?? ""} className="h-full w-full object-contain" loading="lazy" />
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="truncate text-[11px] text-muted-foreground">{m.label}</span>
                <span className="flex shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    title="Copy link"
                    onClick={() => {
                      void navigator.clipboard.writeText(`${window.location.origin}${mediaUrl(m.path)}`);
                      toast.success("Link copied");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => void remove(m.id, m.path)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
