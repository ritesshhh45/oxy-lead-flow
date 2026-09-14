import type { ReactNode } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

export function SiteLayout({ children, chrome = true }: { children: ReactNode; chrome?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      {chrome && <Nav />}
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
