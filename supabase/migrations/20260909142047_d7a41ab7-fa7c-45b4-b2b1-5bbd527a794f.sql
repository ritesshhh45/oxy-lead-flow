
-- roles
create type public.app_role as enum ('admin','editor');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create table public.admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);
grant select on public.admin_emails to authenticated;
grant all on public.admin_emails to service_role;
alter table public.admin_emails enable row level security;

insert into public.admin_emails (email) values ('ritesshhh19@gmail.com');

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select
    exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
    or exists (
      select 1 from public.admin_emails
      where lower(email) = lower(coalesce((auth.jwt() ->> 'email'), ''))
    )
$$;

create policy "admins read roles" on public.user_roles for select to authenticated using (public.is_admin() or user_id = auth.uid());
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read admin emails" on public.admin_emails for select to authenticated using (public.is_admin());
create policy "admins manage admin emails" on public.admin_emails for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- shared updated_at
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size text not null default '',
  description text not null default '',
  ideal_for text[] not null default '{}',
  price text,
  image_url text,
  image_alt text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public read active products" on public.products for select to anon, authenticated using (is_active or public.is_admin());
create policy "admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger products_updated_at before update on public.products for each row execute function public.update_updated_at_column();

-- site content
create table public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;
create policy "public read site content" on public.site_content for select to anon, authenticated using (true);
create policy "admins manage site content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger site_content_updated_at before update on public.site_content for each row execute function public.update_updated_at_column();

-- faqs
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.faqs to anon;
grant select, insert, update, delete on public.faqs to authenticated;
grant all on public.faqs to service_role;
alter table public.faqs enable row level security;
create policy "public read active faqs" on public.faqs for select to anon, authenticated using (is_active or public.is_admin());
create policy "admins manage faqs" on public.faqs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger faqs_updated_at before update on public.faqs for each row execute function public.update_updated_at_column();

-- service areas
create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.service_areas to anon;
grant select, insert, update, delete on public.service_areas to authenticated;
grant all on public.service_areas to service_role;
alter table public.service_areas enable row level security;
create policy "public read active areas" on public.service_areas for select to anon, authenticated using (is_active or public.is_admin());
create policy "admins manage areas" on public.service_areas for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger service_areas_updated_at before update on public.service_areas for each row execute function public.update_updated_at_column();

-- media library
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  url text not null,
  label text,
  created_at timestamptz not null default now()
);
grant select on public.media_assets to anon;
grant select, insert, update, delete on public.media_assets to authenticated;
grant all on public.media_assets to service_role;
alter table public.media_assets enable row level security;
create policy "public read media" on public.media_assets for select to anon, authenticated using (true);
create policy "admins manage media" on public.media_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- leads additions
alter table public.leads
  add column if not exists product text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text;

-- seed content
insert into public.site_content (key, value) values
('contact', jsonb_build_object(
  'company','Vedarth Water Industry','brand','OXYTIVE',
  'phone1','9956651010','phone2','7250635050',
  'whatsapp','919956651010',
  'email','','show_email', false,
  'address_line1','Village Pal, Near Wakad Project',
  'address_line2','Ta. Panhala, Dist. Chhatrapati Sambhajinagar',
  'hours','Monday – Saturday, 9:00 AM – 7:00 PM')),
('hero', jsonb_build_object(
  'headline','Pure Water. Powerful First Impression.',
  'subtitle','Premium packaged drinking water for everyday hydration, businesses, events and every moment that matters.',
  'brand_line','OXYTIVE by Vedarth Water Industry',
  'cta','Get a Quote','cta_secondary','Explore OXYTIVE','image_url','')),
('products_section', jsonb_build_object('title','Explore OXYTIVE','subtitle','Choose the right OXYTIVE for every occasion.')),
('business', jsonb_build_object('title','Your Guests Notice the Details.','text','Make every table, stay and service experience better with OXYTIVE packaged drinking water.')),
('events', jsonb_build_object('title','Make Every Celebration Refreshing.','text','Packaged drinking water for weddings, corporate days, college festivals and every gathering in between.')),
('distributor', jsonb_build_object('title','Grow With OXYTIVE.','text','Partner with Vedarth Water Industry to distribute or retail OXYTIVE packaged drinking water.')),
('quality', jsonb_build_object(
  'title','Every Drop Deserves Attention.',
  'steps', jsonb_build_array(
    jsonb_build_object('title','Water Input','text','Source water is drawn and held for treatment.'),
    jsonb_build_object('title','Purification','text','Multi-stage treatment prepares the water for packaging.'),
    jsonb_build_object('title','Quality Checks','text','Batches are checked before packing.'),
    jsonb_build_object('title','Hygienic Packaging','text','Bottles are filled, sealed and labelled in a controlled line.'),
    jsonb_build_object('title','Ready for Delivery','text','Packed cases are staged for dispatch.')),
  'bis','','fssai','','certificates','','lab_reports','','manufacturing','')),
('about', jsonb_build_object('title','Vedarth Water Industry','text','Vedarth Water Industry is the company behind OXYTIVE packaged drinking water. OXYTIVE is our consumer-facing bottled drinking water brand, supplied for households, businesses, events and trade partners.')),
('why', jsonb_build_object('title','Why OXYTIVE')),
('footer', jsonb_build_object('tagline','A bottled drinking water brand by Vedarth Water Industry.','developer','Ritesh Pawar'))
on conflict (key) do nothing;

insert into public.products (name, size, description, ideal_for, is_active, is_featured, display_order) values
('OXYTIVE 500 mL','500 mL','The everyday grab-and-go bottle. Single-serve, sealed and sized for movement.', array['Retail','Travel','Events','Restaurants','Corporate meetings'], true, true, 1),
('OXYTIVE 1 L','1 L','A full-size bottle for tables, cabins, longer journeys and shared settings.', array['Households','Hotels & restaurants','Offices','Travel','Catering'], true, false, 2);

insert into public.service_areas (name, display_order) values
('Chhatrapati Sambhajinagar',1),('Pune',2),('Nashik',3),('Jalna',4),('Ahilyanagar',5),('Beed',6);

insert into public.faqs (question, answer, display_order) values
('Which OXYTIVE bottle sizes are available?','The current range is listed on the products section of this website. Tell us the size and volume you need and we will confirm availability.',1),
('Do you supply in bulk for hotels, restaurants and offices?','Yes. Share your monthly requirement and location and we will send a quotation.',2),
('Can you supply water for weddings and events?','Yes. Share the event date, city and expected guest count for a quotation.',3),
('How do I become a distributor or retail partner?','Send a partnership enquiry with your business details and area and our team will get in touch.',4),
('How is delivery availability confirmed?','Delivery is confirmed area by area. Share your location and we will confirm serviceability.',5);
