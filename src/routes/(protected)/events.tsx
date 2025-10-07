import EventList from '@/components/event-components/event-list'
import EventPageHeader from '@/components/event-components/event-page-header';
import { getEventDataFn, getEventsWithCommentsFn } from '@/services/eventService';
import { getUserDataFn } from '@/services/user-service';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/events')({
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
        <>
            <EventPageHeader events={events} users={users}/>
            <EventList events={events} users={users} />
        </>
    )
}
