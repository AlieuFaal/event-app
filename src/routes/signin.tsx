import SignIn from "../components/sign-in";
import { createFileRoute } from '@tanstack/react-router'
import { ThemeProvider } from "../components/Themeprovider"
import { ModeToggle } from '@/components/mode-toggle'

export const Route = createFileRoute('/signin')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
            <ModeToggle />
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
                <SignIn />
            </div>
        </ThemeProvider>
    )
}
