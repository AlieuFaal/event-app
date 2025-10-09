import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { getMapEventsFn } from '@/services/eventService';
import { EventMap } from '@/components/map-components/eventMapComponent';

export const Route = createFileRoute('/(protected)/event-map')({
    component: RouteComponent,
    loader: async () => {
        const events = await getMapEventsFn();
        return events;
    }
});

const accessToken = import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN;

function RouteComponent() {
    const events = Route.useLoaderData();

    return (
        <ClientOnly>
            <div className='max-w-450 min-w-sm mx-auto min-h-sm'>
                <EventMap events={events} accessToken={accessToken} />
            </div>
        </ClientOnly>
    );
}