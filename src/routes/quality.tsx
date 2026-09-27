import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HeaderActions } from "@/components/site/HeaderActions";
import { Quality } from "@/components/sections/Quality";
import { WhyOxytive } from "@/components/sections/WhyOxytive";
import { CtaBand } from "@/components/sections/CtaBand";

const title = "Quality & Process — OXYTIVE Packaged Drinking Water";
const description =
  "How OXYTIVE packaged drinking water is treated, purified, checked and sealed — plus where our compliance and laboratory documentation will be published.";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/quality" },
    ],
    links: [{ rel: "canonical", href: "/quality" }],
  }),
  component: QualityPage,
});

function QualityPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Quality"
        title="Trust built on what we can actually show you."
        subtitle="We publish our process openly and leave certification details blank until the verified documents are in hand."
        actions={<HeaderActions label="Ask a Quality Question" fields={["name", "phone", "city", "message"]} />}
      />
      <Quality />
      <WhyOxytive />
      <CtaBand title="Have a compliance requirement for your business?" />
    </SiteLayout>
  );
}
