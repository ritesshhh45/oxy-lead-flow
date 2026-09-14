import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { useContent, useProducts, mediaUrl } from "@/lib/cms";
import { track } from "@/lib/analytics";
import bottleFallback from "@/assets/oxytive-1l.png.asset.json";

type ProductsContent = { title: string; subtitle: string };

export function Products() {
  const { openEnquiry } = useEnquiry();
  const copy = useContent<ProductsContent & Record<string, unknown>>("products_section");
  const { data: products, isLoading } = useProducts();

  useEffect(() => {
    track("product_view", { list: "product_grid" });
  }, []);

  return (
    <Section id="explore">
      <SectionHeading eyebrow="Products" title={copy.title} subtitle={copy.subtitle} />

      {isLoading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(products ?? []).map((p, i) => {
            const img = mediaUrl(p.image_url) ?? bottleFallback.url;
            return (
              <Reveal
                key={p.id}
                delay={i * 90}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-brand-soft">
                  <img
                    src={img}
                    alt={p.image_alt || `OXYTIVE ${p.name} packaged drinking water bottle`}
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {p.size && (
                    <span className="absolute top-3 left-3 rounded-full bg-brand px-3 py-1 text-xs text-brand-foreground">
                      {p.size}
                    </span>
                  )}
                  {p.is_featured && (
                    <span className="absolute top-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs text-brand">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl">{p.name}</h3>
                  {p.price && <p className="mt-1 text-sm font-medium text-brand">{p.price}</p>}
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                  {p.ideal_for?.length > 0 && (
                    <>
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
                    </>
                  )}
                  <Button
                    className="mt-6 w-full"
                    variant="outline"
                    onClick={() => {
                      track("product_click", { product: p.name });
                      openEnquiry({
                        title: `Enquire — ${p.name}`,
                        defaults: {
                          product: p.size ? `${p.name} (${p.size})` : p.name,
                          bottle_size: p.size,
                          requirement_type: "Bulk Order",
                        },
                        fields: ["name", "phone", "city", "product", "quantity", "requirement_type", "message"],
                      });
                    }}
                  >
                    Enquire Now
                  </Button>
                </div>
              </Reveal>
            );
          })}

          <Reveal
            delay={180}
            className="flex flex-col justify-between rounded-2xl border border-dashed border-brand/40 bg-brand-soft/60 p-6"
          >
            <div>
              <h3 className="text-xl">Need a different pack?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Tell us the size and volume you need and we will confirm what is currently possible — we
                won't promise what we can't supply.
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
      )}

      <Reveal className="mt-10">
        <Button
          size="lg"
          onClick={() => {
            track("quote_click", { from: "products" });
            openEnquiry({
              title: "Request Bulk Pricing",
              defaults: { requirement_type: "Bulk Order" },
              eventName: "bulk_order_request",
              fields: ["name", "phone", "city", "product", "quantity", "message"],
            });
          }}
        >
          Request Bulk Pricing
        </Button>
      </Reveal>
    </Section>
  );
}
