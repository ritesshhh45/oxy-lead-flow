import { createServerFn } from "@tanstack/react-start";
import { leadSchema, submissionMeta } from "./lead-schema";

const input = leadSchema.merge(submissionMeta);

/**
 * Saves the enquiry FIRST, then attempts admin notifications.
 * Notification failures never affect the saved lead.
 */
export const submitLeadServer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { notifyNewLead } = await import("./lead-notify.server");

    const row: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) row[k] = v === "" || v === undefined ? null : v;
    row["source"] = row["source"] ?? "direct";

    // Idempotency: a repeated submission_key returns the existing lead.
    const existing = await supabaseAdmin
      .from("leads")
      .select("id, created_at")
      .eq("submission_key", data.submission_key)
      .maybeSingle();
    if (existing.data) return { id: existing.data.id, duplicate: true };

    const { data: saved, error } = await supabaseAdmin
      .from("leads")
      .insert(row as never)
      .select("*")
      .single();
    if (error || !saved) {
      console.error("Lead insert failed", error);
      throw new Error("We couldn't save your enquiry. Please try again or call us.");
    }

    try {
      const result = await notifyNewLead(saved as never);
      await supabaseAdmin
        .from("leads")
        .update({
          email_notification_status: result.email,
          whatsapp_notification_status: result.whatsapp,
          notification_error: result.errors.length ? result.errors.join(" | ").slice(0, 1000) : null,
        } as never)
        .eq("id", saved.id);
    } catch (e) {
      console.error("Lead notification error", e);
    }

    return { id: saved.id as string, duplicate: false };
  });
