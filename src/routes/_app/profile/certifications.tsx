import { createFileRoute } from "@tanstack/react-router";
import { EntryList } from "@/components/EntryList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/TagInput";
import type { Certification } from "@/types";

export const Route = createFileRoute("/_app/profile/certifications")({ component: Page });

function Page() {
  return (
    <EntryList<Certification>
      table="certifications"
      title="Certifications"
      empty="No certifications yet."
      newEntry={() => ({ user_id: "", name: "", issuer: null, issued_date: null, credential_url: null, tags: [] })}
      renderItem={(c) => (
        <div>
          <div className="font-medium">{c.name}</div>
          <div className="text-sm text-muted-foreground">{c.issuer ?? ""} {c.issued_date ? `· ${c.issued_date}` : ""}</div>
        </div>
      )}
      renderForm={(s, set) => (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><Label>Name</Label><Input value={s.name ?? ""} onChange={(e) => set({ ...s, name: e.target.value })} /></div>
          <div><Label>Issuer</Label><Input value={s.issuer ?? ""} onChange={(e) => set({ ...s, issuer: e.target.value })} /></div>
          <div><Label>Issued date</Label><Input type="date" value={s.issued_date ?? ""} onChange={(e) => set({ ...s, issued_date: e.target.value || null })} /></div>
          <div className="md:col-span-2"><Label>Credential URL</Label><Input value={s.credential_url ?? ""} onChange={(e) => set({ ...s, credential_url: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Tags</Label><TagInput value={s.tags ?? []} onChange={(v) => set({ ...s, tags: v })} /></div>
        </div>
      )}
    />
  );
}