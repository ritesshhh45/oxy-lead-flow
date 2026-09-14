import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HeaderActions } from "@/components/site/HeaderActions";
import { BulkSection } from "@/components/sections/BulkSection";
import { Products } from "@/components/sections/Products";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { CtaBand } from "@/components/sections/CtaBand";
import { ContactSection } from "@/components/sections/ContactSection";
import { waMessages } from "@/config/site";
import { localBusinessSchema } from "@/lib/schema";

const title = "Bulk Drinking Water Supplier for Business — OXYTIVE";
const description =
  "Bulk packaged drinking water for hotels, restaurants, cafes, offices, gyms, caterers and institutions. Choose your volume and get custom pricing from OXYTIVE.";

export const Route = createFileRoute("/bulk-orders")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/bulk-orders" },
    ],
    links: [{ rel: "canonical", href: "/bulk-orders" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessSchema) }],
  }),
  component: BulkPage,
});

function BulkPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="For business"
        title="Bulk drinking water supply, planned around your reorder cycle."
        subtitle="Hotels, restaurants, cafes, corporate offices, caterers, retailers, gyms and institutions order OXYTIVE by the case. Tell us the volume and we'll quote it."
        actions={
          <HeaderActions
            label="Request Bulk Quote"
            waMessage={waMessages.bulk}
            defaults={{ requirement_type: "Bulk Order" }}
          />
        }
      />
      <BulkSection />
      <Products />
      <ServiceArea />
      <CtaBand title="Get bulk pricing today" waMessage={waMessages.bulk} />
      <ContactSection />
    </SiteLayout>
  );
}
