import ProfileContent from '@/components/profile-components/profile-content'
import ProfileHeader from '@/components/profile-components/profile-header'
import { Card } from '@/components/shadcn/ui/card'
import { getContextFollowersFn, getContextFollowingFn, getFollowersFn, getFollowingFn } from '@/services/user-service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_pathlessLayout/profile')({
    component: ProfileComponent,
    loader: async () => {
        const followersCount = await getContextFollowersFn();
        const followingCount = await getContextFollowingFn();        
        
        return {followersCount, followingCount};
    }
})

function ProfileComponent() {
    const { followersCount, followingCount } = Route.useLoaderData()
    return (
        <Card className='w-full max-w-full bg-card text-card-foreground shadow-lg border-1 my-5'>
            <div className='mx-10 my-5'>
                <ProfileHeader followersCount={followersCount} followingCount={followingCount} />
                <ProfileContent />
            </div>
        </Card>
    )
}