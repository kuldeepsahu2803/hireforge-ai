import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Download, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_app/tailor")({ component: Tailor });

function ScoreRing({ value, label }: { value: number; label: string }) {
  const c = 2 * Math.PI * 36;
  const off = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r="36" stroke="hsl(var(--border))" strokeWidth="8" fill="none" opacity="0.3" />
        <circle cx="50" cy="50" r="36" stroke="url(#g)" strokeWidth="8" fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
        <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="oklch(0.62 0.2 280)" /><stop offset="1" stopColor="oklch(0.62 0.22 305)" /></linearGradient></defs>
      </svg>
      <div className="-mt-16 text-2xl font-bold">{value}</div>
      <div className="mt-12 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Tailor() {
  const { user } = useAuth();
  const [jd, setJd] = useState("");
  const [jdUrl, setJdUrl] = useState("");
  const [useMaster, setUseMaster] = useState(true);
  const [tailored, setTailored] = useState<null | {
    before: number; after: number; missing: string[]; highlight: string[]; weak: string[];
    summary: string; experience: string; skills: string; projects: string;
  }>(null);
  const [busy, setBusy] = useState(false);

  const runTailor = async () => {
    if (!jd && !jdUrl) { toast.error("Paste a job description first."); return; }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setTailored({
      before: 58, after: 87,
      missing: ["GraphQL", "Apollo", "AWS Lambda"],
      highlight: ["React", "TypeScript", "Tailwind", "Testing"],
      weak: ["Summary lacks impact metrics", "Experience bullets are too generic"],
      summary: "Senior frontend engineer with 4+ years building accessible, performant React/TypeScript products at scale. Led migration to Next.js App Router cutting LCP 38%.",
      experience: "• Shipped redesigned checkout serving 12M MAU, lifting conversion 6.4%.\n• Reduced bundle size 41% by code-splitting and lazy-loading routes.",
      skills: "React, TypeScript, Next.js, TailwindCSS, Jest, Playwright, GraphQL (basic), CI/CD",
      projects: "• HireForge AI — AI job-tailoring platform (React + Supabase + LLM).",
    });
    toast.success("Tailored — review the right panel.");
    setBusy(false);
  };

  const saveHistory = async () => {
    if (!user || !tailored) return;
    const { error } = await supabase.from("tailored_resumes").insert({
      user_id: user.id,
      job_title: "Tailored role",
      company: "—",
      ats_score_before: tailored.before,
      ats_score_after: tailored.after,
      gap_analysis: { missing: tailored.missing, highlight: tailored.highlight, weak: tailored.weak },
      tailored_content: { summary: tailored.summary, experience: tailored.experience, skills: tailored.skills, projects: tailored.projects },
    });
    if (error) toast.error(error.message);
    else toast.success("Saved to history");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold">Resume Tailor</h1>
      <p className="text-muted-foreground text-sm mb-6">Match your master profile to any job in one click.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <Card className="glass p-5 space-y-5">
          <div>
            <Label className="mb-2 block font-semibold">Job description</Label>
            <Tabs defaultValue="paste">
              <TabsList><TabsTrigger value="paste">Paste</TabsTrigger><TabsTrigger value="upload">Upload PDF</TabsTrigger><TabsTrigger value="url">URL</TabsTrigger></TabsList>
              <TabsContent value="paste"><Textarea rows={8} placeholder="Paste the JD here…" value={jd} onChange={(e) => setJd(e.target.value)} /></TabsContent>
              <TabsContent value="upload"><Input type="file" accept="application/pdf" /></TabsContent>
              <TabsContent value="url"><Input placeholder="https://…" value={jdUrl} onChange={(e) => setJdUrl(e.target.value)} /></TabsContent>
            </Tabs>
          </div>

          <div>
            <Label className="mb-2 block font-semibold">Your resume</Label>
            <div className="flex items-center gap-3 mb-3">
              <Switch checked={useMaster} onCheckedChange={setUseMaster} />
              <span className="text-sm">Use Master Profile</span>
            </div>
            {!useMaster && (
              <div className="border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
                Drop resume PDF here or <Input type="file" accept="application/pdf" className="mt-2" />
              </div>
            )}
          </div>

          <Button onClick={runTailor} disabled={busy} className="w-full gradient-primary text-white border-0 h-12 text-base">
            {busy ? <Loader2 className="size-5 animate-spin" /> : <><Sparkles className="size-4 mr-2" />Tailor My Resume</>}
          </Button>
          <p className="text-xs text-muted-foreground text-center">AI tailoring will be powered by FastAPI backend — currently using a mock result.</p>
        </Card>

        {/* RIGHT */}
        <Card className="glass p-5">
          {!tailored ? (
            <div className="h-full min-h-80 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
              <Sparkles className="size-10 text-primary mb-3" />
              <div className="font-medium text-foreground">Your tailored output will appear here</div>
              <div className="text-sm mt-1">Paste a JD and hit "Tailor" to see ATS scoring & rewritten sections.</div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-around">
                <ScoreRing value={tailored.before} label="ATS Before" />
                <ScoreRing value={tailored.after} label="ATS After" />
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="text-xs font-semibold text-rose-300 mb-1">Missing keywords</div>
                  <div className="flex flex-wrap gap-1">{tailored.missing.map((s) => <Badge key={s} className="bg-rose-500/20 text-rose-300 border-0">{s}</Badge>)}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-300 mb-1">Skills to highlight</div>
                  <div className="flex flex-wrap gap-1">{tailored.highlight.map((s) => <Badge key={s} className="bg-emerald-500/20 text-emerald-300 border-0">{s}</Badge>)}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-300 mb-1">Weak sections</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">{tailored.weak.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              </div>

              <Accordion type="single" collapsible defaultValue="summary">
                <AccordionItem value="summary"><AccordionTrigger>Professional Summary</AccordionTrigger><AccordionContent className="whitespace-pre-wrap">{tailored.summary}</AccordionContent></AccordionItem>
                <AccordionItem value="exp"><AccordionTrigger>Experience</AccordionTrigger><AccordionContent className="whitespace-pre-wrap">{tailored.experience}</AccordionContent></AccordionItem>
                <AccordionItem value="skills"><AccordionTrigger>Skills</AccordionTrigger><AccordionContent className="whitespace-pre-wrap">{tailored.skills}</AccordionContent></AccordionItem>
                <AccordionItem value="proj"><AccordionTrigger>Projects</AccordionTrigger><AccordionContent className="whitespace-pre-wrap">{tailored.projects}</AccordionContent></AccordionItem>
              </Accordion>

              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/5" disabled><Download className="size-4 mr-1" />Download PDF</Button>
                <Button onClick={saveHistory} className="gradient-primary text-white border-0"><Save className="size-4 mr-1" />Save to history</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

