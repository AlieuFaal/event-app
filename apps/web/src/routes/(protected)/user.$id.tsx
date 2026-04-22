import AccountContent from '@/components/accounts-components/accounts-content'
import AccountHeader from '@/components/accounts-components/accounts-header'
import { Card } from '@/components/shadcn/ui/card'
import { getUserEventsWithCommentsFn, getUserFavoriteEventsFn } from '@/services/eventService'
import { getFollowersFn, getFollowingFn, getUserDataByIdFn, isUserFollowingFn } from '@/services/user-service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/user/$id')({
    loader: async ({ params }) => {
        const [user, events, favoriteEvents, followersData, followingData, isFollowing] = await Promise.all([
            getUserDataByIdFn({ data: { id: params.id } }),
            getUserEventsWithCommentsFn({ data: { userId: params.id } }),
            getUserFavoriteEventsFn({ data: { userId: params.id } }),
            getFollowersFn({ data: { id: params.id } }),
            getFollowingFn({ data: { id: params.id } }),
            isUserFollowingFn({ data: { id: params.id } }),
        ]);

        return {
            user,
            events,
            favoriteEvents,
            followersCount: followersData.followerCount,
            followingCount: followingData.followingCount,
            followers: followersData.followers,
            following: followingData.following,
            isFollowing,
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const { events, user, favoriteEvents, followersCount, followingCount, isFollowing } = Route.useLoaderData()

    if (!user) {
        return <div>User not found...</div>
    }

    return (
        <div>
            <Card className='w-full max-w-full bg-card text-card-foreground shadow-lg border-1 my-5'>
                <div className='mx-10 my-5'>
                    <AccountHeader user={user} followersCount={followersCount} followingCount={followingCount} isFollowing={isFollowing} />
                    <AccountContent userId={id} user={user} events={events} favoriteEvents={favoriteEvents} />
                </div>
            </Card>
        </div>
    )
}
