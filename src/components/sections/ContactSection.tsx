import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/LeadForm";
import { waMessages } from "@/config/site";
import { useContact, useServiceAreas, telHref, waHref } from "@/lib/cms";
import { track } from "@/lib/analytics";

export function ContactSection() {
  const contact = useContact();
  const { data: areas } = useServiceAreas();
  const wa = waHref(contact.whatsapp, waMessages.general);

  return (
    <Section id="contact">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading
            eyebrow="Contact"
            title="Talk to OXYTIVE"
            subtitle="Call, message or send your requirement. We reply during business hours."
          />
          <Reveal className="mt-8 space-y-4">
            <a
              href={telHref(contact.phone1)}
              onClick={() => track("phone_click", { from: "contact" })}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-brand/50"
            >
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">Phone</span>
                <span className="block truncate">
                  {contact.phone1}
                  {contact.phone2 ? ` / ${contact.phone2}` : ""}
                </span>
              </span>
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { from: "contact" })}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-brand/50"
            >
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">WhatsApp</span>
                <span className="block truncate">Chat with our team</span>
              </span>
            </a>
            {contact.show_email && contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-brand/50"
              >
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="min-w-0">
                  <span className="block text-sm text-muted-foreground">Email</span>
                  <span className="block truncate">{contact.email}</span>
                </span>
              </a>
            )}
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">Address</span>
                <span className="block">
                  {contact.address_line1}
                  {contact.address_line2 ? `, ${contact.address_line2}` : ""}
                </span>
              </span>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">Business hours</span>
                <span className="block">{contact.hours}</span>
              </span>
            </div>
            {areas && areas.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Service areas: {areas.map((a) => a.name).join(" • ")}
              </p>
            )}
            <Button asChild size="lg">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { from: "contact_cta" })}
              >
                Talk to OXYTIVE
              </a>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={100} className="min-w-0 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-xl">Send your requirement</h3>
          <LeadForm
            className="mt-6"
            fields={["name", "phone", "email", "city", "requirement_type", "product", "quantity", "message"]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
