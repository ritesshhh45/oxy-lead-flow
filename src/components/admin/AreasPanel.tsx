import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServiceAreas, type ServiceAreaRow } from "@/lib/cms";
import { Toggle } from "./ProductsPanel";

export function AreasPanel() {
  const { data: areas, isLoading } = useServiceAreas(true);
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["service_areas"] });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    const { error } = await supabase
      .from("service_areas")
      .insert({ name: n, display_order: (areas?.length ?? 0) + 1 } as never);
    if (error) return void toast.error(error.message);
    setName("");
    void refresh();
  }

  if (isLoading) return <Loader2 className="mx-auto mt-10 h-5 w-5 animate-spin" />;
  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex max-w-md gap-2">
        <Input placeholder="New city / area name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit"><Plus className="mr-1 h-4 w-4" /> Add</Button>
      </form>
      <div className="space-y-2">
        {(areas ?? []).map((a) => (
          <AreaRow key={a.id} area={a} onChanged={refresh} />
        ))}
      </div>
    </div>
  );
}

function AreaRow({ area, onChanged }: { area: ServiceAreaRow; onChanged: () => void }) {
  const [d, setD] = useState(area);
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    const { error } = await supabase
      .from("service_areas")
      .update({ name: d.name, is_active: d.is_active, display_order: d.display_order } as never)
      .eq("id", d.id);
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("Area saved");
    onChanged();
  }
  async function remove() {
    if (!confirm(`Delete ${d.name}?`)) return;
    const { error } = await supabase.from("service_areas").delete().eq("id", d.id);
    if (error) return void toast.error(error.message);
    onChanged();
  }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
      <Input className="min-w-[10rem] flex-1" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
      <Input
        className="w-20"
        type="number"
        value={d.display_order}
        onChange={(e) => setD({ ...d, display_order: Number(e.target.value) })}
      />
      <Toggle label="Visible" checked={d.is_active} onChange={(v) => setD({ ...d, is_active: v })} />
      <Button size="sm" onClick={() => void save()} disabled={busy}>
        {busy && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />} Save
      </Button>
      <Button size="sm" variant="ghost" onClick={() => void remove()}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}
