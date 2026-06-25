import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HireForge AI" },
      { name: "description", content: "Sign in or create your HireForge AI account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Account created!");
        navigate({ to: "/profile/personal" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) {
      toast.error(res.error.message ?? "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (res.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-extrabold gradient-text">HireForge AI</Link>
          <p className="text-sm text-muted-foreground mt-2">Your AI co-pilot for job hunting.</p>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "in" | "up")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="in">Sign in</TabsTrigger>
            <TabsTrigger value="up">Sign up</TabsTrigger>
          </TabsList>
          <form onSubmit={onSubmit} className="space-y-4 mt-6">
            <TabsContent value="up" className="m-0">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required={tab === "up"} placeholder="Ada Lovelace" />
            </TabsContent>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary text-white border-0">
              {loading ? <Loader2 className="size-4 animate-spin" /> : tab === "in" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </Tabs>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
        </div>
        <Button type="button" variant="outline" onClick={googleSignIn} disabled={loading} className="w-full bg-white/5">
          <svg className="size-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.65 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.95s2.63-5.95 5.85-5.95c1.84 0 3.07.78 3.77 1.45l2.58-2.48C16.6 3.95 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.18 0 8.6-3.63 8.6-8.75 0-.6-.08-1.05-.25-1.65Z"/></svg>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}