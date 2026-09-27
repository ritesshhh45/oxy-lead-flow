import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/sections/Hero";
import { Products } from "@/components/sections/Products";
import { WhyOxytive } from "@/components/sections/WhyOxytive";
import { Quality } from "@/components/sections/Quality";
import { BulkSection } from "@/components/sections/BulkSection";
import { BusinessSection } from "@/components/sections/BusinessSection";
import { DistributorSection } from "@/components/sections/DistributorSection";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { Faq, faqSchema } from "@/components/sections/Faq";
import { ContactSection } from "@/components/sections/ContactSection";
import { CoolWaterSection } from "@/components/sections/CoolWaterSection";
import { localBusinessSchema, productSchema } from "@/lib/schema";

const title =
  "OXYTIVE — Premium Packaged Drinking Water | Bulk, Events & Distribution";

const description =
  "OXYTIVE packaged drinking water bottles by Vedarth Water Industry. Order for home, retail, hotels, restaurants, offices and events, or partner with us as a distributor.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],

    links: [
      { rel: "canonical", href: "/" },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
    ],

    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessSchema),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(productSchema),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(faqSchema),
      },
    ],
  }),

  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />

      <Products />

      <WhyOxytive />

      <CoolWaterSection />

      <BusinessSection />

      <BulkSection />

      <DistributorSection />

      <Quality />

      <ServiceArea />

      <Faq />

      <ContactSection />
    </SiteLayout>
  );
}