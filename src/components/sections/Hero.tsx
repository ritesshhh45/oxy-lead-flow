import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { useContent } from "@/lib/cms";
import { track } from "@/lib/analytics";
import premiumHero from "@/assets/oxytive-premium-hero.png";

type HeroContent = {
  brand_line: string;
  cta: string;
};

export function Hero() {
  const { openEnquiry } = useEnquiry();

  const hero = useContent<HeroContent & Record<string, unknown>>("hero");

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#07111c] text-white">

      {/* FULL SCREEN IMAGE — NO CROP */}
      <div className="absolute inset-0 overflow-hidden bg-[#07111c]">
  <img
    src={premiumHero}
    alt="OXYTIVE premium packaged drinking water bottles"
    className="absolute inset-0 h-full w-full object-cover object-[50%_72%]"
    loading="eager"
    fetchPriority="high"
  />

  {/* Soft dark overlay for website text */}
  <div className="absolute inset-0 bg-black/10" />

  {/* Text readability only on left */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />

  {/* Slight bottom cinematic shade */}
  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
</div>

      {/* WEBSITE TEXT — SEPARATE FROM IMAGE */}
      <div className="relative z-10 flex min-h-[100svh] items-start justify-center px-5 pt-32 sm:px-8 sm:pt-36 lg:justify-start lg:px-16 lg:pt-40">

        <Reveal className="max-w-xl text-center lg:text-left">

          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-white/80 sm:text-xs">
            {hero.brand_line || "OXYTIVE by Vedarth Water Industry"}
          </p>

          <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl">
            Pure Water.
            <br />
            <span className="text-white/75">
              Powerful Impression.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-white/75 lg:mx-0">
            Premium packaged drinking water for hotels, restaurants,
            businesses, celebrations and everyday hydration.
          </p>

          <div className="mt-7 flex justify-center lg:justify-start">

            <Button
              size="lg"
              className="rounded-full bg-white px-8 text-black shadow-xl hover:bg-white/90"
              onClick={() => {
                track("quote_click", { from: "hero" });
                openEnquiry();
              }}
            >
              {hero.cta || "Get a Quote"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </div>

        </Reveal>
      </div>

      {/* Bottom brand information */}
      <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between border-t border-white/20 pt-3 text-[8px] uppercase tracking-[0.25em] text-white/60 sm:left-8 sm:right-8 lg:left-16 lg:right-16">
        <span>Premium Packaged Drinking Water</span>

        <span className="hidden sm:block">
          Vedarth Water Industry
        </span>
      </div>

    </section>
  );
}