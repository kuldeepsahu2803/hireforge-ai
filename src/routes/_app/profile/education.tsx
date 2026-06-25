import { createFileRoute } from "@tanstack/react-router";
import { EntryList } from "@/components/EntryList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/TagInput";
import type { Education } from "@/types";

export const Route = createFileRoute("/_app/profile/education")({ component: Page });

function Page() {
  return (
    <EntryList<Education>
      table="education"
      title="Education"
      empty="No education yet. Add your most recent degree."
      newEntry={() => ({ user_id: "", degree: "", branch: "", institution: "", start_year: null as any, end_year: null as any, cgpa: null, relevant_coursework: [], achievements: [] })}
      renderItem={(e) => (
        <div>
          <div className="font-medium">{e.degree} {e.branch ? `· ${e.branch}` : ""}</div>
          <div className="text-sm text-muted-foreground">{e.institution} · {e.start_year ?? "?"}–{e.end_year ?? "Present"}</div>
          {e.cgpa && <div className="text-xs text-muted-foreground mt-1">CGPA: {e.cgpa}</div>}
        </div>
      )}
      renderForm={(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Degree</Label><Input value={s.degree ?? ""} onChange={(e) => set({ ...s, degree: e.target.value })} /></div>
          <div><Label>Branch</Label><Input value={s.branch ?? ""} onChange={(e) => set({ ...s, branch: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Institution</Label><Input value={s.institution ?? ""} onChange={(e) => set({ ...s, institution: e.target.value })} /></div>
          <div><Label>Start year</Label><Input type="number" value={s.start_year ?? ""} onChange={(e) => set({ ...s, start_year: e.target.value ? parseInt(e.target.value) : (null as any) })} /></div>
          <div><Label>End year</Label><Input type="number" value={s.end_year ?? ""} onChange={(e) => set({ ...s, end_year: e.target.value ? parseInt(e.target.value) : (null as any) })} /></div>
          <div><Label>CGPA / GPA</Label><Input value={s.cgpa ?? ""} onChange={(e) => set({ ...s, cgpa: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Relevant coursework</Label><TagInput value={s.relevant_coursework ?? []} onChange={(v) => set({ ...s, relevant_coursework: v })} /></div>
          <div className="md:col-span-2"><Label>Achievements</Label><TagInput value={s.achievements ?? []} onChange={(v) => set({ ...s, achievements: v })} /></div>
        </div>
      )}
    />
  );
}