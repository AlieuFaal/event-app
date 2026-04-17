import SignUp from '@/components/auth-components/sign-up'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignUpComponent,
  beforeLoad: async ({ context, search }) => {
    // If user is already authenticated, redirect them away from signup
    if (context.IsAuthenticated && context.currentUser) {
      const redirectTo =
        typeof search === "object" &&
        search !== null &&
        "redirect" in search &&
        typeof search.redirect === "string"
          ? search.redirect
          : "/";
      const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";
      throw redirect({ to: safeRedirect });
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
