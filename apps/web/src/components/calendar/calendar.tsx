import type { User } from "@vibespot/database/schema";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { DndProvider } from "@/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";

interface calendar2Props {
	currentUser?: User | null;
}

export function Calendar2({ currentUser }: calendar2Props) {
	return (
		<DndProvider showConfirmation={false} currentUser={currentUser}>
			<div className="w-full rounded-xl border">
				<CalendarHeader currentUser={currentUser} />
				<CalendarBody currentUser={currentUser} />
			</div>
		</DndProvider>
	);
}
