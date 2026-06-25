import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { JOB_STATUSES, type JobStatus, type UserJob, type Job } from "@/types";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/jobs/tracker")({ component: Tracker });

type Row = UserJob & { job: Job | null };

function Tracker() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [openJob, setOpenJob] = useState<Row | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tracker", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_jobs")
        .select("*, job:jobs(*)")
        .eq("user_id", user!.id);
      return (data ?? []) as Row[];
    },
  });

  const onDragEnd = async (e: DragEndEvent) => {
    const id = e.active.id as string;
    const newStatus = e.over?.id as JobStatus | undefined;
    if (!newStatus) return;
    const current = data?.find((r) => r.id === id);
    if (!current || current.status === newStatus) return;
    qc.setQueryData<Row[]>(["tracker", user?.id], (rows) => rows?.map((r) => r.id === id ? { ...r, status: newStatus } : r));
    const patch: any = { status: newStatus };
    if (newStatus === "applied" && !current.applied_at) patch.applied_at = new Date().toISOString();
    const { error } = await supabase.from("user_jobs").update(patch).eq("id", id);
    if (error) { toast.error(error.message); qc.invalidateQueries({ queryKey: ["tracker"] }); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Application Tracker</h1>
      <p className="text-muted-foreground text-sm mb-6">Drag cards across the pipeline.</p>

      {isLoading ? <Loader2 className="size-5 animate-spin text-primary" /> : (
        <DndContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {JOB_STATUSES.map((s) => {
              const rows = (data ?? []).filter((r) => r.status === s);
              return <Column key={s} status={s} rows={rows} onOpen={setOpenJob} />;
            })}
          </div>
        </DndContext>
      )}

      <Sheet open={!!openJob} onOpenChange={(o) => !o && setOpenJob(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {openJob?.job && (
            <>
              <SheetHeader>
                <SheetTitle>{openJob.job.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2 text-sm">
                <div>{openJob.job.company} · {openJob.job.location}</div>
                <Badge variant="outline" className="capitalize">{openJob.status}</Badge>
                <p className="text-muted-foreground whitespace-pre-wrap pt-3">{openJob.job.description}</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Column({ status, rows, onOpen }: { status: JobStatus; rows: Row[]; onOpen: (r: Row) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <Card ref={setNodeRef} className={`glass p-3 min-h-64 transition ${isOver ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold capitalize">{status}</div>
        <Badge variant="secondary">{rows.length}</Badge>
      </div>
      <div className="space-y-2">
        {rows.map((r) => <DraggableCard key={r.id} row={r} onOpen={() => onOpen(r)} />)}
      </div>
    </Card>
  );
}

function DraggableCard({ row, onOpen }: { row: Row; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: row.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      className={`glass rounded-lg p-3 cursor-grab active:cursor-grabbing text-sm ${isDragging ? "opacity-60" : ""}`}
    >
      <div className="font-medium truncate">{row.job?.title ?? "Untitled"}</div>
      <div className="text-xs text-muted-foreground truncate">{row.job?.company}</div>
      {row.match_score != null && <Badge variant="outline" className="mt-2 text-xs">{row.match_score}% match</Badge>}
    </div>
  );
}