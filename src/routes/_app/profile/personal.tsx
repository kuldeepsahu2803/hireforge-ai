import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/TagInput";
import { toast } from "sonner";
import { computeCompleteness } from "@/lib/completeness";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/profile/personal")({
  component: PersonalSection,
});

const JOB_TYPES = ["full-time", "part-time", "internship", "contract"] as const;
const LEVELS = [
  { v: "fresher", l: "Fresher" },
  { v: "junior", l: "Junior (0-2 yrs)" },
  { v: "mid", l: "Mid (2-5 yrs)" },
  { v: "senior", l: "Senior (5+ yrs)" },
];

function PersonalSection() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", linkedin_url: "", github_url: "", portfolio_url: "", location: "",
    target_roles: [] as string[], experience_level: "", preferred_locations: [] as string[], preferred_job_types: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        full_name: data.full_name ?? "", email: data.email ?? user?.email ?? "", phone: data.phone ?? "",
        linkedin_url: data.linkedin_url ?? "", github_url: data.github_url ?? "", portfolio_url: data.portfolio_url ?? "",
        location: data.location ?? "", target_roles: data.target_roles ?? [], experience_level: data.experience_level ?? "",
        preferred_locations: data.preferred_locations ?? [], preferred_job_types: data.preferred_job_types ?? [],
      });
    } else if (user) {
      setForm((f) => ({ ...f, email: user.email ?? "" }));
    }
  }, [data, user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({ id: user.id, ...form });
      if (error) throw error;
      await computeCompleteness(user.id);
      await qc.invalidateQueries({ queryKey: ["profile"] });
      await qc.invalidateQueries({ queryKey: ["completeness"] });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loader2 className="size-5 animate-spin text-primary" />;

  return (
    <Card className="glass p-6">
      <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
      <form onSubmit={save} className="grid md:grid-cols-2 gap-4">
        <Field label="Full name"><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
        <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" /></Field>
        <Field label="LinkedIn URL"><Input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} /></Field>
        <Field label="GitHub URL"><Input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} /></Field>
        <Field label="Portfolio URL" className="md:col-span-2"><Input value={form.portfolio_url} onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })} /></Field>
        <Field label="Experience level">
          <Select value={form.experience_level} onValueChange={(v) => setForm({ ...form, experience_level: v })}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>{LEVELS.map((l) => <SelectItem key={l.v} value={l.v}>{l.l}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Target roles" className="md:col-span-2"><TagInput value={form.target_roles} onChange={(v) => setForm({ ...form, target_roles: v })} placeholder="e.g. Frontend Engineer" /></Field>
        <Field label="Preferred locations" className="md:col-span-2"><TagInput value={form.preferred_locations} onChange={(v) => setForm({ ...form, preferred_locations: v })} placeholder="e.g. Remote, Bangalore" /></Field>
        <Field label="Preferred job types" className="md:col-span-2">
          <div className="flex flex-wrap gap-4">
            {JOB_TYPES.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm capitalize">
                <Checkbox checked={form.preferred_job_types.includes(t)} onCheckedChange={(c) => {
                  setForm({ ...form, preferred_job_types: c ? [...form.preferred_job_types, t] : form.preferred_job_types.filter((x) => x !== t) });
                }} />
                {t}
              </label>
            ))}
          </div>
        </Field>
        <div className="md:col-span-2">
          <Button type="submit" disabled={saving} className="gradient-primary text-white border-0">
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}