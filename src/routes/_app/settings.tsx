import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TagInput } from "@/components/TagInput";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({ component: Settings });

function Settings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();

  // Search schedule
  const { data: sched } = useQuery({
    queryKey: ["schedule", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("search_schedules").select("*").eq("user_id", user!.id).maybeSingle()).data,
  });

  const [form, setForm] = useState({ is_enabled: false, notify_time: "09:00:00", notify_channel: "email", min_match_score: 70, watch_keywords: [] as string[] });
  useEffect(() => {
    if (sched) setForm({
      is_enabled: !!sched.is_enabled,
      notify_time: sched.notify_time ?? "09:00:00",
      notify_channel: sched.notify_channel ?? "email",
      min_match_score: sched.min_match_score ?? 70,
      watch_keywords: sched.watch_keywords ?? [],
    });
  }, [sched]);

  const saveSchedule = async () => {
    if (!user) return;
    const { error } = await supabase.from("search_schedules").upsert({ user_id: user.id, ...form }, { onConflict: "user_id" });
    if (error) toast.error(error.message);
    else { toast.success("Search settings saved"); qc.invalidateQueries({ queryKey: ["schedule"] }); }
  };

  // Logs
  const { data: logs } = useQuery({
    queryKey: ["logs", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("search_logs").select("*").eq("user_id", user!.id).order("run_at", { ascending: false }).limit(10)).data ?? [],
  });

  // Account
  const { data: profile } = useQuery({
    queryKey: ["profile-account", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("full_name, email").eq("id", user!.id).maybeSingle()).data,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  useEffect(() => { if (profile) { setName(profile.full_name ?? ""); setEmail(profile.email ?? ""); } }, [profile]);

  const updateAccount = async () => {
    if (!user) return;
    const { error: pErr } = await supabase.from("profiles").update({ full_name: name, email }).eq("id", user.id);
    if (pErr) { toast.error(pErr.message); return; }
    if (email && email !== user.email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Account updated");
  };
  const changePw = async () => {
    if (pw.length < 6) { toast.error("Password too short"); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message); else { toast.success("Password changed"); setPw(""); }
  };
  const deleteAccount = async () => {
    if (!confirm("Permanently delete your profile data? This cannot be undone.")) return;
    if (!user) return;
    await supabase.from("profiles").delete().eq("id", user.id);
    await supabase.auth.signOut();
    toast.success("Account data deleted");
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="search">
        <TabsList><TabsTrigger value="search">Job Search</TabsTrigger><TabsTrigger value="account">Account</TabsTrigger><TabsTrigger value="logs">Search History</TabsTrigger></TabsList>

        <TabsContent value="search" className="mt-4">
          <Card className="glass p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div><Label className="text-base">Daily auto-search</Label><p className="text-xs text-muted-foreground">Find new matches every day automatically.</p></div>
              <Switch checked={form.is_enabled} onCheckedChange={(c) => setForm({ ...form, is_enabled: c })} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Notify time</Label><Input type="time" value={form.notify_time.slice(0, 5)} onChange={(e) => setForm({ ...form, notify_time: e.target.value + ":00" })} /></div>
              <div>
                <Label className="mb-2 block">Channel</Label>
                <RadioGroup value={form.notify_channel} onValueChange={(v) => setForm({ ...form, notify_channel: v })} className="flex gap-4">
                  {["email", "push", "both"].map((c) => <label key={c} className="flex items-center gap-2 text-sm capitalize"><RadioGroupItem value={c} />{c}</label>)}
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label>Min match score: {form.min_match_score}%</Label>
              <Slider value={[form.min_match_score]} onValueChange={([v]) => setForm({ ...form, min_match_score: v })} min={50} max={100} step={5} />
            </div>
            <div><Label className="mb-1.5 block">Watch keywords</Label><TagInput value={form.watch_keywords} onChange={(v) => setForm({ ...form, watch_keywords: v })} /></div>
            <Button onClick={saveSchedule} className="gradient-primary text-white border-0">Save</Button>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-4 space-y-4">
          <Card className="glass p-6 space-y-4">
            <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <Button onClick={updateAccount} className="gradient-primary text-white border-0">Save</Button>
          </Card>
          <Card className="glass p-6 space-y-4">
            <Label>Change password</Label>
            <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" />
            <Button onClick={changePw} variant="outline" className="bg-white/5">Update password</Button>
          </Card>
          <Card className="glass p-6 border-destructive/40">
            <div className="font-semibold text-destructive">Danger zone</div>
            <p className="text-sm text-muted-foreground mb-3">Delete your profile and all related data.</p>
            <Button variant="destructive" onClick={deleteAccount}>Delete account</Button>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="glass p-2 overflow-x-auto">
            {!logs ? <Loader2 className="size-5 m-6 animate-spin text-primary" /> : logs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No search runs yet.</div>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Found</TableHead><TableHead>New</TableHead><TableHead>Top match</TableHead></TableRow></TableHeader>
                <TableBody>
                  {logs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{new Date(l.run_at).toLocaleString()}</TableCell>
                      <TableCell>{l.jobs_found}</TableCell>
                      <TableCell>{l.jobs_new}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{(l.top_match as any)?.title ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}