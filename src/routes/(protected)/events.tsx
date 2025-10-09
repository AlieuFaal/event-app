import EventList from '@/components/event-components/event-list'
import EventPageHeader from '@/components/event-components/event-page-header';
import { useIsVisible } from '@/hooks/useIsVisible';
import { getEventsWithCommentsFn } from '@/services/eventService';
import { getUserDataFn } from '@/services/user-service';
import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useRef } from 'react';

export const Route = createFileRoute('/(protected)/events')({
    component: EventsComponent,
    loader: async () => {
        const events = await getEventsWithCommentsFn();
        const users = await getUserDataFn();
        return { events, users };
    }
})

function EventsComponent() {
    const { events, users } = Route.useLoaderData();
    const [searchInput, setSearchInput] = useState('');

    const filteredEvents = useMemo(() => {
        if (!searchInput.trim()) return events;

        const search = searchInput.toLowerCase();

        return events.filter((event) => {
            const creator = users.find((user) => user.id === event.userId);

            return (
                event.title.toLowerCase().includes(search) ||
                event.address.toLowerCase().includes(search) ||
                event.venue?.toLowerCase().includes(search) ||
                creator?.name.toLowerCase().includes(search)
            );
        });
    }, [events, users, searchInput]);

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    return (
        <>
            <div className={`transition-opacity ease-in duration-500 ${isVisible1 ? "opacity-100" : "opacity-0"}`} ref={ref1} >
                <div className='max-w-350 min-w-3xl mx-auto'>
                    <EventPageHeader searchInput={searchInput} onSearchChange={setSearchInput} />
                    <EventList events={filteredEvents} users={users} />
                </div>
            </div>
        </>
    )
}
