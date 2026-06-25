
-- Helper: updated_at trigger fn
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ profiles ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  location TEXT,
  target_roles TEXT[] DEFAULT '{}',
  experience_level TEXT,
  preferred_locations TEXT[] DEFAULT '{}',
  preferred_job_types TEXT[] DEFAULT '{}',
  completeness_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generic per-user table helper macro pattern: we'll just inline each table.

-- ============ education ============
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  degree TEXT,
  branch TEXT,
  institution TEXT,
  start_year INTEGER,
  end_year INTEGER,
  cgpa TEXT,
  relevant_coursework TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education TO authenticated;
GRANT ALL ON public.education TO service_role;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own education" ON public.education FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER education_set_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ experience ============
CREATE TABLE public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company TEXT,
  title TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  tech_used TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT ALL ON public.experience TO service_role;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own experience" ON public.experience FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER experience_set_updated_at BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ projects ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  outcomes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own projects" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ skills ============
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  technical TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  soft_skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own skills" ON public.skills FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER skills_set_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ certifications ============
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT,
  issuer TEXT,
  issued_date DATE,
  credential_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own certifications" ON public.certifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER certifications_set_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ achievements ============
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  type TEXT,
  date DATE,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own achievements" ON public.achievements FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER achievements_set_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ jobs (global catalog) ============
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_hash TEXT UNIQUE,
  title TEXT,
  company TEXT,
  company_logo_url TEXT,
  location TEXT,
  is_remote BOOLEAN NOT NULL DEFAULT false,
  job_type TEXT,
  experience_required TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'INR',
  skills_required TEXT[] DEFAULT '{}',
  description TEXT,
  source_platform TEXT,
  original_url TEXT UNIQUE,
  posted_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs readable by authenticated" ON public.jobs FOR SELECT TO authenticated USING (true);

-- ============ user_jobs ============
CREATE TABLE public.user_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_score INTEGER,
  status TEXT NOT NULL DEFAULT 'saved',
  notes TEXT,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_jobs TO authenticated;
GRANT ALL ON public.user_jobs TO service_role;
ALTER TABLE public.user_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own user_jobs" ON public.user_jobs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_jobs_set_updated_at BEFORE UPDATE ON public.user_jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ resumes ============
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,
  parsed_text TEXT,
  is_master BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own resumes" ON public.resumes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ tailored_resumes ============
CREATE TABLE public.tailored_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  job_title TEXT,
  company TEXT,
  ats_score_before INTEGER,
  ats_score_after INTEGER,
  gap_analysis JSONB,
  tailored_content JSONB,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tailored_resumes TO authenticated;
GRANT ALL ON public.tailored_resumes TO service_role;
ALTER TABLE public.tailored_resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own tailored_resumes" ON public.tailored_resumes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ search_schedules ============
CREATE TABLE public.search_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  notify_time TIME NOT NULL DEFAULT '09:00:00',
  notify_channel TEXT NOT NULL DEFAULT 'email',
  min_match_score INTEGER NOT NULL DEFAULT 70,
  watch_keywords TEXT[] DEFAULT '{}',
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.search_schedules TO authenticated;
GRANT ALL ON public.search_schedules TO service_role;
ALTER TABLE public.search_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own search_schedules" ON public.search_schedules FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER search_schedules_set_updated_at BEFORE UPDATE ON public.search_schedules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ search_logs ============
CREATE TABLE public.search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  jobs_found INTEGER NOT NULL DEFAULT 0,
  jobs_new INTEGER NOT NULL DEFAULT 0,
  jobs_duplicate INTEGER NOT NULL DEFAULT 0,
  top_match JSONB,
  notification_sent BOOLEAN NOT NULL DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.search_logs TO authenticated;
GRANT ALL ON public.search_logs TO service_role;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own search_logs" ON public.search_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
