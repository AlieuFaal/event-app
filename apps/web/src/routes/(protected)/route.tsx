import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/(protected)')({
    component: RouteComponent,
    beforeLoad: async ({ context, location }) => {
        if (!context.IsAuthenticated) {
            console.log('No authenticated user. Redirecting to /signin')
            toast.error('You must be signed in to access this page.')
            throw redirect({to: "/signin"})
        }
    }
})

function RouteComponent() {
    return <div>
        <Outlet />
    </div>
}
