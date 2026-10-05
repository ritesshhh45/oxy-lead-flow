/**
 * Lightweight tracking layer.
 * Pushes to window.dataLayer (GTM) and gtag when configured in src/config/site.ts.
 */

export type TrackEvent =
  | "form_open"
  | "form_submit"
  | "quote_click"
  | "whatsapp_click"
  | "phone_click"
  | "quote_request"
  | "bulk_order_request"
  | "business_enquiry"
  | "event_enquiry"
  | "distributor_enquiry"
  | "dealer_enquiry"
  | "product_click"
  | "product_view";

type Payload = Record<string, unknown>;

export function track(event: TrackEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
  if (typeof w.gtag === "function") w.gtag("event", event, payload);
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const UTM_STORAGE = "oxytive_utm";

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Captures UTM params on first visit and keeps them for the session. */
export function captureUtm(): Utm {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fresh: Utm = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) fresh[k] = v.slice(0, 120);
  });
  try {
    if (Object.keys(fresh).length) {
      sessionStorage.setItem(UTM_STORAGE, JSON.stringify(fresh));
      return fresh;
    }
    const saved = sessionStorage.getItem(UTM_STORAGE);
    return saved ? (JSON.parse(saved) as Utm) : {};
  } catch {
    return fresh;
  }
}

/** Reads a lead source from URL params, falling back to referrer heuristics. */
export function detectSource(): string {
  if (typeof window === "undefined") return "direct";
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source") ?? captureUtm().utm_source;
  if (params.get("gclid")) return "google_ads";
  if (utm) return utm.toLowerCase();
  const ref = document.referrer;
  if (!ref) return "direct";
  if (ref.includes("google.")) return "organic";
  if (ref.includes("instagram")) return "instagram";
  if (ref.includes("facebook")) return "facebook";
  if (ref.includes("whatsapp")) return "whatsapp";
  return "referral";
}
