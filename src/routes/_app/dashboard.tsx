import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileCheck, Sparkles, Target, Search, Kanban, ArrowRight, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const uid = user!.id;
      const [profile, jobs, userJobs, tailored] = await Promise.all([
        supabase.from("profiles").select("full_name, completeness_score").eq("id", uid).maybeSingle(),
        supabase.from("jobs").select("*").order("posted_at", { ascending: false }).limit(5),
        supabase.from("user_jobs").select("status, match_score").eq("user_id", uid),
        supabase.from("tailored_resumes").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(3),
      ]);
      return {
        profile: profile.data,
        latestJobs: jobs.data ?? [],
        userJobs: userJobs.data ?? [],
        tailored: tailored.data ?? [],
      };
    },
  });

  if (isLoading || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const applied = data.userJobs.filter((j) => j.status === "applied" || j.status === "interview" || j.status === "offer").length;
  const avgAts = data.tailored.length
    ? Math.round(data.tailored.reduce((a, r) => a + (r.ats_score_after ?? 0), 0) / data.tailored.length)
    : 0;
  const completeness = data.profile?.completeness_score ?? 0;
  const firstName = (data.profile?.full_name ?? user?.email ?? "").split(" ")[0] || "there";

  const chart = [
    { k: "Saved", v: data.userJobs.filter((j) => j.status === "saved").length },
    { k: "Applied", v: data.userJobs.filter((j) => j.status === "applied").length },
    { k: "Interview", v: data.userJobs.filter((j) => j.status === "interview").length },
    { k: "Offer", v: data.userJobs.filter((j) => j.status === "offer").length },
    { k: "Rejected", v: data.userJobs.filter((j) => j.status === "rejected").length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, <span className="gradient-text">{firstName}</span></h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your job hunt today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="gradient-primary text-white border-0"><Link to="/jobs"><Search className="size-4 mr-1" /> Search Jobs</Link></Button>
          <Button asChild variant="outline" className="bg-white/5"><Link to="/tailor"><Sparkles className="size-4 mr-1" /> Tailor Resume</Link></Button>
          <Button asChild variant="outline" className="bg-white/5"><Link to="/jobs/tracker"><Kanban className="size-4 mr-1" /> Tracker</Link></Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label="Total Jobs Found" value={data.latestJobs.length + data.userJobs.length} />
        <StatCard icon={FileCheck} label="Jobs Applied" value={applied} />
        <StatCard icon={Target} label="Avg ATS Score" value={avgAts ? `${avgAts}%` : "—"} />
        <StatCard icon={Sparkles} label="Profile Complete" value={`${completeness}%`} />
      </div>

      {/* Completeness */}
      {completeness < 100 && (
        <Card className="glass p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Profile completeness</span>
              <span className="text-muted-foreground">{completeness}%</span>
            </div>
            <Progress value={completeness} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">A complete profile gets better matches and richer tailoring.</p>
          </div>
          <Button asChild variant="outline" className="bg-white/5"><Link to="/profile/personal">Complete profile <ArrowRight className="ml-1 size-4" /></Link></Button>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass p-5 lg:col-span-2">
          <h2 className="font-semibold mb-4">Application pipeline</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="k" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="v" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Today's new jobs</h2>
            <Link to="/jobs" className="text-xs text-primary">View all</Link>
          </div>
          {data.latestJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs yet — run a search.</p>
          ) : (
            <ul className="space-y-3">
              {data.latestJobs.map((j) => (
                <li key={j.id} className="rounded-lg p-3 hover:bg-white/5 transition">
                  <div className="font-medium text-sm">{j.title}</div>
                  <div className="text-xs text-muted-foreground">{j.company} · {j.location}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="glass p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent tailored resumes</h2>
          <Link to="/history" className="text-xs text-primary">All history</Link>
        </div>
        {data.tailored.length === 0 ? (
          <div className="text-sm text-muted-foreground">Tailor your first resume to see it here.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {data.tailored.map((t) => (
              <div key={t.id} className="glass rounded-lg p-4">
                <div className="font-medium text-sm">{t.job_title ?? "Untitled"}</div>
                <div className="text-xs text-muted-foreground">{t.company ?? ""}</div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Badge variant="secondary">ATS {t.ats_score_before ?? 0}</Badge>
                  <ArrowRight className="size-3" />
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-0">ATS {t.ats_score_after ?? 0}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string }) {
  return (
    <Card className="glass p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        <div className="size-10 rounded-lg gradient-primary flex items-center justify-center">
          <Icon className="size-5 text-white" />
        </div>
      </div>
    </Card>
  );
}