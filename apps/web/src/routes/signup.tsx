import SignUp from '@/components/auth-components/sign-up'
import { getRedirectParamFromSearch, getSafeAuthRedirectTarget } from '@/lib/auth-redirect'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignUpComponent,
  beforeLoad: async ({ context, search }) => {
    // If user is already authenticated, redirect them away from signup
    if (context.IsAuthenticated && context.currentUser) {
      const safeRedirect = getSafeAuthRedirectTarget(
        getRedirectParamFromSearch(search),
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
