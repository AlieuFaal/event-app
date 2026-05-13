import { createFileRoute } from "@tanstack/react-router";
import { Calendar2 } from "@/components/calendar/calendar";
import { CalendarProvider2 } from "@/components/calendar/contexts/calendar-context";
import { getEventDataFn } from "@/services/eventService";
import { getUserDataFn } from "@/services/user-service";

export const Route = createFileRoute("/(protected)/event-calendar")({
	component: EventCalendarComponent,
	loader: async (ctx) => {
		const [events, users] = await Promise.all([
			getEventDataFn(),
			getUserDataFn(),
		]);
		const currentUser = ctx.context.currentUser;
		return {
			events,
			users,
			currentUser,
		};
	},
});

function EventCalendarComponent() {
	const { events, users, currentUser } = Route.useLoaderData();

	return (
		<div className="mx-auto bg-muted/30 p-4 dark:bg-accent/10">
			<CalendarProvider2 events={events} users={users} view="month">
				<Calendar2 currentUser={currentUser} />
			</CalendarProvider2>
		</div>
	);
}
