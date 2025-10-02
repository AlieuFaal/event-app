import ProfileContent from '@/components/profile-components/profile-content'
import ProfileHeader from '@/components/profile-components/profile-header'
import { Card } from '@/components/shadcn/ui/card'
import { Spinner } from '@/components/shadcn/ui/shadcn-io/spinner'
import { getContextFollowersFn, getContextFollowingFn, getCurrentUserFn } from '@/services/user-service'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/profile')({
    component: ProfileComponent,
    loader: async () => {
        const followersCount = await getContextFollowersFn();
        const followingCount = await getContextFollowingFn();
        const currentUser = await getCurrentUserFn();



        return { followersCount, followingCount, currentUser };
    }
})

function ProfileComponent() {
    const { followersCount, followingCount, currentUser } = Route.useLoaderData()
    return (
        <ClientOnly fallback={
            <div className='flex flex-col justify-center items-center h-screen'>
                <Spinner className='text-primary' variant='default' size={100} />
            </div>}>
            <Card className='w-full max-w-full bg-card text-card-foreground shadow-lg border-1 my-5'>
                <div className='mx-10 my-5'>
                    <ProfileHeader followersCount={followersCount} followingCount={followingCount} />
                    <ProfileContent currentUser={currentUser}/>
                </div>
            </Card>
        </ClientOnly>
    )
}