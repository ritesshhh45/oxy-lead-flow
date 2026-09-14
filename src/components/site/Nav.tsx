import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { site, whatsappLink, waMessages } from "@/config/site";
import { track } from "@/lib/analytics";
import { useEnquiry } from "@/components/enquiry/EnquiryProvider";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/our-water", label: "Our Water" },
  { to: "/products", label: "Products" },
  { to: "/quality", label: "Quality" },
  { to: "/bulk-orders", label: "For Business" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const { openEnquiry } = useEnquiry();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors",
        scrolled ? "surface-glass border-b border-border" : "bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" className="shrink-0" aria-label="OXYTIVE home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-brand" }}
                className="text-sm text-foreground/75 transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => track("whatsapp_click", { from: "nav" })}
          >
            <a href={whatsappLink(waMessages.general)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp Us
            </a>
          </Button>
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => openEnquiry()}>
            Get a Quote
          </Button>
          <a
            href={`tel:${site.phoneRaw}`}
            aria-label="Call OXYTIVE"
            onClick={() => track("phone_click", { from: "nav" })}
            className="rounded-md border border-border p-2 sm:hidden"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-border p-2 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="surface-glass border-t border-border lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-foreground/80 hover:bg-brand-soft hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                asChild
                onClick={() => track("whatsapp_click", { from: "mobile_nav" })}
              >
                <a href={whatsappLink(waMessages.general)} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  openEnquiry();
                }}
              >
                Get a Quote
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
