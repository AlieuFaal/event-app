import SignIn from '@/components/auth-components/sign-in'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
    component: SignInComponent,
    beforeLoad: async ({ context, search }) => {
        // If user is already authenticated, redirect them away from signin
        if (context.IsAuthenticated && context.currentUser) {
            const redirectTo = (search as any)?.redirect || '/';
            throw redirect({ to: redirectTo });
        }
    },
})

function SignInComponent() {
    return (
        <div>
            <div className="flex min-h-screen flex-col items-center justify-center px-6">
                <SignIn />
            </div>
        </div>
    )
}
