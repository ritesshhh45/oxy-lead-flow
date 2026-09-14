
create policy "admins read media objects" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admins upload media objects" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media objects" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());
create policy "admins delete media objects" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
