import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Briefcase, Sparkles, Search, FileText, ArrowRight, Zap, Target, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireForge AI — Find Jobs. Tailor Your Resume. Get Hired." },
      { name: "description", content: "AI-powered job hunter and resume tailor. Searches 8+ platforms, scores fit, and customizes your resume for every role." },
      { property: "og:title", content: "HireForge AI" },
      { property: "og:description", content: "Find Jobs. Tailor Your Resume. Get Hired." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_70%_20%,oklch(0.62_0.22_305/.6),transparent)]" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-6">
            <Sparkles className="size-3 text-primary" /> Powered by AI · ATS-Optimized
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Find Jobs. <span className="gradient-text">Tailor Your Resume.</span><br className="hidden md:block" /> Get Hired.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            HireForge AI scans 8+ job platforms daily, scores your fit for every role, and tailors your resume to beat ATS filters — automatically.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gradient-primary text-white border-0 shadow-[var(--shadow-glow)]">
              <Link to="/auth">Get Started Free <ArrowRight className="ml-1 size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/5">
              <a href="#how">How it works</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              ["8+", "Job Platforms"],
              ["AI", "Powered Matching"],
              ["ATS", "Optimized"],
              ["Daily", "Auto-Search"],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-xl p-4">
                <div className="text-2xl font-bold gradient-text">{n}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-6">
        {[
          { icon: Search, title: "AI Job Hunter", desc: "Continuously scans LinkedIn, Indeed, Wellfound and more. Ranks every job by fit using your master profile." },
          { icon: FileText, title: "AI Resume Tailor", desc: "Reads a job description, identifies gaps, rewrites your resume for keywords and impact, and returns an ATS score." },
        ].map(({ icon: I, title, desc }) => (
          <div key={title} className="glass rounded-2xl p-8 hover:translate-y-[-2px] transition">
            <div className="size-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
              <I className="size-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      {/* How */}
      <section id="how" className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { i: Briefcase, t: "Build Profile", d: "Add your education, experience, projects and skills once." },
            { i: Zap, t: "Search Jobs", d: "We find matching roles daily and score your fit." },
            { i: Target, t: "Tailor & Apply", d: "One-click tailoring with ATS analysis. Download & ship it." },
          ].map(({ i: I, t, d }, idx) => (
            <div key={t} className="glass rounded-2xl p-6 relative">
              <div className="absolute -top-3 -left-3 size-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                {idx + 1}
              </div>
              <I className="size-8 text-primary mb-3" />
              <h3 className="font-semibold">{t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="gradient-primary text-white border-0">
            <Link to="/auth">Start hunting smarter <RefreshCcw className="ml-2 size-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} HireForge AI
      </footer>
    </div>
  );
}
