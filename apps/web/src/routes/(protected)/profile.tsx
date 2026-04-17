import ProfileContent from '@/components/profile-components/profile-content'
import ProfileHeader from '@/components/profile-components/profile-header'
import { Card } from '@/components/shadcn/ui/card'
import { Spinner } from '@/components/shadcn/ui/shadcn-io/spinner'
import { getContextFollowersFn, getContextFollowingFn, getCurrentUserFn } from '@/services/user-service'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/profile')({
    component: ProfileComponent,
    loader: async () => {
        const [followersCount, followingCount, currentUser] = await Promise.all([
            getContextFollowersFn(),
            getContextFollowingFn(),
            getCurrentUserFn(),
        ]);

        return { followersCount, followingCount, currentUser };
    }
})

function ProfileComponent() {
    const { followersCount, followingCount, currentUser } = Route.useLoaderData()

    if (!currentUser) {
        return (
            <div className='flex flex-col justify-center items-center h-screen'>
                <Spinner className='text-primary' variant='default' size={100} />
            </div>
        )
    }

    return (
        <ClientOnly fallback={
            <div className='flex flex-col justify-center items-center h-screen'>
                <Spinner className='text-primary' variant='default' size={100} />
            </div>}>
            <Card className='bg-card text-card-foreground shadow-lg border-1 my-5 w-5/6 mx-auto min-w-sm'>
                <div className='mx-10 my-5'>
                    <ProfileHeader
                        followersCount={followersCount}
                        followingCount={followingCount}
                        currentUser={currentUser}
                    />
                    <ProfileContent currentUser={currentUser}/>
                </div>
            </Card>
        </ClientOnly>
    )
}
