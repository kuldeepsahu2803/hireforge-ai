import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // Safety: never hang forever
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn("[useAuth] getUser timed out after 5s");
        setLoading(false);
      }
    }, 5000);

    const ensureProfile = async (u: { id: string; email?: string | null }) => {
      try {
        const { data: existing, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", u.id)
          .maybeSingle();
        if (error) {
          console.error("[useAuth] profile lookup failed", error);
          return;
        }
        if (!existing) {
          const { error: insErr } = await supabase
            .from("profiles")
            .insert({ id: u.id, email: u.email ?? "" });
          if (insErr) console.error("[useAuth] fallback profile insert failed", insErr);
        }
      } catch (e) {
        console.error("[useAuth] ensureProfile error", e);
      }
    };

    supabase.auth
      .getUser()
      .then(async ({ data }) => {
        if (!mounted) return;
        const u = data.user ?? null;
        setUser(u);
        if (u) await ensureProfile({ id: u.id, email: u.email });
      })
      .catch((e) => console.error("[useAuth] getUser failed", e))
      .finally(() => {
        if (mounted) {
          clearTimeout(timeout);
          setLoading(false);
        }
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) void ensureProfile({ id: u.id, email: u.email });
    });
    return () => {
      mounted = false;
      clearTimeout(timeout);
      sub.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return { user, loading };
}