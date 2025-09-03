import EventList from '@/components/event components/event-list'
import { getEventData } from '@/utils/event';
import { getUserData } from '@/utils/user';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events')({
    component: RouteComponent,
    loader: async () => {
        const events = await getEventData();
        const users = await getUserData();
        return {
            events,
            users,
        };
    }
})

function RouteComponent() {
    const { events, users } = Route.useLoaderData();
    return (
        <div className='p-15'>
            <EventList events={events} users={users} />
        </div>
    )
}
