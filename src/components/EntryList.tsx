import { useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { computeCompleteness } from "@/lib/completeness";
import type { Database } from "@/integrations/supabase/types";

type ListTable = "education" | "experience" | "projects" | "certifications" | "achievements";

export function EntryList<T extends { id: string }>({
  table,
  title,
  empty,
  renderItem,
  newEntry,
  renderForm,
}: {
  table: ListTable;
  title: string;
  empty: string;
  renderItem: (item: T) => ReactNode;
  newEntry: () => Partial<T>;
  renderForm: (state: Partial<T>, set: (next: Partial<T>) => void) => ReactNode;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState<Partial<T> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [table, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await (supabase.from(table) as any).select("*").eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: [table] });
    if (user) await computeCompleteness(user.id);
    await qc.invalidateQueries({ queryKey: ["completeness"] });
  };

  const saveMut = useMutation({
    mutationFn: async (payload: { entry: Partial<T>; id?: string }) => {
      if (!user) throw new Error("No user");
      if (payload.id) {
        const { error } = await (supabase.from(table) as any).update(payload.entry).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from(table) as any).insert({ ...payload.entry, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: async () => { await refresh(); toast.success("Saved"); setEditing(null); setCreating(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from(table) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => { await refresh(); toast.success("Deleted"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <Card className="glass p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <Dialog open={!!creating} onOpenChange={(o) => setCreating(o ? newEntry() : null)}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-white border-0"><Plus className="size-4 mr-1" />Add</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add {title.slice(0, -1)}</DialogTitle></DialogHeader>
            {creating && renderForm(creating, setCreating)}
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreating(null)}>Cancel</Button>
              <Button disabled={saveMut.isPending} onClick={() => creating && saveMut.mutate({ entry: creating as Partial<T> })} className="gradient-primary text-white border-0">
                {saveMut.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Loader2 className="size-5 animate-spin text-primary" />
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item) => (
            <li key={item.id} className="glass rounded-lg p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">{renderItem(item)}</div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => setEditing(item)}><Pencil className="size-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this entry?")) delMut.mutate(item.id); }}><Trash2 className="size-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit {title.slice(0, -1)}</DialogTitle></DialogHeader>
          {editing && renderForm(editing as Partial<T>, (next) => setEditing({ ...editing, ...(next as object) } as T))}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={saveMut.isPending} onClick={() => {
              if (!editing) return;
              const { id, ...rest } = editing as any;
              saveMut.mutate({ entry: rest, id });
            }} className="gradient-primary text-white border-0">
              {saveMut.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// silence unused import in some configs
export type _DbType = Database;