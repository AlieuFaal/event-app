import EventList from '@/components/event-components/event-list'
import { getEventData, getEventsWithComments } from '@/utils/event';
import { getUserData } from '@/utils/user';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events')({
    component: RouteComponent,
    loader: async () => {
        const events = await getEventsWithComments();
        const users = await getUserData();
        return {
            events,
            users,
        };
    }
})

function RouteComponent() {
    const { events, users } = Route.useLoaderData();
    console.log("Events with comments:", events);
    return (
        <div className='p-15'>
            <EventList events={events} users={users} />
        </div>
    )
}
