import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Bookmark, Sparkles, Database, Info } from "lucide-react";
import { MOCK_JOBS } from "@/lib/mock-jobs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_app/jobs/")({ component: JobsPage });

const JOB_TYPES = ["full-time", "part-time", "internship", "contract"];

function JobsPage() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minScore, setMinScore] = useState(0);

  const filtered = MOCK_JOBS.filter((j) => {
    if (types.length && !types.includes(j.job_type ?? "")) return false;
    if (remoteOnly && !j.is_remote) return false;
    if (j.match_score < minScore) return false;
    if (q && !`${j.title} ${j.company}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (loc && !(j.location ?? "").toLowerCase().includes(loc.toLowerCase())) return false;
    return true;
  });

  const save = async (job: typeof MOCK_JOBS[number]) => {
    if (!user) return;
    const { data: existing } = await supabase.from("jobs").select("id").eq("job_hash", job.job_hash ?? "").maybeSingle();
    let jobId = existing?.id;
    if (!jobId) {
      const { id: _ignore, match_score: _m, matched_skills: _s, missing_skills: _ms, ...rest } = job;
      const { data: inserted, error } = await supabase.from("jobs").insert(rest).select("id").single();
      if (error) { toast.error(error.message); return; }
      jobId = inserted.id;
    }
    const { error } = await supabase.from("user_jobs").insert({ user_id: user.id, job_id: jobId, match_score: job.match_score, status: "saved" });
    if (error) { toast.error(error.message); return; }
    toast.success(`Saved ${job.title}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Job Hunter</h1>
          <p className="text-muted-foreground text-sm">AI-ranked roles across 8+ platforms.</p>
        </div>
        <Button asChild variant="outline" className="bg-white/5"><Link to="/jobs/database"><Database className="size-4 mr-1" />Job Database</Link></Button>
      </div>

      <Card className="glass p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Job title or keywords" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="relative flex-1">
          <MapPin className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Location (or 'Remote')" value={loc} onChange={(e) => setLoc(e.target.value)} />
        </div>
        <Button className="gradient-primary text-white border-0" onClick={() => toast.info("Live search will connect to your backend.")}>Search</Button>
      </Card>

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        <Card className="glass p-4 h-fit space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Job type</div>
            <div className="space-y-2">
              {JOB_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm capitalize">
                  <Checkbox checked={types.includes(t)} onCheckedChange={(c) => setTypes(c ? [...types, t] : types.filter((x) => x !== t))} /> {t}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Remote only</span>
            <Switch checked={remoteOnly} onCheckedChange={setRemoteOnly} />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Min match score: {minScore}%</div>
            <Slider value={[minScore]} onValueChange={([v]) => setMinScore(v)} max={100} step={5} />
          </div>
        </Card>

        <div className="space-y-4">
          <div className="glass rounded-lg p-3 text-xs text-muted-foreground flex items-start gap-2">
            <Info className="size-4 text-primary shrink-0 mt-0.5" />
            <span>Showing demo results. Connect the FastAPI backend to enable live multi-platform search.</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No jobs match your filters.</div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              {filtered.map((j) => <JobCard key={j.id} job={j} onSave={() => save(j)} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, onSave }: { job: typeof MOCK_JOBS[number]; onSave: () => void }) {
  const color = job.match_score >= 80 ? "text-emerald-400 border-emerald-400" : job.match_score >= 60 ? "text-amber-400 border-amber-400" : "text-rose-400 border-rose-400";
  return (
    <Card className="glass p-5 flex flex-col gap-3 hover:translate-y-[-2px] transition">
      <div className="flex items-start gap-3">
      <div className="size-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold shrink-0">{(job.company ?? "?").charAt(0)}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold leading-tight truncate">{job.title}</div>
          <div className="text-sm text-muted-foreground">{job.company} · {job.location}</div>
        </div>
        <div className={`size-12 rounded-full border-2 ${color} flex items-center justify-center font-bold text-sm shrink-0`}>{job.match_score}</div>
      </div>
      <div className="flex flex-wrap gap-1">
        <Badge variant="secondary" className="capitalize">{job.job_type}</Badge>
        <Badge variant="outline">{job.source_platform}</Badge>
        {job.is_remote && <Badge className="bg-emerald-500/20 text-emerald-300 border-0">Remote</Badge>}
      </div>
      <div className="flex flex-wrap gap-1">
        {(job.skills_required ?? []).slice(0, 5).map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
      </div>
      <div className="flex gap-2 mt-auto pt-2">
        <Button size="sm" variant="outline" className="bg-white/5" onClick={onSave}><Bookmark className="size-3.5 mr-1" />Save</Button>
        <Button asChild size="sm" className="gradient-primary text-white border-0 ml-auto">
          <Link to="/tailor"><Sparkles className="size-3.5 mr-1" />Tailor</Link>
        </Button>
      </div>
    </Card>
  );
}