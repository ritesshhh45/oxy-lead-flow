import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HeaderActions } from "@/components/site/HeaderActions";
import { ContactSection } from "@/components/sections/ContactSection";
import { Faq, faqSchema } from "@/components/sections/Faq";
import { localBusinessSchema } from "@/lib/schema";

const title = "Contact OXYTIVE — Packaged Drinking Water Enquiries";
const description =
  "Call, WhatsApp or email OXYTIVE for packaged drinking water enquiries: retail orders, bulk supply, event quotes, retail partnership and distribution.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(localBusinessSchema) },
      { type: "application/ld+json", children: JSON.stringify(faqSchema) },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Talk to OXYTIVE"
        subtitle="Tell us what you need and where it has to reach. We'll confirm what's possible and send pricing."
        actions={<HeaderActions label="Request a Callback" fields={["name", "phone", "city", "message"]} />}
      />
      <ContactSection />
      <Faq />
    </SiteLayout>
  );
}
