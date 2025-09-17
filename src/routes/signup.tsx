import SignUp from '@/components/auth-components/sign-up'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignUpComponent,
})

function SignUpComponent() {
    return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
                <SignUp />
            </div>
    )
}
