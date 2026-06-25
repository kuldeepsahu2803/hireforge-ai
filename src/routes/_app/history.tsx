import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/history")({ component: HistoryPage });

function HistoryPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["tailored", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("tailored_resumes").select("*").eq("user_id", user!.id).order("created_at", { ascending: false })).data ?? [],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Tailor History</h1>
      <p className="text-muted-foreground text-sm mb-6">Every resume you've tailored, in one place.</p>
      {isLoading ? <Loader2 className="size-5 animate-spin text-primary" /> :
        !data || data.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">No tailored resumes yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((t) => (
              <Card key={t.id} className="glass p-5">
                <div className="font-semibold">{t.job_title ?? "Untitled"}</div>
                <div className="text-sm text-muted-foreground">{t.company ?? ""}</div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary">ATS {t.ats_score_before ?? 0}</Badge>
                  <ArrowRight className="size-3" />
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-0">ATS {t.ats_score_after ?? 0}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-2">{new Date(t.created_at).toLocaleDateString()}</div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="bg-white/5" disabled><Download className="size-3.5 mr-1" />PDF</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}