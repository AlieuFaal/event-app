import SignIn from '@/components/auth-components/sign-in'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <div className="flex min-h-screen flex-col items-center justify-center px-6">
                <SignIn />
            </div>
        </div>
    )
}
