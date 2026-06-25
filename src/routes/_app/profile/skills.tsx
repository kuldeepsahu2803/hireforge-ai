import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/TagInput";
import { toast } from "sonner";
import { computeCompleteness } from "@/lib/completeness";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/profile/skills")({ component: Page });

function Page() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["skills", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("skills").select("*").eq("user_id", user!.id).maybeSingle()).data,
  });

  const [form, setForm] = useState({ technical: [] as string[], tools: [] as string[], soft_skills: [] as string[], languages: [] as string[] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm({ technical: data.technical ?? [], tools: data.tools ?? [], soft_skills: data.soft_skills ?? [], languages: data.languages ?? [] });
  }, [data]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = { user_id: user.id, ...form };
      const { error } = data
        ? await supabase.from("skills").update(payload).eq("user_id", user.id)
        : await supabase.from("skills").insert(payload);
      if (error) throw error;
      await computeCompleteness(user.id);
      await qc.invalidateQueries({ queryKey: ["skills"] });
      await qc.invalidateQueries({ queryKey: ["completeness"] });
      toast.success("Skills saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <Card className="glass p-6 space-y-4">
      <h2 className="font-semibold text-lg">Skills</h2>
      <div><Label className="mb-1.5 block">Technical skills</Label><TagInput value={form.technical} onChange={(v) => setForm({ ...form, technical: v })} placeholder="e.g. TypeScript, React" /></div>
      <div><Label className="mb-1.5 block">Tools & frameworks</Label><TagInput value={form.tools} onChange={(v) => setForm({ ...form, tools: v })} placeholder="e.g. Docker, AWS" /></div>
      <div><Label className="mb-1.5 block">Soft skills</Label><TagInput value={form.soft_skills} onChange={(v) => setForm({ ...form, soft_skills: v })} /></div>
      <div><Label className="mb-1.5 block">Languages</Label><TagInput value={form.languages} onChange={(v) => setForm({ ...form, languages: v })} placeholder="e.g. English (Native)" /></div>
      <Button onClick={save} disabled={saving} className="gradient-primary text-white border-0">{saving ? <Loader2 className="size-4 animate-spin" /> : "Save skills"}</Button>
    </Card>
  );
}

