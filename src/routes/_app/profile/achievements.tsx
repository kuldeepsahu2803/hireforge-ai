import { createFileRoute } from "@tanstack/react-router";
import { EntryList } from "@/components/EntryList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Achievement } from "@/types";

export const Route = createFileRoute("/_app/profile/achievements")({ component: Page });

const TYPES = ["hackathon", "award", "publication", "opensource", "volunteer"] as const;

function Page() {
  return (
    <EntryList<Achievement>
      table="achievements"
      title="Achievements"
      empty="Brag a little — hackathons, awards, OSS."
      newEntry={() => ({ user_id: "", title: "", description: null, type: null, date: null, url: null })}
      renderItem={(a) => (
        <div>
          <div className="font-medium">{a.title} {a.type ? <span className="text-xs text-muted-foreground">· {a.type}</span> : null}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">{a.description}</div>
        </div>
      )}
      renderForm={(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><Label>Title</Label><Input value={s.title ?? ""} onChange={(e) => set({ ...s, title: e.target.value })} /></div>
          <div>
            <Label>Type</Label>
            <Select value={s.type ?? ""} onValueChange={(v) => set({ ...s, type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Date</Label><Input type="date" value={s.date ?? ""} onChange={(e) => set({ ...s, date: e.target.value || null })} /></div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea rows={3} value={s.description ?? ""} onChange={(e) => set({ ...s, description: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>URL</Label><Input value={s.url ?? ""} onChange={(e) => set({ ...s, url: e.target.value })} /></div>
        </div>
      )}
    />
  );
}