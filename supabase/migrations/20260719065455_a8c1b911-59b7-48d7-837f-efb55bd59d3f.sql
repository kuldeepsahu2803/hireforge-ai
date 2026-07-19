GRANT INSERT ON public.jobs TO authenticated;
CREATE POLICY "jobs insertable by authenticated" ON public.jobs FOR INSERT TO authenticated WITH CHECK (true);