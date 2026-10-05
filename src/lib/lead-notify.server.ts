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

async function sendEmail(_l: Lead): Promise<{ status: NotifyStatus; error?: string }> {
  // Activates once a verified sender domain is set up for OXYTIVE.
  // Until then the lead is saved and marked "not_configured" (never faked as sent).
  return { status: "not_configured" };
}

export async function notifyNewLead(l: Lead) {
  const [email, wa] = await Promise.all([sendEmail(l), sendWhatsApp(l)]);
  const errors = [email.error, wa.error].filter(Boolean) as string[];
  if (errors.length) console.error("Lead notification issues", l.id, errors);
  return { email: email.status, whatsapp: wa.status, errors };
}
