import { router } from '@/router'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/(protected)/_pathlessLayout')({
    component: RouteComponent,
    beforeLoad: async ({ context, location }) => {
        if (!context.IsAuthenticated && location.pathname !== '/signin') {
            console.log('No authenticated user. Redirecting to /signin')
            toast.error('You must be signed in to access this page.')
            router.navigate({ to: '/signin', search: { redirectTo: location.pathname } })
            return;
        }
    }
})

function RouteComponent() {
    return <div>
        <Outlet />
    </div>
}
