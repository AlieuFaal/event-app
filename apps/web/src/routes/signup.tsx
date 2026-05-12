import SignUp from '@/components/auth-components/sign-up'
import { getSafeAuthRedirectTarget } from '@/lib/auth-redirect'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignUpComponent,
  beforeLoad: async ({ context, search }) => {
    // If user is already authenticated, redirect them away from signup
    if (context.IsAuthenticated && context.currentUser) {
      const hasRedirectTarget =
        typeof search === "object" && search !== null && "redirect" in search;

      if (hasRedirectTarget) {
        return;
      }

      const safeRedirect = getSafeAuthRedirectTarget(
        undefined,
      );
      throw redirect({ to: safeRedirect, replace: true });
    }
  },
})

function SignUpComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <SignUp />
    </div>
  )
}
