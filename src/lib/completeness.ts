import { supabase } from "@/integrations/supabase/client";

export async function computeCompleteness(userId: string): Promise<number> {
  const [p, e, w, pr, s, c, a] = await Promise.all([
    supabase.from("profiles").select("full_name, email, phone, linkedin_url, location, target_roles, experience_level").eq("id", userId).maybeSingle(),
    supabase.from("education").select("id").eq("user_id", userId),
    supabase.from("experience").select("id").eq("user_id", userId),
    supabase.from("projects").select("id").eq("user_id", userId),
    supabase.from("skills").select("technical, tools").eq("user_id", userId).maybeSingle(),
    supabase.from("certifications").select("id").eq("user_id", userId),
    supabase.from("achievements").select("id").eq("user_id", userId),
  ]);

  let score = 0;
  const pd = p.data;
  if (pd) {
    const fields = [pd.full_name, pd.email, pd.phone, pd.linkedin_url, pd.location, pd.experience_level];
    const filled = fields.filter(Boolean).length / fields.length;
    const roles = (pd.target_roles?.length ?? 0) > 0 ? 1 : 0;
    score += Math.round(20 * ((filled + roles) / 2));
  }
  if ((e.data?.length ?? 0) > 0) score += 15;
  if ((w.data?.length ?? 0) > 0) score += 20;
  if ((pr.data?.length ?? 0) > 0) score += 15;
  const sd = s.data;
  if (sd && ((sd.technical?.length ?? 0) > 0 || (sd.tools?.length ?? 0) > 0)) score += 15;
  if ((c.data?.length ?? 0) > 0) score += 10;
  if ((a.data?.length ?? 0) > 0) score += 5;

  await supabase.from("profiles").update({ completeness_score: score }).eq("id", userId);
  return score;
}