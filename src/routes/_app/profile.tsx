import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { User, GraduationCap, Briefcase, FolderGit2, Wrench, Award, Trophy } from "lucide-react";

const SECTIONS = [
  { to: "/profile/personal", label: "Personal", icon: User },
  { to: "/profile/education", label: "Education", icon: GraduationCap },
  { to: "/profile/experience", label: "Experience", icon: Briefcase },
  { to: "/profile/projects", label: "Projects", icon: FolderGit2 },
  { to: "/profile/skills", label: "Skills", icon: Wrench },
  { to: "/profile/certifications", label: "Certifications", icon: Award },
  { to: "/profile/achievements", label: "Achievements", icon: Trophy },
] as const;

export const Route = createFileRoute("/_app/profile")({
  component: ProfileLayout,
});

function ProfileLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (pathname === "/profile") navigate({ to: "/profile/personal", replace: true });
  }, [pathname, navigate]);

  const { data: completeness } = useQuery({
    queryKey: ["completeness", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("completeness_score").eq("id", user!.id).maybeSingle();
      return data?.completeness_score ?? 0;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Master Profile</h1>
        <p className="text-muted-foreground mt-1">One profile, infinite tailored resumes.</p>
        <div className="mt-4 max-w-md">
          <div className="flex justify-between text-xs mb-1"><span>Completeness</span><span>{completeness ?? 0}%</span></div>
          <Progress value={completeness ?? 0} />
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <Card className="glass p-2 h-fit md:sticky md:top-20">
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = pathname === s.to || pathname.startsWith(s.to + "/");
              return (
                <Link key={s.to} to={s.to} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm whitespace-nowrap ${active ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-white/5"}`}>
                  <Icon className="size-4" /> {s.label}
                </Link>
              );
            })}
          </nav>
        </Card>
        <div><Outlet /></div>
      </div>
    </div>
  );
}