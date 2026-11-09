import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFaqs, type Faq } from "@/lib/cms";
import { Field, Toggle } from "./ProductsPanel";

export function FaqsPanel() {
  const { data: faqs, isLoading } = useFaqs(true);
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["faqs"] });

  async function create() {
    const { error } = await supabase.from("faqs").insert({
      question: "New question",
      answer: "Answer",
      display_order: (faqs?.length ?? 0) + 1,
    } as never);
    if (error) return void toast.error(error.message);
    void refresh();
  }

  if (isLoading) return <Loader2 className="mx-auto mt-10 h-5 w-5 animate-spin" />;
  return (
    <div className="space-y-4">
      <Button onClick={() => void create()}><Plus className="mr-1 h-4 w-4" /> Add FAQ</Button>
      {(faqs ?? []).map((f) => (
        <FaqRow key={f.id} faq={f} onChanged={refresh} />
      ))}
    </div>
  );
}

function FaqRow({ faq, onChanged }: { faq: Faq; onChanged: () => void }) {
  const [d, setD] = useState(faq);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const { error } = await supabase
      .from("faqs")
      .update({ question: d.question, answer: d.answer, is_active: d.is_active, display_order: d.display_order } as never)
      .eq("id", d.id);
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("FAQ saved");
    onChanged();
  }
  async function remove() {
    if (!confirm("Delete this FAQ permanently?")) return;
    const { error } = await supabase.from("faqs").delete().eq("id", d.id);
    if (error) return void toast.error(error.message);
    onChanged();
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <Field label="Question">
        <Input value={d.question} onChange={(e) => setD({ ...d, question: e.target.value })} />
      </Field>
      <Field label="Answer">
        <Textarea rows={3} value={d.answer} onChange={(e) => setD({ ...d, answer: e.target.value })} />
      </Field>
      <div className="flex flex-wrap items-center gap-5">
        <Toggle label="Visible" checked={d.is_active} onChange={(v) => setD({ ...d, is_active: v })} />
        <div className="flex items-center gap-2 text-sm">
          Order
          <Input
            className="w-20"
            type="number"
            value={d.display_order}
            onChange={(e) => setD({ ...d, display_order: Number(e.target.value) })}
          />
        </div>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={() => void save()} disabled={busy}>
            {busy && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />} Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => void remove()}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
