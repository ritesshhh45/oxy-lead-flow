# Finish OXYTIVE website and admin

## Goal
Complete the existing OXYTIVE site without replacing its current backend, then verify the public website, admin workflows, and deployment-safe images.

## Work
1. Finish secure admin access and create one unified admin workspace for dashboard metrics, leads, products, content, FAQs, service areas, and media.
2. Complete every public section using live CMS, product, FAQ, service-area, and contact data; connect contextual business, event, distributor, and quote enquiries.
3. Apply the approved Crystal Violet premium visual direction throughout, led by the supplied OXYTIVE artwork and exact purple bottle label.
4. Repair image handling so uploaded media uses stable `/api/public/media/...` URLs and bundled supplied artwork uses CDN asset URLs, never local or temporary links.
5. Validate metadata, forms, calls, WhatsApp links, product management, admin permissions, desktop/mobile rendering, and the published URL.

## Technical details
- Preserve TanStack Start, Lovable Cloud, current tables, storage bucket, media endpoint, and authentication.
- Keep OXYTIVE as the product brand and Vedarth Water Industry as the company.
- Restrict admin data through the existing database role policies, not client-side checks alone.
- Test locally with browser automation, then inspect the published website; publishing a new frontend revision still requires the project owner to click Update.
