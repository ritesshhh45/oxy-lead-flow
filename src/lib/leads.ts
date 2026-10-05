import { captureUtm, detectSource } from "@/lib/analytics";
import { leadSchema, type LeadInput } from "@/lib/lead-schema";
import { submitLeadServer } from "@/lib/leads.functions";

export { leadSchema, type LeadInput };

export function newSubmissionKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Saves the lead server-side (DB first, then notifications). Returns the lead id. */
export async function submitLead(input: LeadInput, submissionKey: string) {
  const clean = leadSchema.parse(input);
  const res = await submitLeadServer({
    data: {
      ...clean,
      source: detectSource(),
      page: typeof window !== "undefined" ? window.location.pathname.slice(0, 200) : "",
      ...captureUtm(),
      submission_key: submissionKey,
    },
  });
  return res.id;
}
