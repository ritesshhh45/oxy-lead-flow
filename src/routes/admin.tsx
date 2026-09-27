import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const STATUSES = ["new", "contacted", "qualified", "quoted", "converted", "lost"] as const;

type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  area: string | null;
  requirement_type: string | null;
  quantity: string | null;
  bottle_size: string | null;
  event_type: string | null;
  event_date: string | null;
  expected_guests: string | null;
  business_name: string | null;
  business_type: string | null;
  message: string | null;
  source: string | null;
  page: string | null;
  status: string;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Lead Dashboard — OXYTIVE" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Internal OXYTIVE enquiry dashboard." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<unknown | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return session ? <Dashboard /> : <SignIn />;
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <h1 className="text-2xl">Team sign in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enquiries are visible only to authorised OXYTIVE team accounts.
        </p>
        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setLeads((data ?? []) as Lead[]);
  }

  useEffect(() => {
    void load();
  }, []);

  const shown = useMemo(
    () => (filter === "all" ? leads : leads.filter((l) => l.status === filter)),
    [leads, filter],
  );

  async function setStatus(id: string, status: (typeof STATUSES)[number]) {
    const prev = leads;
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);

    if (error) {
      setLeads(prev);
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl sm:text-3xl">Enquiries</h1>
            <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={() => void load()}>
              <RefreshCw className="mr-1 h-4 w-4" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
              <LogOut className="mr-1 h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-2">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${
                filter === s
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              }`}
            >
              {s} {s !== "all" && `(${leads.filter((l) => l.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : shown.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">No enquiries here yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {shown.map((l) => (
              <article key={l.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg">{l.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      <a href={`tel:${l.phone}`} className="underline">
                        {l.phone}
                      </a>
                      {l.email ? ` • ${l.email}` : ""}
                      {l.city ? ` • ${l.city}` : ""}
                      {l.area ? `, ${l.area}` : ""}
                    </p>
                  </div>
                  <select
                    value={l.status}
                    onChange={(e) => void setStatus(l.id, e.target.value as (typeof STATUSES)[number])}
                    className="shrink-0 rounded-md border border-input bg-background px-2 py-1.5 text-xs capitalize"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <dl className="mt-4 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-3">
                  {(
                    [
                      ["Requirement", l.requirement_type],
                      ["Quantity", l.quantity],
                      ["Bottle size", l.bottle_size],
                      ["Event", l.event_type],
                      ["Event date", l.event_date],
                      ["Guests", l.expected_guests],
                      ["Business", l.business_name],
                      ["Business type", l.business_type],
                      ["Source", l.source],
                      ["Page", l.page],
                      ["Received", new Date(l.created_at).toLocaleString()],
                    ] as [string, string | null][]
                  )
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="min-w-0">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="truncate">{v}</dd>
                      </div>
                    ))}
                </dl>

                {l.message && <p className="mt-3 text-sm leading-relaxed">{l.message}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
