import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

const title = "Privacy Policy — OXYTIVE";
const description = "How OXYTIVE handles the information you share through this website.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Page,
});

const sections = [
  { h: "What we collect", p: "When you submit an enquiry we collect the details you enter: name, mobile number, and optionally email, city, area, requirement type, quantity and message." },
  { h: "Why we collect it", p: "We use these details only to respond to your enquiry, prepare a quotation and arrange supply. We do not sell your information." },
  { h: "Storage", p: "Enquiries are stored securely in our lead database and are accessible only to authorised team members." },
  { h: "Analytics", p: "This website may use analytics and advertising measurement tools to understand traffic and campaign performance." },
  { h: "Your choices", p: "You can ask us to update or delete your enquiry details at any time by contacting us." },
];

function Page() {
  return <LegalPage title="Privacy Policy" intro="How OXYTIVE handles the information you share through this website." sections={sections} />;
}
