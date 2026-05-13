import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSafeAuthRedirectTarget } from "@/lib/auth-redirect";

export const Route = createFileRoute("/(protected)")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    if (!context.IsAuthenticated || !context.currentUser) {
      throw redirect({
        to: "/signin",
        search: { redirect: getSafeAuthRedirectTarget(location.href) },
        replace: true,
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
