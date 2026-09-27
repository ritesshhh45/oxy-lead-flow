import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

const title = "Refund & Cancellation Policy — OXYTIVE";
const description = "How cancellations and refunds are handled for OXYTIVE orders.";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: Page,
});

const sections = [
  { h: "Cancellations", p: "Orders can be cancelled before dispatch. For event and bulk orders, please tell us as early as possible so scheduled stock can be released." },
  { h: "Damaged or defective packs", p: "If any pack is received damaged or with a broken seal, report it at the time of delivery with photographs and we will arrange a replacement." },
  { h: "Refunds", p: "Where a refund is agreed, it is processed to the original payment method after verification." },
  { h: "Non-returnable cases", p: "Opened or consumed stock cannot be returned for hygiene and safety reasons." },
  { h: "Raising a request", p: "Contact our team with your order details to start a cancellation or refund request." },
];

function Page() {
  return <LegalPage title="Refund & Cancellation Policy" intro="How cancellations and refunds are handled for OXYTIVE orders." sections={sections} />;
}
