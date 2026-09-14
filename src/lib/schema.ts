import { site } from "@/config/site";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.brand,
  description: site.shortDescription,
  telephone: site.phoneRaw,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.pincode,
    addressCountry: "IN",
  },
  areaServed: site.cities.map((c) => ({ "@type": "City", name: c })),
  openingHours: "Mo-Sa 09:00-19:00",
};

export const productSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.brand,
  description: site.shortDescription,
  parentOrganization: { "@type": "Organization", name: site.company },
  telephone: site.phoneRaw,
  areaServed: site.cities.map((c) => ({ "@type": "City", name: c })),
};
