import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { lazy, Suspense } from "react";
import { z } from "zod";
import { Spinner } from "@/components/shadcn/ui/shadcn-io/spinner";
import { getMapEventsFn } from "@/services/eventService";

// Lazy load the EventMap component to avoid SSR issues with mapbox
const EventMap = lazy(() =>
	import("@/components/map-components/eventMapComponent").then((mod) => ({
		default: mod.EventMap,
	})),
);

export const Route = createFileRoute("/(protected)/event-map")({
	component: RouteComponent,
	validateSearch: zodValidator(
		z.object({
			id: z.uuid().optional(),
		}),
	),
	loader: async () => {
		const events = await getMapEventsFn();
		return events;
	},
});

function RouteComponent() {
	const events = Route.useLoaderData();
	const accessToken = import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN;

	return (
		<div className="mx-auto min-h-sm min-w-sm">
			<Suspense
				fallback={
					<div className="flex h-screen items-center justify-center">
						<Spinner className="text-primary" size={200} variant="ring" />
					</div>
				}
			>
				<EventMap events={events} accessToken={accessToken} />
			</Suspense>
		</div>
	);
}
