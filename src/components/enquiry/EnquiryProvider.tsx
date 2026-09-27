import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LeadForm, type LeadFormField } from "@/components/forms/LeadForm";

type OpenOptions = {
  title?: string;
  description?: string;
  fields?: LeadFormField[];
  defaults?: Record<string, string>;
  eventName?: Parameters<typeof import("@/lib/analytics").track>[0];
};

type Ctx = { openEnquiry: (opts?: OpenOptions) => void };

const EnquiryContext = createContext<Ctx>({ openEnquiry: () => {} });

export const useEnquiry = () => useContext(EnquiryContext);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOptions>({});

  const openEnquiry = useCallback((o: OpenOptions = {}) => {
    setOpts(o);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openEnquiry }), [openEnquiry]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {opts.title ?? "Let's Get Your Requirement Sorted."}
            </DialogTitle>
            <DialogDescription>
              {opts.description ??
                "Share a few details and our team will get back to you with pricing and availability."}
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            {...(opts.fields ? { fields: opts.fields } : {})}
            {...(opts.defaults ? { defaults: opts.defaults } : {})}
            eventName={opts.eventName ?? "quote_request"}
          />

        </DialogContent>
      </Dialog>
    </EnquiryContext.Provider>
  );
}
