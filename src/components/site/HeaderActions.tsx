import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { whatsappLink, waMessages } from "@/config/site";
import { track } from "@/lib/analytics";
import type { LeadFormField } from "@/components/forms/LeadForm";

export function HeaderActions({
  label = "Get a Quote",
  waMessage = waMessages.general,
  defaults,
  fields,
  title,
}: {
  label?: string;
  waMessage?: string;
  defaults?: Record<string, string>;
  fields?: LeadFormField[];
  title?: string;
}) {
  const { openEnquiry } = useEnquiry();
  return (
    <>
      <Button
        size="lg"
        onClick={() =>
          openEnquiry({
            ...(defaults ? { defaults } : {}),
            ...(fields ? { fields } : {}),
            ...(title ? { title } : {}),
          })
        }
      >

        {label}
      </Button>
      <Button size="lg" variant="outline" asChild>
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { from: "page_header" })}
        >
          <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp Us
        </a>
      </Button>
    </>
  );
}
