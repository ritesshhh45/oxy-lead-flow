import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HeaderActions } from "@/components/site/HeaderActions";
import { Products } from "@/components/sections/Products";
import { Feature500 } from "@/components/sections/Feature500";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { productSchema } from "@/lib/schema";

const title = "OXYTIVE Products — 500 ml & 1 L Packaged Drinking Water Bottles";
const description =
  "See OXYTIVE bottle sizes: 500 ml and 1 L packaged drinking water. Compare what each pack suits and request bulk pricing for your business or event.";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(productSchema) }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Products"
        title="Water bottles sized for how they're actually used."
        subtitle="OXYTIVE is available today in 500 ml and 1 L. Each pack is sealed and labelled for clean handling — at a counter, on a table or across a venue."
        actions={<HeaderActions label="Request Bulk Pricing" defaults={{ requirement_type: "Bulk Order" }} />}
      />
      <Products />
      <Feature500 />
      <CtaBand title="Need pricing for a specific quantity?" />
      <Faq />
    </SiteLayout>
  );
}
