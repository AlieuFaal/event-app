import { CalendarBody } from "@/components/calendar/calendar-body";
import { DndProvider } from "@/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { User } from "drizzle/db";

export function Calendar2(currentUser: User) {
	return (
			<DndProvider showConfirmation={false} currentUser={currentUser}>
				<div className="w-full border rounded-xl">
					<CalendarHeader />
					<CalendarBody />
				</div>
			</DndProvider>
	);
}
