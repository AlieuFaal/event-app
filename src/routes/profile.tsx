import ProfileContent from '@/components/profile-components/profile-content'
import ProfileHeader from '@/components/profile-components/profile-header'
import { Card } from '@/components/shadcn/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Card className='w-full max-w-full bg-card text-card-foreground shadow-lg border-1 my-5'>
            <div className='mx-10 my-5'>
                <ProfileHeader />
                <ProfileContent />
            </div>
        </Card>
    )
}
