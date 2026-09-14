import { MessageCircle, Phone } from "lucide-react";
import { site, whatsappLink, waMessages } from "@/config/site";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";

export function FloatingActions() {
  const { openEnquiry } = useEnquiry();

  return (
    <>
      {/* Floating WhatsApp — all breakpoints */}
      <a
        href={whatsappLink(waMessages.general)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with OXYTIVE on WhatsApp"
        onClick={() => track("whatsapp_click", { from: "floating" })}
        className="fixed right-4 bottom-20 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg transition-transform hover:scale-105 md:bottom-6"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Sticky mobile action bar */}
      <div className="surface-glass fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-border p-2 md:hidden">
        <Button asChild variant="outline" size="lg">
          <a href={`tel:${site.phoneRaw}`} onClick={() => track("phone_click", { from: "sticky_bar" })}>
            <Phone className="mr-1 h-4 w-4" /> Call Now
          </a>
        </Button>
        <Button size="lg" onClick={() => openEnquiry()}>
          Get a Quote
        </Button>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </>
  );
}
