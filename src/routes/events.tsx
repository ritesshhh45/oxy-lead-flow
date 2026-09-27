import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HeaderActions } from "@/components/site/HeaderActions";
import { EventSection } from "@/components/sections/EventSection";
import { Feature500 } from "@/components/sections/Feature500";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { CtaBand } from "@/components/sections/CtaBand";
import { waMessages } from "@/config/site";

const title = "Water Bottles for Events & Weddings — OXYTIVE";
const description =
  "Packaged drinking water for weddings, corporate events, conferences, sports days and parties. Share your date and guest count for an OXYTIVE event quote.";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Events"
        title="Make Every Event Refreshing."
        subtitle="Weddings, conferences, sports days, college fests, catering and promotional events — quoted against your guest count and venue."
        actions={
          <HeaderActions
            label="Plan My Event Order"
            waMessage={waMessages.event}
            defaults={{ requirement_type: "Event Order" }}
            fields={["name", "phone", "event_type", "event_date", "expected_guests", "quantity", "city"]}
          />
        }
      />
      <EventSection />
      <Feature500 />
      <ServiceArea />
      <CtaBand title="Event coming up?" waMessage={waMessages.event} />
    </SiteLayout>
  );
}
