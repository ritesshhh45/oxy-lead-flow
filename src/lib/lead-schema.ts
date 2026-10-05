import { z } from "zod";

const opt = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid mobile number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid mobile number")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a valid mobile number"),
  email: z.string().trim().email("Please enter a valid email").max(160).optional().or(z.literal("")),
  city: opt(80),
  area: opt(120),
  requirement_type: opt(60),
  quantity: opt(60),
  product: opt(120),
  bottle_size: opt(40),
  event_type: opt(60),
  event_date: opt(20),
  expected_guests: opt(40),
  business_name: opt(120),
  business_type: opt(60),
  message: opt(1000),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const submissionMeta = z.object({
  source: opt(80),
  page: opt(200),
  utm_source: opt(120),
  utm_medium: opt(120),
  utm_campaign: opt(120),
  utm_term: opt(120),
  utm_content: opt(120),
  submission_key: z.string().trim().min(8).max(80),
});
