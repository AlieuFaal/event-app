import { ModeToggle } from '@/components/mode-toggle'
import SignUp from '@/components/sign-up'
import { ThemeProvider } from '@/components/Themeprovider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
            <ModeToggle />
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
                <SignUp />
            </div>
        </ThemeProvider>
    )
}
