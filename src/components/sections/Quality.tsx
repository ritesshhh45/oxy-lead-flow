import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { site } from "@/config/site";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";

const steps = [
  { title: "Source / Water Input", body: "Incoming water is received and held for processing." },
  { title: "Treatment", body: "Pre-treatment stages prepare the water for purification." },
  { title: "Purification", body: "Purification removes impurities before filling." },
  { title: "Quality Checks", body: "Checks are carried out before the batch is released." },
  { title: "Hygienic Packaging", body: "Bottles are filled, capped and sealed in a controlled area." },
  { title: "Ready for Delivery", body: "Sealed packs are labelled and prepared for dispatch." },
];

const compliance = [
  { key: "bis", label: "BIS information" },
  { key: "fssai", label: "FSSAI information" },
  { key: "manufacturing", label: "Manufacturing details" },
  { key: "labReports", label: "Laboratory reports" },
] as const;

export function Quality() {
  const { openEnquiry } = useEnquiry();

  return (
    <Section id="quality">
      <SectionHeading
        eyebrow="Quality"
        title="Quality You Can Trust"
        subtitle="This is the shape of our process. Specific technical details, certificate numbers and reports will be published here once they are verified and in hand — we will not display anything we cannot back up."
      />

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            delay={i * 70}
            className="relative rounded-2xl border border-border bg-card p-6"
          >
            <span className="font-display text-3xl text-brand/30">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 text-lg">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mt-12 rounded-2xl border border-border bg-brand-soft p-6 sm:p-8">
        <h3 className="text-xl">Compliance & documentation</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {compliance.map((c) => {
            const value = site.compliance[c.key];
            return (
              <div key={c.key} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="mt-1.5 text-sm">
                  {value ? value : <span className="text-brand">Quality & Compliance Details Coming Soon</span>}
                </p>
              </div>
            );
          })}
        </div>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() =>
            openEnquiry({
              title: "Ask about quality & compliance",
              defaults: { requirement_type: "Other" },
              fields: ["name", "phone", "city", "message"],
            })
          }
        >
          Ask a Quality Question
        </Button>
      </Reveal>
    </Section>
  );
}
