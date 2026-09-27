import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HeaderActions } from "@/components/site/HeaderActions";
import { DistributorSection } from "@/components/sections/DistributorSection";
import { WhyOxytive } from "@/components/sections/WhyOxytive";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { CtaBand } from "@/components/sections/CtaBand";
import { waMessages } from "@/config/site";

const title = "Become a Water Distributor or Retail Partner — OXYTIVE";
const description =
  "Stock or distribute OXYTIVE packaged drinking water in your area. Share your business details and expected monthly requirement to start the conversation.";

export const Route = createFileRoute("/distributors")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/distributors" },
    ],
    links: [{ rel: "canonical", href: "/distributors" }],
  }),
  component: DistributorsPage,
});

function DistributorsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Partnership"
        title="Partner With OXYTIVE"
        subtitle="Interested in stocking or distributing OXYTIVE in your area? Let's talk. Terms are agreed directly with you — we don't advertise margins or exclusivity we haven't discussed."
        actions={
          <HeaderActions
            label="Become a Distributor"
            waMessage={waMessages.distributor}
            defaults={{ requirement_type: "Distribution" }}
            fields={["name", "business_name", "phone", "city", "area", "business_type", "quantity"]}
          />
        }
      />
      <DistributorSection />
      <WhyOxytive />
      <ServiceArea />
      <CtaBand
        title="Want to discuss a partnership?"
        subtitle="Send your business details and we'll set up a call."
        waMessage={waMessages.distributor}
      />
    </SiteLayout>
  );
}
