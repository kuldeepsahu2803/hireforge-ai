import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/jobs/database")({ component: DBPage });

function DBPage() {
  const { user } = useAuth();
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["jobs-db", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_jobs")
        .select("id, status, match_score, applied_at, created_at, job:jobs(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const rows = (data ?? []).filter((r) => {
    if (!q) return true;
    const j: any = r.job;
    return `${j?.title ?? ""} ${j?.company ?? ""}`.toLowerCase().includes(q.toLowerCase());
  });

  const exportCsv = () => {
    const header = ["Title", "Company", "Location", "Type", "Platform", "Match", "Status", "Posted"];
    const lines = rows.map((r) => {
      const j: any = r.job;
      return [j?.title, j?.company, j?.location, j?.job_type, j?.source_platform, r.match_score, r.status, j?.posted_at].map((v) => `"${(v ?? "").toString().replaceAll('"', '""')}"`).join(",");
    });
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "hireforge-jobs.csv";
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-bold">Job Database</h1>
        <div className="flex gap-2">
          <Input className="w-64" placeholder="Search title or company" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button variant="outline" className="bg-white/5" onClick={exportCsv}><Download className="size-4 mr-1" />Export CSV</Button>
        </div>
      </div>

      <Card className="glass p-2 overflow-x-auto">
        {isLoading ? (
          <Loader2 className="size-5 m-6 animate-spin text-primary" />
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No saved jobs yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Company</TableHead><TableHead>Location</TableHead>
                <TableHead>Type</TableHead><TableHead>Platform</TableHead><TableHead>Match</TableHead>
                <TableHead>Status</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const j: any = r.job;
                if (!j) return null;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{j.title}</TableCell>
                    <TableCell>{j.company}</TableCell>
                    <TableCell>{j.location}</TableCell>
                    <TableCell className="capitalize">{j.job_type}</TableCell>
                    <TableCell>{j.source_platform}</TableCell>
                    <TableCell>{r.match_score ?? "—"}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{r.status}</Badge></TableCell>
                    <TableCell><Button asChild size="sm" variant="ghost"><Link to="/jobs/$id" params={{ id: j.id }}>View</Link></Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}