import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead, leadSchema, newSubmissionKey, type LeadInput } from "@/lib/leads";
import { track, type TrackEvent } from "@/lib/analytics";
import { useContact, useProducts, telHref, waHref } from "@/lib/cms";
import {
  requirementTypes,
  quantityBands,
  businessTypes,
  eventTypes,
  waMessages,
} from "@/config/site";
import { cn } from "@/lib/utils";

export type LeadFormField =
  | "name"
  | "phone"
  | "email"
  | "city"
  | "area"
  | "requirement_type"
  | "quantity"
  | "product"
  | "bottle_size"
  | "event_type"
  | "event_date"
  | "expected_guests"
  | "business_name"
  | "business_type"
  | "message";

const DEFAULT_FIELDS: LeadFormField[] = [
  "name",
  "phone",
  "city",
  "requirement_type",
  "product",
  "quantity",
  "message",
];

const labels: Record<LeadFormField, string> = {
  name: "Full Name",
  phone: "Mobile Number",
  email: "Email",
  city: "City",
  area: "Area",
  requirement_type: "I'm Interested In",
  quantity: "Quantity Required",
  product: "Product",
  bottle_size: "Bottle Size",
  event_type: "Event Type",
  event_date: "Event Date",
  expected_guests: "Expected Guests",
  business_name: "Business Name",
  business_type: "Business Type",
  message: "Message",
};

const staticOptions: Partial<Record<LeadFormField, readonly string[]>> = {
  requirement_type: requirementTypes,
  quantity: quantityBands,
  business_type: businessTypes,
  event_type: eventTypes,
};

export function LeadForm({
  fields = DEFAULT_FIELDS,
  defaults = {},
  eventName = "quote_request",
  submitLabel = "Submit Enquiry",
  className,
  waMessage = waMessages.general,
}: {
  fields?: LeadFormField[];
  defaults?: Record<string, string>;
  eventName?: TrackEvent;
  submitLabel?: string;
  className?: string;
  waMessage?: string;
}) {
  const list = fields ?? DEFAULT_FIELDS;
  const contact = useContact();
  const { data: products } = useProducts();
  const [values, setValues] = useState<Record<string, string>>({ ...defaults });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [leadId, setLeadId] = useState("");
  const keyRef = useRef<string>("");
  const lockRef = useRef(false);

  useEffect(() => {
    track("form_open", { form: eventName });
  }, [eventName]);

  const productNames = (products ?? []).map((p) => (p.size ? `${p.name} (${p.size})` : p.name));
  const sizeNames = Array.from(new Set((products ?? []).map((p) => p.size).filter(Boolean)));

  const optionsFor = (f: LeadFormField): readonly string[] | undefined => {
    if (f === "product") return productNames.length ? [...productNames, "Not sure"] : undefined;
    if (f === "bottle_size") return sizeNames.length ? [...sizeNames, "Not sure"] : undefined;
    return staticOptions[f];
  };

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (lockRef.current) return;
    setServerError("");
    const payload: Record<string, string> = { ...defaults };
    list.forEach((f) => (payload[f] = values[f] ?? defaults[f] ?? ""));
    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0]);
        if (!errs[key]) errs[key] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    lockRef.current = true;
    setState("sending");
    if (!keyRef.current) keyRef.current = newSubmissionKey();
    try {
      const id = await submitLead(parsed.data as LeadInput, keyRef.current);
      setLeadId(id);
      track("form_submit", { form: eventName });
      track(eventName, { requirement: payload["requirement_type"], product: payload["product"] });
      setState("done");
    } catch (err) {
      console.error(err);
      setState("error");
      setServerError("We couldn't submit your enquiry right now. Please try again, or call / WhatsApp us directly.");
    } finally {
      lockRef.current = false;
    }
  }

  if (state === "done") {
    const v = { ...defaults, ...values };
    const followUp = [
      "Hi OXYTIVE Team,",
      "I just submitted an enquiry on your website.",
      "",
      `Name: ${v["name"] ?? ""}`,
      v["product"] ? `Product: ${v["product"]}` : `Requirement: ${v["requirement_type"] ?? "-"}`,
      `Quantity: ${v["quantity"] || "-"}`,
      `Lead ID: ${leadId.slice(0, 8).toUpperCase()}`,
      "",
      "Please contact me regarding this enquiry.",
    ].join("\n");
    return (
      <div className={cn("rounded-xl border border-border bg-card p-6 text-center", className)}>
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand" aria-hidden />
        <h3 className="mt-3 font-display text-xl">Thank you!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your enquiry has been received successfully. Our OXYTIVE team will contact you shortly.
        </p>
        {leadId && (
          <p className="mt-2 text-xs text-muted-foreground">
            Reference: <span className="font-mono">{leadId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <a
              href={waHref(contact.whatsapp, followUp)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { from: "thank_you" })}
            >
              <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp Us Now
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={telHref(contact.phone1)} onClick={() => track("phone_click", { from: "thank_you" })}>
              <Phone className="mr-1 h-4 w-4" /> Call OXYTIVE
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((f) => {
          const isWide = f === "message";
          const options = optionsFor(f);
          return (
            <div key={f} className={cn("min-w-0 space-y-1.5", isWide && "sm:col-span-2")}>
              <Label htmlFor={`lead-${f}`}>
                {labels[f]}
                {(f === "name" || f === "phone") && <span className="text-brand"> *</span>}
              </Label>
              {options ? (
                <select
                  id={`lead-${f}`}
                  value={values[f] ?? ""}
                  onChange={(e) => set(f, e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select…</option>
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f === "message" ? (
                <Textarea
                  id={`lead-${f}`}
                  rows={3}
                  maxLength={1000}
                  value={values[f] ?? ""}
                  onChange={(e) => set(f, e.target.value)}
                  placeholder="Tell us what you need"
                />
              ) : (
                <Input
                  id={`lead-${f}`}
                  type={f === "event_date" ? "date" : f === "phone" ? "tel" : f === "email" ? "email" : "text"}
                  inputMode={f === "phone" ? "tel" : undefined}
                  value={values[f] ?? ""}
                  onChange={(e) => set(f, e.target.value)}
                  autoComplete={f === "name" ? "name" : f === "phone" ? "tel" : f === "email" ? "email" : "off"}
                />
              )}
              {errors[f] && <p className="text-xs text-destructive">{errors[f]}</p>}
            </div>
          );
        })}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" size="lg" className="flex-1" disabled={state === "sending"}>
          {state === "sending" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {state === "sending" ? "Submitting..." : submitLabel}
        </Button>
        <Button asChild size="lg" variant="outline" className="sm:w-auto">
          <a
            href={waHref(contact.whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { from: "lead_form" })}
          >
            <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        We use your details only to respond to this enquiry.
      </p>
    </form>
  );
}
