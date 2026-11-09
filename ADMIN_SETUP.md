# Admin setup (do once)

1. Run the new migration `supabase/migrations/20261109000000_admin_access_lockdown.sql`
   (Lovable Cloud applies it automatically on sync; otherwise paste it in the SQL editor).
   It makes `oxytive.admin@gmail.com` the ONLY admin, fixes the lead-status enum, and adds access requests.
2. Open `/admin` -> "Create account" -> use oxytive.admin@gmail.com -> confirm the email -> sign in.
   Do this first, so nobody else can register that address.
3. Anyone else who signs in sees "Access restricted" and can press "Request admin access".
   You approve/reject it in Admin -> Access.

## Optional: email alert to the owner on a new request
Set these server secrets (Resend): `RESEND_API_KEY`, optional `ADMIN_NOTIFY_EMAIL`, `MAIL_FROM`, `SITE_URL`.
Without them the request still shows in Admin -> Access (a count appears on the tab); WhatsApp alert is used if the connector is configured.

## Google favicon
Icons are in /public (favicon.ico, favicon-48/96/192/512.png, apple-touch-icon.png).
After deploying, open https://www.oxytive.in/favicon.ico to confirm, then request indexing of the home page in Search Console. Google refreshes the icon in days to weeks.
