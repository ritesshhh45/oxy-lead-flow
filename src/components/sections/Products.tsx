import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { useContent } from "@/lib/cms";
import { track } from "@/lib/analytics";

import bottle200 from "@/assets/oxytive-200ml.png";
import bottle500 from "@/assets/oxytive-500ml.png";
import bottle1L from "@/assets/oxytive-1l.png";
import bottle5L from "@/assets/oxytive-5l.png";

type ProductsContent = {
  title: string;
  subtitle: string;
};

const localProducts = [
  {
    id: "local-200ml",
    name: "OXYTIVE 200 ML",
    size: "200 ML",
    description:
      "Compact single-serve packaged drinking water, ideal for quick refreshment and events.",
    ideal_for: ["Retail", "Events", "Travel", "Cafes"],
    price: null,
    image: bottle200,
    image_alt: "OXYTIVE 200 ML packaged drinking water bottle",
    is_featured: false,
  },
  {
    id: "local-500ml",
    name: "OXYTIVE 500 ML",
    size: "500 ML",
    description:
      "The everyday grab-and-go bottle. Single-serve, sealed and sized for movement.",
    ideal_for: ["Retail", "Travel", "Events", "Restaurants"],
    price: null,
    image: bottle500,
    image_alt: "OXYTIVE 500 ML packaged drinking water bottle",
    is_featured: true,
  },
  {
    id: "local-1l",
    name: "OXYTIVE 1 L",
    size: "1 L",
    description:
      "A full-size bottle for tables, longer journeys and shared settings.",
    ideal_for: ["Households", "Hotels & restaurants", "Offices", "Travel"],
    price: null,
    image: bottle1L,
    image_alt: "OXYTIVE 1 L packaged drinking water bottle",
    is_featured: false,
  },
  {
    id: "local-5l",
    name: "OXYTIVE 5 L",
    size: "5 L",
    description:
      "A larger pack for homes, offices, gatherings and higher-volume hydration needs.",
    ideal_for: ["Homes", "Offices", "Events", "Bulk use"],
    price: null,
    image: bottle5L,
    image_alt: "OXYTIVE 5 L packaged drinking water bottle",
    is_featured: false,
  },
];

export function Products() {
  const { openEnquiry } = useEnquiry();

  const copy = useContent<ProductsContent & Record<string, unknown>>(
    "products_section",
  );

  useEffect(() => {
    track("product_view", { list: "product_grid" });
  }, []);

  return (
    <Section id="explore">
      <SectionHeading
        eyebrow="Products"
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {localProducts.map((p, i) => (
          <Reveal
            key={p.id}
            delay={i * 90}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-brand-soft">
              <img
                src={p.image}
                alt={p.image_alt}
                loading="lazy"
                className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
              />

              <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs text-brand-foreground">
                {p.size}
              </span>

              {p.is_featured && (
                <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs text-brand">
                  Featured
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl">{p.name}</h3>

              {p.price && (
                <p className="mt-1 text-sm font-medium text-brand">
                  {p.price}
                </p>
              )}

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>

              <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                Suitable for
              </p>

              <ul className="mt-2 flex flex-wrap gap-1.5">
                {p.ideal_for.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-brand-soft px-2.5 py-1 text-xs text-brand-deep"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-6 w-full"
                variant="outline"
                onClick={() => {
                  track("product_click", { product: p.name });

                  openEnquiry({
                    title: `Enquire — ${p.name}`,
                    defaults: {
                      product: `${p.name} (${p.size})`,
                      bottle_size: p.size,
                      requirement_type: "Bulk Order",
                    },
                    fields: [
                      "name",
                      "phone",
                      "city",
                      "product",
                      "quantity",
                      "requirement_type",
                      "message",
                    ],
                  });
                }}
              >
                Enquire Now
              </Button>
            </div>
          </Reveal>
        ))}

        <Reveal
          delay={360}
          className="flex flex-col justify-between rounded-2xl border border-dashed border-brand/40 bg-brand-soft/60 p-6"
        >
          <div>
            <h3 className="text-xl">Need a different pack?</h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tell us the size and volume you need and we will confirm what is
              currently possible.
            </p>
          </div>

          <Button
            className="mt-6"
            onClick={() =>
              openEnquiry({
                title: "Tell us the pack you need",
                defaults: { requirement_type: "Other" },
              })
            }
          >
            Ask About a Pack
          </Button>
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <Button
          size="lg"
          onClick={() => {
            track("quote_click", { from: "products" });

            openEnquiry({
              title: "Request Bulk Pricing",
              defaults: { requirement_type: "Bulk Order" },
              eventName: "bulk_order_request",
              fields: [
                "name",
                "phone",
                "city",
                "product",
                "quantity",
                "message",
              ],
            });
          }}
        >
          Request Bulk Pricing
        </Button>
      </Reveal>
    </Section>
  );
}