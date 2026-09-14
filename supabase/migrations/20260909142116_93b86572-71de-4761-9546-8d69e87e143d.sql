
drop function if exists public.has_role(uuid, public.app_role);

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

drop policy "public read active products" on public.products;
create policy "anon read active products" on public.products for select to anon using (is_active);
create policy "auth read products" on public.products for select to authenticated using (is_active or public.is_admin());

drop policy "public read active faqs" on public.faqs;
create policy "anon read active faqs" on public.faqs for select to anon using (is_active);
create policy "auth read faqs" on public.faqs for select to authenticated using (is_active or public.is_admin());

drop policy "public read active areas" on public.service_areas;
create policy "anon read active areas" on public.service_areas for select to anon using (is_active);
create policy "auth read areas" on public.service_areas for select to authenticated using (is_active or public.is_admin());
