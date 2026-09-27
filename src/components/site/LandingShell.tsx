import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { FloatingActions } from "@/components/site/FloatingActions";
import { site, whatsappLink } from "@/config/site";
import { track } from "@/lib/analytics";

export function LandingShell({ children, waMessage }: { children: ReactNode; waMessage: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="surface-glass sticky top-0 z-50 border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" aria-label="OXYTIVE home" className="min-w-0">
            <Logo />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`tel:${site.phoneRaw}`} onClick={() => track("phone_click", { from: "landing_nav" })}>
                <Phone className="mr-1 h-4 w-4" /> <span className="hidden sm:inline">Call Now</span>
              </a>
            </Button>
            <Button asChild size="sm">
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { from: "landing_nav" })}
              >
                <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted-foreground">
        <p>
          {site.brand} • {site.category} • {site.phone}
        </p>
        <p className="mt-2">
          <Link to="/" className="underline hover:text-brand">
            Visit the full website
          </Link>
        </p>
      </footer>
      <FloatingActions />
    </div>
  );
}
