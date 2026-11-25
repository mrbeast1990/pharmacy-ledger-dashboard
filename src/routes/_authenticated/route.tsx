import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { checkOwnerAccess } from "@/lib/auth-access";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ context, location }) => {
    const access = await checkOwnerAccess();
    if (access === "anonymous") {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
    if (access === "unauthorized") {
      await context.queryClient.cancelQueries();
      context.queryClient.clear();
      await supabase.auth.signOut();
      throw redirect({
        to: "/auth",
        search: { redirect: location.href, reason: "unauthorized" },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
