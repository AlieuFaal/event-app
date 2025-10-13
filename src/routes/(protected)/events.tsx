import EventList from '@/components/event-components/event-list'
import EventPageHeader from '@/components/event-components/event-page-header';
import EventFilter from '@/components/event-components/filter';
import { useIsVisible } from '@/hooks/useIsVisible';
import { getEventsWithCommentsFn } from '@/services/eventService';
import { getUserDataFn } from '@/services/user-service';
import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useRef } from 'react';

export const Route = createFileRoute('/(protected)/events')({
    component: EventsComponent,
    loader: async (ctx) => {
        const currentUser = ctx.context.currentUser;
        const events = await getEventsWithCommentsFn();
        const users = await getUserDataFn();
        return { events, users, currentUser };
    }
})

function EventsComponent() {
    const { events, users, currentUser } = Route.useLoaderData();
    const [searchInput, setSearchInput] = useState('');
    const [genreFilteredEvents, setGenreFilteredEvents] = useState(events);

    const filteredEvents = useMemo(() => {
        const eventsToFilter = genreFilteredEvents;

        if (!searchInput.trim()) return eventsToFilter;

        const search = searchInput.toLowerCase();

        return eventsToFilter.filter((event) => {
            const creator = users.find((user) => user.id === event.userId);

            return (
                event.title.toLowerCase().includes(search) ||
                event.address.toLowerCase().includes(search) ||
                event.venue?.toLowerCase().includes(search) ||
                creator?.name.toLowerCase().includes(search)
            );
        });
    }, [genreFilteredEvents, users, searchInput]);

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    return (
        <>
            <div className={`transition-opacity ease-in duration-500 ${isVisible1 ? "opacity-100" : "opacity-0"} max-w-350 min-w-3xl mx-auto`} ref={ref1} >
                <div className=''>
                    <EventPageHeader searchInput={searchInput} onSearchChange={setSearchInput} />
                </div>
                <div className="flex justify-end relative top-28 right-12">
                    <EventFilter events={events} onFilterChange={setGenreFilteredEvents} />
                </div>
                <EventList events={filteredEvents} users={users} currentUser={currentUser}/>
            </div>
        </>
    )
}
