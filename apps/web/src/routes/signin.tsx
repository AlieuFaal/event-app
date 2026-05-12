import SignIn from '@/components/auth-components/sign-in'
import { getSafeAuthRedirectTarget } from '@/lib/auth-redirect'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
    component: SignInComponent,
    beforeLoad: async ({ context, search }) => {
        // If user is already authenticated, redirect them away from signin
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

function SignInComponent() {
    const search = Route.useSearch();
    const redirectTo = getSafeAuthRedirectTarget(
        typeof search === "object" && search !== null && "redirect" in search
            ? search.redirect
            : undefined,
    );

    return (
        <div>
            <div className="flex min-h-screen flex-col items-center justify-center px-6">
                <SignIn redirectTo={redirectTo} />
            </div>
        </div>
    )
}
