ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'closed';
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS email_notification_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS whatsapp_notification_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS notification_error text,
  ADD COLUMN IF NOT EXISTS submission_key text;
CREATE UNIQUE INDEX IF NOT EXISTS leads_submission_key_idx ON public.leads(submission_key) WHERE submission_key IS NOT NULL;
GRANT ALL ON public.leads TO service_role;