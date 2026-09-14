import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/config/site";

export type Product = {
  id: string;
  name: string;
  size: string;
  description: string;
  ideal_for: string[];
  price: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
};

export type Faq = { id: string; question: string; answer: string; is_active: boolean; display_order: number };
export type ServiceAreaRow = { id: string; name: string; is_active: boolean; display_order: number };

export type ContactContent = {
  company: string;
  brand: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  show_email: boolean;
  address_line1: string;
  address_line2: string;
  hours: string;
};

export const defaultContact: ContactContent = {
  company: site.company,
  brand: site.brand,
  phone1: site.phone,
  phone2: site.phone2,
  whatsapp: site.whatsapp,
  email: "",
  show_email: false,
  address_line1: site.address.line1,
  address_line2: `${site.address.line2}, ${site.address.city}`,
  hours: site.hours,
};

export const contentDefaults: Record<string, Record<string, unknown>> = {
  contact: defaultContact as unknown as Record<string, unknown>,
  hero: {
    headline: "Pure Water. Powerful First Impression.",
    subtitle:
      "Premium packaged drinking water for everyday hydration, businesses, events and every moment that matters.",
    brand_line: site.brandLine,
    cta: "Get a Quote",
    cta_secondary: "Explore OXYTIVE",
    image_url: "",
  },
  products_section: {
    title: "Explore OXYTIVE",
    subtitle: "Choose the right OXYTIVE for every occasion.",
  },
  business: {
    title: "Your Guests Notice the Details.",
    text: "Make every table, stay and service experience better with OXYTIVE packaged drinking water.",
  },
  events: {
    title: "Make Every Celebration Refreshing.",
    text: "Packaged drinking water for weddings, corporate days, college festivals and every gathering in between.",
  },
  distributor: {
    title: "Grow With OXYTIVE.",
    text: "Partner with Vedarth Water Industry to distribute or retail OXYTIVE packaged drinking water.",
  },
  quality: {
    title: "Every Drop Deserves Attention.",
    steps: [],
    bis: "",
    fssai: "",
    certificates: "",
    lab_reports: "",
    manufacturing: "",
  },
  about: {
    title: "Vedarth Water Industry",
    text: "Vedarth Water Industry is the company behind OXYTIVE packaged drinking water.",
  },
  why: { title: "Why OXYTIVE" },
  footer: {
    tagline: "A bottled drinking water brand by Vedarth Water Industry.",
    developer: "Ritesh Pawar",
  },
};

async function fetchProducts(includeHidden = false) {
  let q = supabase.from("products").select("*").order("display_order", { ascending: true });
  if (!includeHidden) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export function useProducts(includeHidden = false) {
  return useQuery({
    queryKey: ["products", includeHidden],
    queryFn: () => fetchProducts(includeHidden),
    staleTime: 30_000,
  });
}

async function fetchContent() {
  const { data, error } = await supabase.from("site_content").select("key,value");
  if (error) throw new Error(error.message);
  const map: Record<string, Record<string, unknown>> = {};
  (data ?? []).forEach((r) => {
    map[r.key] = (r.value ?? {}) as Record<string, unknown>;
  });
  return map;
}

export function useContentMap() {
  return useQuery({ queryKey: ["site_content"], queryFn: fetchContent, staleTime: 30_000 });
}

/** Returns a content block merged over its defaults. */
export function useContent<T extends Record<string, unknown>>(key: string): T {
  const { data } = useContentMap();
  return { ...(contentDefaults[key] ?? {}), ...(data?.[key] ?? {}) } as T;
}

export function useContact(): ContactContent {
  return useContent<ContactContent & Record<string, unknown>>("contact");
}

export function useFaqs(includeHidden = false) {
  return useQuery({
    queryKey: ["faqs", includeHidden],
    queryFn: async () => {
      let q = supabase.from("faqs").select("*").order("display_order", { ascending: true });
      if (!includeHidden) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return (data ?? []) as Faq[];
    },
    staleTime: 30_000,
  });
}

export function useServiceAreas(includeHidden = false) {
  return useQuery({
    queryKey: ["service_areas", includeHidden],
    queryFn: async () => {
      let q = supabase.from("service_areas").select("*").order("display_order", { ascending: true });
      if (!includeHidden) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return (data ?? []) as ServiceAreaRow[];
    },
    staleTime: 30_000,
  });
}

/** Phone helpers derived from live contact content. */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? "91" + digits : digits}`;
}

export function waHref(number: string, message: string) {
  const digits = (number || "").replace(/\D/g, "") || site.whatsapp;
  return `https://wa.me/${digits.length === 10 ? "91" + digits : digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Turns a stored media reference into a deployment-safe URL.
 * Storage paths are served through /api/public/media/<path> so links keep
 * working after every deployment. Absolute URLs are passed through.
 */
export function mediaUrl(ref: string | null | undefined): string | null {
  if (!ref) return null;
  const v = ref.trim();
  if (!v) return null;
  if (/^(https?:)?\/\//i.test(v)) return v;
  if (v.startsWith("/")) return v;
  return `/api/public/media/${v.split("/").map(encodeURIComponent).join("/")}`;
}

export type MediaAsset = { id: string; path: string; url: string; label: string | null; created_at: string };

export function useMedia() {
  return useQuery({
    queryKey: ["media_assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as MediaAsset[];
    },
    staleTime: 10_000,
  });
}

/** True when the signed-in account is an approved OXYTIVE administrator. */
export function useIsAdmin(enabled = true) {
  return useQuery({
    queryKey: ["is_admin"],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) throw new Error(error.message);
      return Boolean(data);
    },
    staleTime: 60_000,
  });
}
