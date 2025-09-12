import React from "react";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider2 } from "@/components/calendar/contexts/calendar-context";
import { DndProvider } from "@/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { getCalendarEventData, getEventData } from "@/utils/eventService";
import { getUserData } from "@/utils/user-service";

async function getCalendarData() {
	return {
		events: await getEventData(),
		users: await getUserData(),
	};
}

export async function Calendar2() {
	// const { events, users } = await getCalendarData();

	return (
			<DndProvider showConfirmation={false}>
				<div className="w-full border rounded-xl">
					<CalendarHeader />
					<CalendarBody />
				</div>
			</DndProvider>
		// <CalendarProvider events={events} users={users} view="month">
		// </CalendarProvider>
	);
}
