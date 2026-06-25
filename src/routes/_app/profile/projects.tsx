import { createFileRoute } from "@tanstack/react-router";
import { EntryList } from "@/components/EntryList";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/TagInput";
import type { Project } from "@/types";

export const Route = createFileRoute("/_app/profile/projects")({ component: Page });

function Page() {
  return (
    <EntryList<Project>
      table="projects"
      title="Projects"
      empty="Showcase the projects you're proud of."
      newEntry={() => ({ user_id: "", name: "", description: null, tech_stack: [], live_url: null, github_url: null, outcomes: null, tags: [] })}
      renderItem={(p) => (
        <div>
          <div className="font-medium">{p.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">{p.description}</div>
        </div>
      )}
      renderForm={(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><Label>Name</Label><Input value={s.name ?? ""} onChange={(e) => set({ ...s, name: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea rows={3} value={s.description ?? ""} onChange={(e) => set({ ...s, description: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Tech stack</Label><TagInput value={s.tech_stack ?? []} onChange={(v) => set({ ...s, tech_stack: v })} /></div>
          <div><Label>Live URL</Label><Input value={s.live_url ?? ""} onChange={(e) => set({ ...s, live_url: e.target.value })} /></div>
          <div><Label>GitHub URL</Label><Input value={s.github_url ?? ""} onChange={(e) => set({ ...s, github_url: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Outcomes</Label><Textarea rows={2} value={s.outcomes ?? ""} onChange={(e) => set({ ...s, outcomes: e.target.value })} placeholder="Reduced load time by 40%, 1k+ stars..." /></div>
          <div className="md:col-span-2"><Label>Tags</Label><TagInput value={s.tags ?? []} onChange={(v) => set({ ...s, tags: v })} /></div>
        </div>
      )}
    />
  );
}