type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  product: string | null;
  quantity: string | null;
  requirement_type: string | null;
  message: string | null;
  source: string | null;
  page: string | null;
  created_at: string;
};

export type NotifyStatus = "sent" | "failed" | "not_configured" | "pending";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

function whenIST(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

function whatsappText(l: Lead) {
  return [
    "🚨 NEW OXYTIVE ENQUIRY",
    "",
    `👤 Name: ${l.name}`,
    `📞 Phone: ${l.phone}`,
    `📧 Email: ${l.email ?? "-"}`,
    `📍 City: ${l.city ?? "-"}`,
    "",
    `📦 Product: ${l.product ?? "-"}`,
    `📊 Quantity: ${l.quantity ?? "-"}`,
    `📋 Requirement: ${l.requirement_type ?? "-"}`,
    "",
    "💬 Message:",
    l.message ?? "-",
    "",
    `🆔 Lead ID: ${l.id}`,
    "",
    "🕐 Submitted:",
    whenIST(l.created_at),
    "",
    "Please check the OXYTIVE Admin Panel.",
  ].join("\n");
}

async function sendWhatsApp(l: Lead): Promise<{ status: NotifyStatus; error?: string }> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const waKey = process.env["WHATSAPP_API_KEY"];
  const adminPhone = (process.env["WHATSAPP_ADMIN_PHONE"] ?? "").replace(/\D/g, "");
  if (!lovableKey || !waKey || !adminPhone) return { status: "not_configured" };
  try {
    const res = await fetch(`${GATEWAY_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": waKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminPhone,
        type: "text",
        text: { body: whatsappText(l) },
      }),
    });
    const body = await res.text();
    if (!res.ok) return { status: "failed", error: `WhatsApp ${res.status}: ${body.slice(0, 300)}` };
    return { status: "sent" };
  } catch (e) {
    return { status: "failed", error: `WhatsApp: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function sendEmail(l: Lead): Promise<{ status: NotifyStatus; error?: string }> {
  // Email sending activates once a sender domain is verified and the
  // new-lead email template is registered.
  try {
    const mod = (await import("./email-templates/send-email").catch(() => null)) as null | {
      sendTemplateEmail: (t: string, to: string, o: unknown) => Promise<{ sent: boolean; reason?: string }>;
    };
    if (!mod) return { status: "not_configured" };
    const r = await mod.sendTemplateEmail("new-lead-admin", "oxytivewaterindustries@gmail.com", {
      templateData: { ...l, submitted: whenIST(l.created_at) },
      idempotencyKey: `new-lead-${l.id}`,
    });
    return r.sent ? { status: "sent" } : { status: "failed", error: `Email: ${r.reason ?? "not sent"}` };
  } catch (e) {
    return { status: "failed", error: `Email: ${e instanceof Error ? e.message : String(e)}` };
  }
}

export async function notifyNewLead(l: Lead) {
  const [email, wa] = await Promise.all([sendEmail(l), sendWhatsApp(l)]);
  const errors = [email.error, wa.error].filter(Boolean) as string[];
  if (errors.length) console.error("Lead notification issues", l.id, errors);
  return { email: email.status, whatsapp: wa.status, errors };
}
