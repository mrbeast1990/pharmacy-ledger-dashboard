import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
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
