import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_JOBS } from "@/lib/mock-jobs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bookmark, Sparkles, Loader2, Check, X } from "lucide-react";

export const Route = createFileRoute("/_app/jobs/$id")({ component: JobDetail });

function JobDetail() {
  const { id } = Route.useParams();

  const mock = MOCK_JOBS.find((m) => m.id === id);

  const { data, isLoading } = useQuery({
    queryKey: ["job", id],
    enabled: !mock,
    queryFn: async () => (await supabase.from("jobs").select("*").eq("id", id).maybeSingle()).data,
  });

  const job = mock ?? (data as any);

  if (!mock && isLoading) return <div className="p-10"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  if (!job) return <div className="p-10 text-center text-muted-foreground">Job not found.</div>;

  const matched: string[] = mock?.matched_skills ?? [];
  const missing: string[] = mock?.missing_skills ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
      <Card className="glass p-6">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl">{job.company?.charAt(0)}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-muted-foreground">{job.company} · {job.location}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="capitalize">{job.job_type}</Badge>
              {job.is_remote && <Badge className="bg-emerald-500/20 text-emerald-300 border-0">Remote</Badge>}
              {job.salary_min && <Badge variant="outline">{job.salary_currency} {job.salary_min.toLocaleString()} – {job.salary_max?.toLocaleString()}</Badge>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          <Button variant="outline" className="bg-white/5"><Bookmark className="size-4 mr-1" />Save job</Button>
          <Button asChild className="gradient-primary text-white border-0"><a href={job.original_url ?? "#"} target="_blank" rel="noreferrer"><ExternalLink className="size-4 mr-1" />Apply now</a></Button>
          <Button asChild variant="outline" className="bg-white/5"><Link to="/tailor"><Sparkles className="size-4 mr-1" />Tailor resume</Link></Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass p-5 md:col-span-2">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</p>
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-2">Skills required</h3>
            <div className="flex flex-wrap gap-1.5">{(job.skills_required ?? []).map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
          </div>
        </Card>
        <Card className="glass p-5">
          <h2 className="font-semibold mb-3">Match breakdown</h2>
          <div className="text-sm font-medium text-emerald-300 mb-1">Matched</div>
          <div className="flex flex-wrap gap-1.5 mb-4">{matched.length ? matched.map((s) => <Badge key={s} className="bg-emerald-500/20 text-emerald-300 border-0"><Check className="size-3 mr-1" />{s}</Badge>) : <span className="text-xs text-muted-foreground">—</span>}</div>
          <div className="text-sm font-medium text-rose-300 mb-1">Missing</div>
          <div className="flex flex-wrap gap-1.5">{missing.length ? missing.map((s) => <Badge key={s} className="bg-rose-500/20 text-rose-300 border-0"><X className="size-3 mr-1" />{s}</Badge>) : <span className="text-xs text-muted-foreground">—</span>}</div>
        </Card>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Similar jobs</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {MOCK_JOBS.filter((m) => m.id !== id).slice(0, 3).map((m) => (
            <Link key={m.id} to="/jobs/$id" params={{ id: m.id }} className="glass rounded-xl p-4 hover:translate-y-[-2px] transition block">
              <div className="font-medium">{m.title}</div>
              <div className="text-xs text-muted-foreground">{m.company}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}