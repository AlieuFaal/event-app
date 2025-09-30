import SignIn from '@/components/auth-components/sign-in'
import { getServerMessage } from '@/services/get-server-message'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
    component: SignInComponent,
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
