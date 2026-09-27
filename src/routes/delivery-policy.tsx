import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

const title = "Shipping & Delivery Policy — OXYTIVE";
const description = "How OXYTIVE orders are dispatched and delivered.";

export const Route = createFileRoute("/delivery-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/delivery-policy" },
    ],
    links: [{ rel: "canonical", href: "/delivery-policy" }],
  }),
  component: Page,
});

const sections = [
  { h: "Serviceable areas", p: "Delivery is confirmed area-by-area at the time of enquiry. We do not claim coverage beyond areas we can actually service." },
  { h: "Order confirmation", p: "Delivery timelines are confirmed after quantity, bottle size and delivery address are agreed." },
  { h: "Dispatch", p: "Sealed packs are prepared and dispatched against confirmed orders. Bulk and event orders are scheduled to your required date." },
  { h: "Delays", p: "If a delay is unavoidable, we inform you as early as possible and agree a revised schedule." },
  { h: "Receiving an order", p: "Please check seals and quantity at the time of delivery and report any issue immediately." },
];

function Page() {
  return <LegalPage title="Shipping & Delivery Policy" intro="How OXYTIVE orders are dispatched and delivered." sections={sections} />;
}
