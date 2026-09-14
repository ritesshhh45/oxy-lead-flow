import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/site/Section";
import { site } from "@/config/site";
import { useFaqs } from "@/lib/cms";

/** Static fallback answers, also used for the JSON-LD schema. */
export const faqs = [
  {
    q: "Is OXYTIVE packaged drinking water?",
    a: "Yes. OXYTIVE is a packaged drinking water brand by Vedarth Water Industry. Water is treated, purified, checked and sealed in bottles before dispatch.",
  },
  {
    q: "Which bottle sizes are available?",
    a: "The live pack list is shown in the Products section of this website. If you need a pack you don't see listed, send us an enquiry and we'll tell you what is possible.",
  },
  {
    q: "Can I order water in bulk?",
    a: "Yes. Bulk orders are quoted against your volume, bottle size and delivery location. Share your requirement and we will send pricing.",
  },
  {
    q: "Do you supply water for events?",
    a: "Yes. Weddings, corporate events, conferences, sports and college events, parties and catering requirements can all be quoted. Share your date, guest count and city.",
  },
  {
    q: "Do you supply hotels and restaurants?",
    a: "Yes. Hotels, restaurants, cafes, caterers and other hospitality businesses can order on a recurring basis. We confirm quantity and delivery schedule with you before starting supply.",
  },
  {
    q: "How can I become an OXYTIVE distributor or retail partner?",
    a: "Fill the partnership form with your city, area and expected monthly requirement. Commercial terms are agreed case by case after a conversation.",
  },
  {
    q: "Which areas do you deliver to?",
    a: `We are building supply across ${site.serviceAreaLabel}. Delivery is confirmed area-by-area, so please send your city and area and we will confirm serviceability.`,
  },
  {
    q: "How can I request a quotation?",
    a: "Use any 'Get a Quote' button on this website, message us on WhatsApp, or call us. Quotes need your bottle size, quantity and delivery location.",
  },
  {
    q: "How can I contact OXYTIVE?",
    a: `You can call ${site.phone} or ${site.phone2}, or message us on WhatsApp. Business hours are ${site.hours}.`,
  },
];

export function Faq() {
  const { data } = useFaqs();
  const list =
    data && data.length ? data.map((f) => ({ q: f.question, a: f.answer })) : faqs;

  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions people ask before ordering"
        subtitle="Straight answers about sizes, bulk supply, events, partnerships and delivery."
      />
      <div className="mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {list.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
