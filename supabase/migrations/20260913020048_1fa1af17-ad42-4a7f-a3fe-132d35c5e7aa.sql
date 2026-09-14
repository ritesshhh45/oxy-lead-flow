DROP POLICY IF EXISTS "Team can view leads" ON public.leads;
DROP POLICY IF EXISTS "Team can update leads" ON public.leads;
DROP POLICY IF EXISTS "Team can delete leads" ON public.leads;
CREATE POLICY "Approved admins can view leads" ON public.leads FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Approved admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Approved admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.is_admin());