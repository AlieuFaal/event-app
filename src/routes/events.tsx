import EventList from '@/components/event-components/event-list'
import { getEventDataFn, getEventsWithCommentsFn } from '@/utils/eventService';
import { getUserDataFn } from '@/utils/user-service';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events')({
    component: EventsComponent,
    loader: async () => {
        const events = await getEventsWithCommentsFn();
        const users = await getUserDataFn();
        return {
            events,
            users,
        };
    }
})

function EventsComponent() {
    const { events, users } = Route.useLoaderData();
    console.log("Events with comments:", events);
    return (
        <div className='p-15'>
            <EventList events={events} users={users} />
        </div>
    )
}
