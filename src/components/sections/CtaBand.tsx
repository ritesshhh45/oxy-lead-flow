import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { site, whatsappLink, waMessages } from "@/config/site";
import { track } from "@/lib/analytics";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";

export function CtaBand({
  title = "Ready to place an order?",
  subtitle = "Get pricing for your requirement — retail, bulk, events or partnership.",
  waMessage = waMessages.general,
}: {
  title?: string;
  subtitle?: string;
  waMessage?: string;
}) {
  const { openEnquiry } = useEnquiry();

  return (
    <section className="px-4 py-14 sm:px-6">
      <Reveal className="brand-wash mx-auto grid max-w-7xl gap-6 rounded-3xl border border-border p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl">{title}</h2>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="lg" onClick={() => openEnquiry()}>
            Get a Quote
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { from: "cta_band" })}
            >
              <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp Us
            </a>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <a href={`tel:${site.phoneRaw}`} onClick={() => track("phone_click", { from: "cta_band" })}>
              <Phone className="mr-1 h-4 w-4" /> Call Now
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
