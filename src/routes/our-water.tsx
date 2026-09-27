import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HeaderActions } from "@/components/site/HeaderActions";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { WhyOxytive } from "@/components/sections/WhyOxytive";
import { Quality } from "@/components/sections/Quality";
import { CtaBand } from "@/components/sections/CtaBand";
import detail from "@/assets/oxytive-detail.png.asset.json";

const title = "Our Water — What Goes Into Every OXYTIVE Bottle";
const description =
  "What OXYTIVE packaged drinking water is, how it is prepared and packed, and who it is made for — everyday hydration, business supply and events.";

export const Route = createFileRoute("/our-water")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/our-water" },
    ],
    links: [{ rel: "canonical", href: "/our-water" }],
  }),
  component: OurWaterPage,
});

const points = [
  {
    h: "A neutral, everyday drink",
    p: "OXYTIVE is packaged drinking water — no flavour, no additives promised beyond what the label states. It is meant to be the water you don't think twice about.",
  },
  {
    h: "Sealed at the source of packing",
    p: "Bottles are filled, capped and sealed in one continuous handling flow so what leaves the line is what reaches the customer.",
  },
  {
    h: "Presentation that carries weight",
    p: "The purple label was designed to look correct on a hotel table, a conference desk and a wedding counter — packaging is part of the service you are buying.",
  },
];

function OurWaterPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our water"
        title="What goes into every OXYTIVE bottle."
        subtitle="A clear look at the product, the packaging and the thinking behind it."
        actions={<HeaderActions />}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="min-w-0">
            <img
              src={detail.url}
              alt="OXYTIVE bottle detail views — cap, label, bottle profile and base"
              loading="lazy"
              className="w-full rounded-3xl border border-border object-cover"
            />
          </Reveal>
          <div className="min-w-0">
            <SectionHeading
              eyebrow="The product"
              title="Considered down to the cap."
              subtitle="Every visible element of the pack — cap, label, ribbing and base — is part of how the water is judged before it is tasted."
            />
            <div className="mt-8 space-y-6">
              {points.map((pt, i) => (
                <Reveal key={pt.h} delay={i * 80}>
                  <h3 className="text-lg">{pt.h}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pt.p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <WhyOxytive />
      <Quality />
      <CtaBand title="Want OXYTIVE for your home, business or event?" />
    </SiteLayout>
  );
}
