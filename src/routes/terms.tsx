import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

const title = "Terms & Conditions — OXYTIVE";
const description = "The basis on which this website and OXYTIVE enquiries are provided.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Page,
});

const sections = [
  { h: "Use of this website", p: "Content on this website is provided for information about OXYTIVE packaged drinking water and to allow you to submit enquiries." },
  { h: "Quotations", p: "Prices, quantities and availability shared in response to an enquiry are confirmed in writing and may change until an order is accepted." },
  { h: "Product information", p: "Bottle sizes and product details reflect what is currently available. Compliance and certification details are published only once verified." },
  { h: "Partnerships", p: "Distribution and retail partnership terms are agreed individually. Nothing on this website constitutes a guarantee of margins, volumes or exclusivity." },
  { h: "Contact", p: "For any question about these terms, contact our team using the details on the contact page." },
];

function Page() {
  return <LegalPage title="Terms & Conditions" intro="The basis on which this website and OXYTIVE enquiries are provided." sections={sections} />;
}
