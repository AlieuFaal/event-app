import EventList from '@/components/event-components/event-list'
import EventPageHeader from '@/components/event-components/event-page-header';
import EventFilter from '@/components/event-components/filter';
import { getEventsWithCommentsFn } from '@/services/eventService';
import { getUserDataFn } from '@/services/user-service';
import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react';

export const Route = createFileRoute('/(protected)/events')({
    component: EventsComponent,
    loader: async (ctx) => {
        const currentUser = ctx.context.currentUser;
        const [events, users] = await Promise.all([
            getEventsWithCommentsFn(),
            getUserDataFn(),
        ]);

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

    return (
        <>
            <div className="mx-auto">
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
