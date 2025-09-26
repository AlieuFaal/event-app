import AccountContent from '@/components/accounts-components/accounts-content'
import AccountHeader from '@/components/accounts-components/accounts-header'
import { Card } from '@/components/shadcn/ui/card'
import { getUserEventsWithCommentsFn, getUserFavoriteEventsFn } from '@/services/eventService'
import { getFollowersFn, getFollowingFn, getUserDataByIdFn, isUserFollowingFn } from '@/services/user-service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_pathlessLayout/user/$id')({
    loader: async ({ params }) => {
        const user = await getUserDataByIdFn({ data: { id: params.id } });
        const events = await getUserEventsWithCommentsFn({ data: { userId: params.id } });
        const favoriteEvents = await getUserFavoriteEventsFn({ data: { userId: params.id } });
        const followersCount = await getFollowersFn({ data: { id: params.id } });
        const followingCount = await getFollowingFn({ data: { id: params.id } });
        const isFollowing = await isUserFollowingFn({ data: { id: params.id } });

        return {
            user,
            events,
            favoriteEvents,
            followersCount,
            followingCount,
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