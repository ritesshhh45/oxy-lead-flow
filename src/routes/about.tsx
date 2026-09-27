import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HeaderActions } from "@/components/site/HeaderActions";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { CtaBand } from "@/components/sections/CtaBand";
import { site } from "@/config/site";
import { localBusinessSchema } from "@/lib/schema";

const title = "About OXYTIVE — A New Packaged Drinking Water Brand";
const description =
  "OXYTIVE is a new Indian packaged drinking water brand focused on clean packaging, dependable supply and straightforward business ordering.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessSchema) }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About us"
        title="A new brand, built to be judged on how it behaves."
        subtitle={`${site.brand} — ${site.tagline}`}
        actions={<HeaderActions label="Talk to Us" />}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Who we are"
            title="Packaged drinking water, done properly from day one."
          />
          <Reveal className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              OXYTIVE is a new packaged drinking water brand. We are not going to tell you we have been
              around for decades or that we are anybody's number one — we haven't been, and we aren't.
            </p>
            <p>
              What we can commit to is the part that is in our control today: a product that is prepared
              and sealed carefully, packaging that looks correct wherever it is served, and a supply
              conversation where quantities, timelines and serviceability are confirmed honestly before
              anything is promised.
            </p>
            <p>
              As our compliance documentation, laboratory reports and manufacturing details are verified,
              they will be published on the quality page — with numbers, not adjectives.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {[
            ["Positioning", "Premium • Pure • Modern • Reliable • Refreshing"],
            ["Category", site.category],
            ["Company", site.company],
          ].map(([k, v], i) => (
            <Reveal key={k} delay={i * 80} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{k}</p>
              <p className="mt-2">{v}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <ServiceArea />
      <CtaBand title="Want to work with a new brand that answers the phone?" />
    </SiteLayout>
  );
}
