/**
 * OXYTIVE — static fallback configuration.
 *
 * OXYTIVE is the bottled drinking water brand.
 * Vedarth Water Industry is the company that makes it.
 *
 * Live values (contact details, products, content) are managed from the Admin
 * Panel and stored in the database. The values here are only used before the
 * database responds, or as a safe default.
 */

export const site = {
  brand: "OXYTIVE",
  company: "Vedarth Water Industry",
  brandLine: "OXYTIVE by Vedarth Water Industry",
  tagline: "Pure Water. Powerful First Impression.",
  category: "Packaged Drinking Water",
  shortDescription:
    "OXYTIVE is a bottled drinking water brand by Vedarth Water Industry, supplied for everyday hydration, businesses, events and trade partners.",

  // --- Contact (editable from Admin Panel → Contact) ---
  phone: "9956651010",
  phone2: "7250635050",
  phoneRaw: "+919956651010",
  whatsapp: "919956651010",
  // Email is intentionally NOT shown publicly until the admin enables it.
  email: "",
  showEmail: false,
  address: {
    line1: "Village Pal, Near Wakad Project",
    line2: "Ta. Panhala",
    city: "Dist. Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    pincode: "",
    country: "India",
  },
  hours: "Monday – Saturday, 9:00 AM – 7:00 PM",

  social: {
    instagram: "#",
    facebook: "#",
    linkedin: "#",
    youtube: "#",
  },

  serviceAreaLabel: "Maharashtra",
  cities: ["Chhatrapati Sambhajinagar", "Pune", "Nashik", "Jalna", "Ahilyanagar", "Beed"],
  deliveryNote:
    "Delivery and bulk supply availability is confirmed area-by-area. Share your location and we will confirm serviceability for your requirement.",

  compliance: {
    bis: "",
    fssai: "",
    manufacturing: "",
    labReports: "",
  },

  analytics: {
    gtmId: "",
    ga4Id: "",
    googleAdsId: "",
    adsConversionLabels: {
      form_submit: "",
      whatsapp_click: "",
      phone_click: "",
    },
  },
} as const;

export const requirementTypes = [
  "Hotel",
  "Cafe",
  "Restaurant",
  "Wedding",
  "Event",
  "Corporate",
  "Retail",
  "Distributor",
  "Personal",
  "Other",
] as const;

export const quantityBands = [
  "Under 500",
  "500 – 1,000",
  "1,000 – 5,000",
  "5,000 – 10,000",
  "10,000+",
  "Not Sure",
] as const;

export const businessTypes = [
  "Hotel",
  "Cafe",
  "Restaurant",
  "Resort",
  "Banquet Hall",
  "Caterer",
  "Corporate Office",
  "Event / Wedding Planner",
  "Retail Store",
  "Gym / Fitness",
  "Institution",
  "Distributor / Wholesaler",
  "Other",
] as const;

export const eventTypes = [
  "Wedding",
  "Engagement",
  "Birthday Party",
  "Corporate Event",
  "College Event",
  "Sports Event",
  "Conference",
  "Catering",
  "Large Gathering",
] as const;

export function whatsappNumber(n?: string) {
  return (n && n.replace(/\D/g, "")) || site.whatsapp;
}

export function whatsappLink(message: string, number?: string) {
  return `https://wa.me/${whatsappNumber(number)}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  general: `Hi ${site.brand}, I would like to know more about your packaged drinking water. Please share details.`,
  bulk: `Hi ${site.brand}, I am interested in a bulk drinking water order. Please share pricing and availability.`,
  business: `Hi ${site.brand}, I would like to enquire about regular bottled drinking water supply for my business.`,
  event: `Hi ${site.brand}, I am planning an event and would like a quotation for bottled drinking water.`,
  distributor: `Hi ${site.brand}, I am interested in becoming a distributor/retail partner.`,
  product500: `Hi ${site.brand}, I am interested in your 500 mL bottle. Please share bulk pricing.`,
  area: `Hi ${site.brand}, I would like to check delivery availability in my area.`,
};
