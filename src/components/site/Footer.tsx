import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { site, whatsappLink, waMessages } from "@/config/site";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/products", label: "Products" },
      { to: "/our-water", label: "Our Water" },
      { to: "/quality", label: "Quality" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "For Business",
    links: [
      { to: "/bulk-orders", label: "Bulk Orders" },
      { to: "/events", label: "Events" },
      { to: "/distributors", label: "Distributor" },
      { to: "/distributors", label: "Retail Partner" },
    ],
  },
  {
    title: "Policies",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/delivery-policy", label: "Shipping / Delivery Policy" },
    ],
  },
] as const;

export function Footer() {
  const whatsapp = whatsappLink(waMessages.general, site.whatsapp);

  return (
    <footer className="border-t border-border bg-brand-deep text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <Logo inverted />

          <p className="max-w-xs text-sm text-brand-foreground/70">
            A bottled drinking water brand by {site.company}.
          </p>

          <p className="max-w-xs text-sm text-brand-foreground/60">
            {site.shortDescription}
          </p>

          <div className="flex gap-3">
            <a
              href={site.social.instagram}
              aria-label="Instagram"
              className="opacity-70 hover:opacity-100"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <a
              href={site.social.facebook}
              aria-label="Facebook"
              className="opacity-70 hover:opacity-100"
            >
              <Facebook className="h-5 w-5" />
            </a>

            <a
              href={site.social.linkedin}
              aria-label="LinkedIn"
              className="opacity-70 hover:opacity-100"
            >
              <Linkedin className="h-5 w-5" />
            </a>

            <a
              href={site.social.youtube}
              aria-label="YouTube"
              className="opacity-70 hover:opacity-100"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Footer Columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold tracking-wide text-brand-foreground">
              {col.title}
            </h3>

            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-brand-foreground/70 hover:text-brand-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

              {col.title === "Policies" && (
                <li>
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 text-sm text-brand-foreground/70 hover:text-brand-foreground"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact Bar */}
      <div className="border-t border-brand-foreground/15">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 text-sm text-brand-foreground/70 sm:px-6 lg:grid-cols-3">
          {/* Phone */}
          <div className="space-y-1">
            <a
              href={`tel:${site.phoneRaw}`}
              className="flex items-center gap-2 hover:text-brand-foreground"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {site.phone}
            </a>

            <a
              href={`tel:+917250635050`}
              className="flex items-center gap-2 hover:text-brand-foreground"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {site.phone2}
            </a>
          </div>

          {/* Email + Availability */}
          <div className="space-y-2">
            {site.showEmail && site.email && (
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 hover:text-brand-foreground"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {site.email}
              </a>
            )}

            <p className="text-sm text-brand-foreground/70">
              Available 24/7
            </p>
          </div>

          {/* Address */}
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

            <span>
              {site.company} — {site.address.line1},{" "}
              {site.address.line2},{" "}
              {site.address.city},{" "}
              {site.address.state}
            </span>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-brand-foreground/15 px-4 py-5 text-center text-xs text-brand-foreground/60">
        © {new Date().getFullYear()} {site.brand}. {site.category}. All rights
        reserved. · Developed by Ritesh Pawar
      </div>
    </footer>
  );
}