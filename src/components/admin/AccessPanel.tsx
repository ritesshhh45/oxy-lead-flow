import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OWNER = "oxytive.admin@gmail.com";

type Req = { id: string; email: string; status: string; created_at: string };

export function useAccessRequests() {
  return useQuery({
    queryKey: ["access_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("access_requests").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Req[];
    },
    refetchInterval: 60_000,
  });
}

export function AccessPanel() {
  const qc = useQueryClient();
  const { data: reqs, isLoading } = useAccessRequests();
  const { data: admins } = useQuery({
    queryKey: ["admin_emails"],
    queryFn: async () => {
      const { data, error } = await supabase.from("admin_emails").select("email,created_at").order("created_at");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
  const [email, setEmail] = useState("");
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["access_requests"] });
    void qc.invalidateQueries({ queryKey: ["admin_emails"] });
  };

  async function addAdmin(addr: string) {
    const { error } = await supabase.from("admin_emails").insert({ email: addr.trim().toLowerCase() } as never);
    if (error && !/duplicate/i.test(error.message)) throw new Error(error.message);
  }

  async function decide(r: Req, approve: boolean) {
    try {
      if (approve) await addAdmin(r.email);
      const { error } = await supabase
        .from("access_requests")
        .update({ status: approve ? "approved" : "rejected", decided_at: new Date().toISOString() } as never)
        .eq("id", r.id);
      if (error) throw new Error(error.message);
      toast.success(approve ? `${r.email} is now an admin` : "Request rejected");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function removeAdmin(addr: string) {
    if (!confirm(`Remove admin access for ${addr}?`)) return;
    const { error } = await supabase.from("admin_emails").delete().eq("email", addr);
    if (error) return void toast.error(error.message);
    // also mark any approved request as rejected so they can re-request later
    await supabase.from("access_requests").update({ status: "rejected" } as never).ilike("email", addr);
    refresh();
  }

  async function manualAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await addAdmin(email);
      setEmail("");
      refresh();
      toast.success("Admin added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  const pending = (reqs ?? []).filter((r) => r.status === "pending");
  const past = (reqs ?? []).filter((r) => r.status !== "pending");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Access requests {pending.length > 0 && `(${pending.length})`}</h2>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        ) : (
          pending.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.email}</p>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</p>
              </div>
              <Button size="sm" onClick={() => void decide(r, true)}><Check className="mr-1 h-4 w-4" /> Approve</Button>
              <Button size="sm" variant="outline" onClick={() => void decide(r, false)}><X className="mr-1 h-4 w-4" /> Reject</Button>
            </div>
          ))
        )}
        {past.length > 0 && (
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground">Earlier decisions ({past.length})</summary>
            <ul className="mt-2 space-y-1">
              {past.map((r) => (
                <li key={r.id} className="flex justify-between gap-2"><span className="truncate">{r.email}</span><span className="capitalize text-muted-foreground">{r.status}</span></li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Admins</h2>
        {(admins ?? []).map((a) => (
          <div key={a.email} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-sm">
            <span className="truncate">{a.email}</span>
            {a.email.toLowerCase() === OWNER ? (
              <span className="text-xs text-muted-foreground">Owner</span>
            ) : (
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => void removeAdmin(a.email)}><Trash2 className="h-4 w-4" /></Button>
            )}
          </div>
        ))}
        <form onSubmit={manualAdd} className="flex gap-2">
          <Input type="email" placeholder="Add admin by email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit">Add</Button>
        </form>
        <p className="text-xs text-muted-foreground">
          An added person can open this panel only after signing in with that same, email-confirmed address.
        </p>
      </section>
    </div>
  );
}
