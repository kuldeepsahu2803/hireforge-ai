import { createFileRoute } from "@tanstack/react-router";
import { EntryList } from "@/components/EntryList";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TagInput } from "@/components/TagInput";
import type { Experience } from "@/types";

export const Route = createFileRoute("/_app/profile/experience")({ component: Page });

function Page() {
  return (
    <EntryList<Experience>
      table="experience"
      title="Experience"
      empty="Add your work and internship experience."
      newEntry={() => ({ user_id: "", company: "", title: "", location: null, start_date: null, end_date: null, is_current: false, description: null, achievements: [], tech_used: [] })}
      renderItem={(e) => (
        <div>
          <div className="font-medium">{e.title} @ {e.company}</div>
          <div className="text-sm text-muted-foreground">{e.location ?? ""} · {e.start_date ?? ""} → {e.is_current ? "Present" : (e.end_date ?? "")}</div>
        </div>
      )}
      renderForm={(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Company</Label><Input value={s.company ?? ""} onChange={(e) => set({ ...s, company: e.target.value })} /></div>
          <div><Label>Title</Label><Input value={s.title ?? ""} onChange={(e) => set({ ...s, title: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Location</Label><Input value={s.location ?? ""} onChange={(e) => set({ ...s, location: e.target.value })} /></div>
          <div><Label>Start date</Label><Input type="date" value={s.start_date ?? ""} onChange={(e) => set({ ...s, start_date: e.target.value || null })} /></div>
          <div><Label>End date</Label><Input type="date" disabled={!!s.is_current} value={s.end_date ?? ""} onChange={(e) => set({ ...s, end_date: e.target.value || null })} /></div>
          <div className="md:col-span-2 flex items-center gap-2"><Switch checked={!!s.is_current} onCheckedChange={(c) => set({ ...s, is_current: c, end_date: c ? null : s.end_date })} /><Label>I currently work here</Label></div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea rows={4} value={s.description ?? ""} onChange={(e) => set({ ...s, description: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Achievements</Label><TagInput value={s.achievements ?? []} onChange={(v) => set({ ...s, achievements: v })} placeholder="One bullet at a time" /></div>
          <div className="md:col-span-2"><Label>Tech used</Label><TagInput value={s.tech_used ?? []} onChange={(v) => set({ ...s, tech_used: v })} /></div>
        </div>
      )}
    />
  );
}