DROP POLICY IF EXISTS "jobs insertable by authenticated" ON public.jobs;
CREATE POLICY "jobs insertable by authenticated" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (
    title IS NOT NULL
    AND company IS NOT NULL
    AND original_url IS NOT NULL
  );