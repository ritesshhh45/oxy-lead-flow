import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { cn } from "@/lib/utils";

const choices = [
  { label: "Personal / Retail", requirement: "Personal Order" },
  { label: "Bulk Order", requirement: "Bulk Order" },
  { label: "Events", requirement: "Event Order" },
  { label: "Hotels & Restaurants", requirement: "Bulk Order" },
  { label: "Corporate", requirement: "Corporate Order" },
  { label: "Distributor", requirement: "Distribution" },
];

export function QuickLeadBar() {
  const { openEnquiry } = useEnquiry();
  const [selected, setSelected] = useState(choices[1]!.label);

  const active = choices.find((c) => c.label === selected)!;

  return (
    <section className="border-y border-border bg-card px-4 py-8 sm:px-6">
      <Reveal className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl">Looking for packaged drinking water?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose what you need.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {choices.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => setSelected(c.label)}
              aria-pressed={selected === c.label}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                selected === c.label
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-background hover:border-brand/50 hover:text-brand",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <Button
          size="lg"
          className="w-full lg:w-auto"
          onClick={() =>
            openEnquiry({
              title: "Let's Get Your Requirement Sorted.",
              description: `Requirement: ${active.label}`,
              defaults: { requirement_type: active.requirement },
            })
          }
        >
          Get My Quote
        </Button>
      </Reveal>
    </section>
  );
}
