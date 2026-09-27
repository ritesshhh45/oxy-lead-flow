import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Section } from "@/components/site/Section";
import { site } from "@/config/site";

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { h: string; p: string }[];
}) {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Policy" title={title} subtitle={intro} />
      <Section>
        <div className="max-w-3xl space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="text-xl">{s.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
            </div>
          ))}
          <div className="rounded-xl border border-dashed border-brand/40 bg-brand-soft p-5 text-sm">
            <p className="font-medium text-brand-deep">Editable placeholder</p>
            <p className="mt-1 text-muted-foreground">
              This policy is a starting template. Replace it with your reviewed legal wording before going
              live. Questions: {site.phone} / {site.phone2}.
            </p>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
