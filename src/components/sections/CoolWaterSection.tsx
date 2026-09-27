import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import coolWaterImage from "@/assets/cool-water-programs.png";

export function CoolWaterSection() {
  const { openEnquiry } = useEnquiry();

  return (
    <Section id="cool-water">
      <SectionHeading
        eyebrow="For Programs & Events"
        title="Cool Water for Every Program"
        subtitle="Need chilled packaged drinking water for weddings, functions, corporate programs, sports events or large gatherings? Tell us your requirement and we'll help plan the supply."
      />

      <Reveal className="mt-10">
        <div className="overflow-hidden rounded-3xl border border-brand/10 bg-brand-soft">
          <div className="grid lg:grid-cols-2">

            {/* Content */}
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-brand">
                OXYTIVE Event Water
              </p>

              <h3 className="mt-3 text-3xl sm:text-4xl">
                Keep Your Guests Refreshed
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Chilled OXYTIVE packaged drinking water for weddings,
                celebrations, school & college programs, corporate events,
                sports activities and other gatherings.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-background/70 p-4">
                  <p className="text-sm font-medium">Chilled Supply</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    As per requirement
                  </p>
                </div>

                <div className="rounded-xl bg-background/70 p-4">
                  <p className="text-sm font-medium">Custom Quantity</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Small to large programs
                  </p>
                </div>

                <div className="rounded-xl bg-background/70 p-4">
                  <p className="text-sm font-medium">On-Time Supply</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Planned for your event
                  </p>
                </div>

                <div className="rounded-xl bg-background/70 p-4">
                  <p className="text-sm font-medium">Multiple Events</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Weddings to sports
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="mt-7 w-full sm:w-fit"
                onClick={() =>
                  openEnquiry({
                    title: "Cool Water for Programs",
                    defaults: {
                      requirement_type: "Event Water",
                    },
                    fields: [
                      "name",
                      "phone",
                      "city",
                      "product",
                      "quantity",
                      "message",
                    ],
                  })
                }
              >
                Plan Water Supply
              </Button>
            </div>

            {/* Event image */}
            <div className="relative min-h-[360px] overflow-hidden lg:min-h-[520px]">
              <img
                src={coolWaterImage}
                alt="OXYTIVE chilled drinking water for weddings and events"
                className="absolute inset-0 h-full w-full object-cover object-[75%_50%]"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-brand-soft/20 via-transparent to-transparent" />

              <div className="absolute bottom-5 right-5 rounded-2xl bg-white/90 px-5 py-3 shadow-lg backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Chilled Water Available
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  For your special moments
                </p>
              </div>
            </div>

          </div>
        </div>
      </Reveal>
    </Section>
  );
}