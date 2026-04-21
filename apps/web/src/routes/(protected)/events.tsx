import EventList from '@/components/event-components/event-list'
import EventPageHeader from '@/components/event-components/event-page-header';
import EventFilter from '@/components/event-components/filter';
import { getEventsWithCommentsFn } from '@/services/eventService';
import { getUserDataFn } from '@/services/user-service';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react';

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

    useEffect(() => {
        setGenreFilteredEvents(events);
    }, [events]);

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
        <div className="relative mx-auto pb-16 pt">

            <div className="relative space-y-8 sm:space-y-10">
                <EventPageHeader
                    searchInput={searchInput}
                    onSearchChange={setSearchInput}
                    filterSlot={<EventFilter events={events} onFilterChange={setGenreFilteredEvents} />}
                    resultsCount={filteredEvents.length}
                />

                <div className='px-4 sm:px-6 lg:px-8'>
                    <EventList events={filteredEvents} users={users} currentUser={currentUser}/>
                </div>
            </div>
        </div>
    )
}
