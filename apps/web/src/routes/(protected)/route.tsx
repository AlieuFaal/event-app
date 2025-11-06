import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

let lastAuthCheckTime = 0;
const AUTH_CHECK_THROTTLE = 2000; // Don't show toast more than once every 2 seconds

export const Route = createFileRoute('/(protected)')({
    component: RouteComponent,
    beforeLoad: async ({ context, location, cause }) => {
        console.log('Protected route beforeLoad - context:', {
            IsAuthenticated: context.IsAuthenticated,
            hasCurrentUser: !!context.currentUser,
            currentUserId: context.currentUser?.id,
            cause
        });
        
        if (!context.IsAuthenticated || !context.currentUser) {
            const now = Date.now();
            const shouldShowToast = now - lastAuthCheckTime > AUTH_CHECK_THROTTLE;
            
            console.log('No authenticated user. Redirecting to /signin')
            
            if (shouldShowToast) {
                toast.error('You must be signed in to access this page.')
                lastAuthCheckTime = now;
            }
            
            throw redirect({to: "/signin", search: { redirect: location.href }})
        }
    }
})

function RouteComponent() {
    return <div>
        <Outlet />
    </div>
}
