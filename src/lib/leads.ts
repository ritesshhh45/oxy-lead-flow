import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { captureUtm, detectSource } from "@/lib/analytics";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid mobile number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid mobile number"),
  email: z.string().trim().email("Please enter a valid email").max(160).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  area: z.string().trim().max(120).optional().or(z.literal("")),
  requirement_type: z.string().trim().max(60).optional().or(z.literal("")),
  quantity: z.string().trim().max(60).optional().or(z.literal("")),
  product: z.string().trim().max(120).optional().or(z.literal("")),
  bottle_size: z.string().trim().max(40).optional().or(z.literal("")),
  event_type: z.string().trim().max(60).optional().or(z.literal("")),
  event_date: z.string().trim().max(20).optional().or(z.literal("")),
  expected_guests: z.string().trim().max(40).optional().or(z.literal("")),
  business_name: z.string().trim().max(120).optional().or(z.literal("")),
  business_type: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export async function submitLead(input: LeadInput) {
  const clean = leadSchema.parse(input);
  const row: Record<string, unknown> = { ...clean };
  Object.keys(row).forEach((k) => {
    if (row[k] === "" || row[k] === undefined) row[k] = null;
  });
  row["source"] = detectSource();
  row["page"] = typeof window !== "undefined" ? window.location.pathname : null;
  Object.assign(row, captureUtm());

  const { error } = await supabase.from("leads").insert(row as never);
  if (error) throw new Error(error.message);
}
