import { MapPin } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";

const priorityAreas = [
  // Chhatrapati Sambhajinagar & nearby
  "Chhatrapati Sambhajinagar",
  "Phulambri",
  "Sillod",
  "Waluj",
  "Paithan",
  "Gangapur",
  "Vaijapur",
  "Kannad",

  // Marathwada
  "Jalna",
  "Beed",
  "Latur",
  "Nanded",
  "Parbhani",
  "Hingoli",
  "Dharashiv",

  // Major Maharashtra markets
  "Pune",
  "Pimpri-Chinchwad",
  "Nashik",
  "Ahilyanagar",
  "Solapur",
  "Jalgaon",
  "Kolhapur",
  "Nagpur",
  "Mumbai",
  "Thane",
];

export function ServiceArea() {
  const { openEnquiry } = useEnquiry();

  return (
    <Section id="areas" tone="soft">
      <SectionHeading
        eyebrow="Service Areas"
        title="Serving Retailers Across Maharashtra"
subtitle="Partner with OXYTIVE for reliable packaged drinking water supply. Availability and supply terms are confirmed area-by-area based on your requirement."      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Cities &amp; Areas
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {priorityAreas.map((area) => (
              <li
                key={area}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-sm text-brand-deep"
              >
                <MapPin className="h-3.5 w-3.5" />
                {area}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Delivery
              </dt>
              <dd className="mt-1 text-sm">
                Confirmed per area on enquiry
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Bulk Supply
              </dt>
              <dd className="mt-1 text-sm">
                Available against confirmed volumes
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal
          delay={100}
          className="flex flex-col justify-center rounded-2xl bg-brand p-6 text-brand-foreground sm:p-8"
        >
          <h3 className="text-2xl">Not sure if we reach you?</h3>

          <p className="mt-2 text-sm text-brand-foreground/80">
            Send your city and area — we&apos;ll confirm serviceability honestly,
            including if we can&apos;t yet.
          </p>

          <Button
            variant="secondary"
            size="lg"
            className="mt-6 self-start"
            onClick={() =>
              openEnquiry({
                title: "Check Availability in My Area",
                fields: [
                  "name",
                  "phone",
                  "city",
                  "area",
                  "requirement_type",
                ],
              })
            }
          >
            Check Availability in My Area
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}