import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { getMapEventsFn } from '@/services/eventService';
import { EventMap } from '@/components/map-components/eventMapComponent';
import { useRef } from 'react';
import { useIsVisible } from '@/hooks/useIsVisible';

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

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    return (
        <div ref={ref1} className={`transition-opacity ease-in duration-1200 ${isVisible1 ? "opacity-100" : "opacity-0"} max-w-450 min-w-sm mx-auto min-h-sm`}>
            <ClientOnly>
                <EventMap events={events} accessToken={accessToken} />
            </ClientOnly>
        </div>
    );
}