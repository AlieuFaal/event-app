import { createFileRoute } from '@tanstack/react-router';
import { getMapEventsFn } from '@/services/eventService';
import { useRef, Suspense, lazy } from 'react';
import { useIsVisible } from '@/hooks/useIsVisible';
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod';
import { Spinner } from '@/components/shadcn/ui/shadcn-io/spinner';

// Lazy load the EventMap component to avoid SSR issues with mapbox
const EventMap = lazy(() => 
    import('@/components/map-components/eventMapComponent').then(mod => ({ default: mod.EventMap }))
);

export const Route = createFileRoute('/(protected)/event-map')({
    component: RouteComponent,
    validateSearch: zodValidator(z.object({
        id: z.uuid().optional()
    })),
    loader: async () => {
        const events = await getMapEventsFn();
        return events;
    }
});

function RouteComponent() {
    const events = Route.useLoaderData();
    const accessToken = import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    return (
        <div ref={ref1} className={`transition-opacity ease-in duration-1200 ${isVisible1 ? "opacity-100" : "opacity-0"} max-w-450 min-w-sm mx-auto min-h-sm`}>
            <Suspense fallback={
                <div className="flex items-center justify-center h-screen">
                    <Spinner className="text-primary" size={200} variant='ring' />
                </div>
            }>
                <EventMap events={events} accessToken={accessToken} />
            </Suspense>
        </div>
    );
}