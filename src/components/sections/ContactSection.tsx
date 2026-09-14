import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/LeadForm";
import { site, waMessages, whatsappLink } from "@/config/site";
import { track } from "@/lib/analytics";

const serviceAreas = [
  "Chhatrapati Sambhajinagar",
  "Phulambri",
  "Sillod",
  "Waluj",
  "Paithan",
  "Gangapur",
  "Vaijapur",
  "Kannad",
  "Jalna",
  "Beed",
  "Latur",
  "Nanded",
  "Parbhani",
  "Hingoli",
  "Dharashiv",
  "Pune",
  "Pimpri-Chinchwad",
  "Nashik",
  "Ahilyanagar",
  "Solapur",
  "Jalgaon",
  "Kolhapur",
  "Nagpur",
  "Mumbai",
  "Thane",
];

export function ContactSection() {
  const phone1 = site.phone;
  const phone2 = site.phone2;

  const whatsapp = whatsappLink(waMessages.general, site.whatsapp);

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
            {/* Phone */}
            <a
              href={`tel:${site.phoneRaw}`}
              onClick={() => track("phone_click", { from: "contact" })}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-brand/50"
            >
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />

              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">
                  Phone
                </span>

                <span className="block">
                  {phone1} / {phone2}
                </span>
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("whatsapp_click", { from: "contact" })
              }
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-brand/50"
            >
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand" />

              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">
                  WhatsApp
                </span>

                <span className="block">
                  Chat with our team
                </span>
              </span>
            </a>

            {/* Email */}
            {site.showEmail && site.email && (
              <a
                href={`mailto:${site.email}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-brand/50"
              >
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" />

                <span className="min-w-0">
                  <span className="block text-sm text-muted-foreground">
                    Email
                  </span>

                  <span className="block break-all">
                    {site.email}
                  </span>
                </span>
              </a>
            )}

            {/* Address */}
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />

              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">
                  Address
                </span>

                <span className="block">
                  {site.address.line1},{" "}
                  {site.address.line2},{" "}
                  {site.address.city},{" "}
                  {site.address.state}
                </span>
              </span>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />

              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">
                  Business hours
                </span>

                <span className="block">
                  {site.hours}
                </span>
              </span>
            </div>

            {/* Service Areas */}
            <p className="text-xs leading-5 text-muted-foreground">
              Service areas:{" "}
              {serviceAreas.join(" • ")}
            </p>

            {/* WhatsApp CTA */}
            <Button asChild size="lg">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("whatsapp_click", {
                    from: "contact_cta",
                  })
                }
              >
                Talk to OXYTIVE
              </a>
            </Button>
          </Reveal>
        </div>

        {/* Enquiry Form */}
        <Reveal
          delay={100}
          className="min-w-0 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <h3 className="text-xl">
            Send your requirement
          </h3>

          <LeadForm
            className="mt-6"
            fields={[
              "name",
              "phone",
              "email",
              "city",
              "requirement_type",
              "product",
              "quantity",
              "message",
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}