import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, LogOut, Phone, MessageCircle, Mail, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const STATUSES = ["new", "contacted", "quoted", "converted", "closed", "cancelled", "qualified", "lost"] as const;
const MAIN_STATUSES = ["new", "contacted", "quoted", "converted", "closed", "cancelled"] as const;

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
  product: string | null;
  email_notification_status: string | null;
  whatsapp_notification_status: string | null;
  notification_error: string | null;
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
  const [mode, setMode] = useState<"in" | "up">("in");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "up") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) toast.error(error.message);
      else if (!data.session) toast.success("Check your email to confirm your account, then sign in.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">OXYTIVE Admin</p>
        <h1 className="mt-1 text-2xl">{mode === "in" ? "Sign in" : "Create admin account"}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Only approved OXYTIVE administrator emails can view enquiries.
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {mode === "in" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            className="w-full text-center text-xs text-muted-foreground underline"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
          >
            {mode === "in" ? "First time? Create your admin account" : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}

function waDigits(p: string) {
  const d = p.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
}

function NotifyBadge({ label, v }: { label: string; v: string | null }) {
  const tone =
    v === "sent"
      ? "bg-primary/10 text-primary"
      : v === "failed"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] ${tone}`}>
      {label}: {(v ?? "pending").replace("_", " ")}
    </span>
  );
}

function topCounts(leads: Lead[], key: keyof Lead) {
  const m = new Map<string, number>();
  leads.forEach((l) => {
    const v = (l[key] as string | null)?.trim();
    if (v) m.set(v, (m.get(v) ?? 0) + 1);
  });
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Lead | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setLeads((data ?? []) as unknown as Lead[]);
  }

  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.rpc("is_admin").then(({ data }) => {
      setAllowed(!!data);
      if (data) void load();
    });
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const week = day - ((now.getDay() + 6) % 7) * 86400000;
    const month = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const t = (l: Lead) => new Date(l.created_at).getTime();
    const by = (s: string) => leads.filter((l) => l.status === s).length;
    const converted = by("converted");
    return {
      total: leads.length,
      today: leads.filter((l) => t(l) >= day).length,
      week: leads.filter((l) => t(l) >= week).length,
      month: leads.filter((l) => t(l) >= month).length,
      new: by("new"),
      contacted: by("contacted"),
      quoted: by("quoted"),
      converted,
      closed: by("closed"),
      cancelled: by("cancelled"),
      rate: leads.length ? ((converted / leads.length) * 100).toFixed(1) : "0.0",
    };
  }, [leads]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return leads.filter(
      (l) =>
        (filter === "all" || l.status === filter) &&
        (!term ||
          [l.name, l.phone, l.email, l.city, l.product, l.requirement_type]
            .filter(Boolean)
            .some((v) => (v as string).toLowerCase().includes(term))),
    );
  }, [leads, filter, q]);

  async function setStatus(id: string, status: string) {
    const prev = leads;
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
    setOpen((o) => (o && o.id === id ? { ...o, status } : o));
    const { error } = await supabase.from("leads").update({ status } as never).eq("id", id);
    if (error) {
      setLeads(prev);
      toast.error(error.message);
    } else toast.success("Status updated");
  }

  const cards: [string, string | number][] = [
    ["Total enquiries", stats.total],
    ["Today", stats.today],
    ["This week", stats.week],
    ["This month", stats.month],
    ["New", stats.new],
    ["Contacted", stats.contacted],
    ["Quoted", stats.quoted],
    ["Converted", stats.converted],
    ["Closed", stats.closed],
    ["Cancelled", stats.cancelled],
    ["Conversion rate", `${stats.rate}%`],
  ];

  if (allowed === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl">Access restricted</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This account is not an approved OXYTIVE administrator.
        </p>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">OXYTIVE Admin</p>
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

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {cards.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">{k}</p>
              <p className="mt-1 text-2xl font-semibold">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(
            [
              ["Top products", topCounts(leads, "product")],
              ["Top cities", topCounts(leads, "city")],
              ["Requirement types", topCounts(leads, "requirement_type")],
            ] as [string, [string, number][]][]
          ).map(([title, rows]) => (
            <div key={title} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">{title}</p>
              {rows.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No data yet</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm">
                  {rows.map(([n, c]) => (
                    <li key={n} className="flex justify-between gap-2">
                      <span className="truncate">{n}</span>
                      <span className="text-muted-foreground">{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {["all", ...MAIN_STATUSES].map((s) => (
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
          <div className="relative ml-auto w-full sm:w-64">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search name, phone, city…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : shown.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">No enquiries here yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  {["Name", "Phone", "Email", "City", "Requirement", "Product", "Qty", "Status", "Alerts", "Received"].map((h) => (
                    <th key={h} className="px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => (
                  <tr key={l.id} className="cursor-pointer border-b border-border last:border-0 hover:bg-accent/40" onClick={() => setOpen(l)}>
                    <td className="px-3 py-2 font-medium">{l.name}</td>
                    <td className="px-3 py-2">{l.phone}</td>
                    <td className="px-3 py-2">{l.email ?? "—"}</td>
                    <td className="px-3 py-2">{l.city ?? "—"}</td>
                    <td className="px-3 py-2">{l.requirement_type ?? "—"}</td>
                    <td className="px-3 py-2">{l.product ?? l.bottle_size ?? "—"}</td>
                    <td className="px-3 py-2">{l.quantity ?? "—"}</td>
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={l.status}
                        onChange={(e) => void setStatus(l.id, e.target.value)}
                        className="rounded-md border border-input bg-background px-2 py-1 text-xs capitalize"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="space-y-1 px-3 py-2">
                      <NotifyBadge label="Email" v={l.email_notification_status} />{" "}
                      <NotifyBadge label="WA" v={l.whatsapp_notification_status} />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(l.created_at).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{open.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm"><a href={`tel:${open.phone}`}><Phone className="mr-1 h-4 w-4" /> Call</a></Button>
                <Button asChild size="sm" variant="outline">
                  <a href={`https://wa.me/${waDigits(open.phone)}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-1 h-4 w-4" /> WhatsApp</a>
                </Button>
                {open.email && (
                  <Button asChild size="sm" variant="outline"><a href={`mailto:${open.email}`}><Mail className="mr-1 h-4 w-4" /> Email</a></Button>
                )}
                <select
                  value={open.status}
                  onChange={(e) => void setStatus(open.id, e.target.value)}
                  className="ml-auto rounded-md border border-input bg-background px-2 py-1 text-sm capitalize"
                >
                  {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <dl className="mt-2 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {(
                  [
                    ["Phone", open.phone], ["Email", open.email], ["City", open.city], ["Area", open.area],
                    ["Requirement", open.requirement_type], ["Product", open.product], ["Quantity", open.quantity],
                    ["Bottle size", open.bottle_size], ["Event", open.event_type], ["Event date", open.event_date],
                    ["Guests", open.expected_guests], ["Business", open.business_name], ["Business type", open.business_type],
                    ["Source", open.source], ["Page", open.page], ["Submitted", new Date(open.created_at).toLocaleString("en-IN")],
                    ["Email notification", open.email_notification_status], ["WhatsApp notification", open.whatsapp_notification_status],
                    ["Lead ID", open.id],
                  ] as [string, string | null][]
                ).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              {open.message && <p className="rounded-lg bg-muted p-3 text-sm leading-relaxed">{open.message}</p>}
              {open.notification_error && (
                <p className="text-xs text-destructive">Notification issue: {open.notification_error}</p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
