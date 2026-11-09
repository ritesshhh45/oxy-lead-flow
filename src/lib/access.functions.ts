import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OWNER_EMAIL = "oxytive.admin@gmail.com";

/**
 * A signed-in, NON-admin person asks for admin access.
 * 1. The request is saved (status "pending") and shows in Admin → Access.
 * 2. The owner is alerted by email (if RESEND_API_KEY is set) and WhatsApp
 *    (if the WhatsApp connector is set). Saving never depends on alerts.
 */
export const requestAdminAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = String((context.claims as Record<string, unknown>)["email"] ?? "")
      .trim()
      .toLowerCase();
    if (!email) throw new Error("Your account has no email address.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("access_requests")
      .select("id,status")
      .ilike("email", email)
      .maybeSingle();

    if (existing?.status === "pending") return { status: "pending" as const, already: true };

    if (existing) {
      await supabaseAdmin
        .from("access_requests")
        .update({ status: "pending", decided_at: null, user_id: context.userId } as never)
        .eq("id", existing.id);
    } else {
      const { error } = await supabaseAdmin
        .from("access_requests")
        .insert({ user_id: context.userId, email } as never);
      if (error) throw new Error("Could not save your request. Please try again.");
    }

    const origin = process.env["SITE_URL"] || "https://www.oxytive.in";
    const text = `OXYTIVE admin access request\n\n${email} is asking for admin access.\nApprove or reject: ${origin}/admin  →  Access tab.`;
    await Promise.allSettled([sendEmail(text), sendWhatsApp(text)]);

    return { status: "pending" as const, already: false };
  });

async function sendEmail(text: string) {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return;
  const to = process.env["ADMIN_NOTIFY_EMAIL"] || OWNER_EMAIL;
  const from = process.env["MAIL_FROM"] || "OXYTIVE <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: "OXYTIVE: new admin access request", text }),
  });
  if (!res.ok) console.error("Access request email failed", res.status, (await res.text()).slice(0, 200));
}

async function sendWhatsApp(text: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const waKey = process.env["WHATSAPP_API_KEY"];
  const phone = (process.env["WHATSAPP_ADMIN_PHONE"] ?? "").replace(/\D/g, "");
  if (!lovableKey || !waKey || !phone) return;
  const res = await fetch("https://connector-gateway.lovable.dev/whatsapp/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": waKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", to: phone, type: "text", text: { body: text } }),
  });
  if (!res.ok) console.error("Access request WhatsApp failed", res.status);
}
