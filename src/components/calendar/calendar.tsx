import { CalendarBody } from "@/components/calendar/calendar-body";
import { DndProvider } from "@/components/calendar/contexts/dnd-context";
import { CalendarHeader } from "@/components/calendar/header/calendar-header";
import { User } from "drizzle/db";

interface calendar2Props
{
	currentUser?: User | null;
}

export function Calendar2({currentUser}: calendar2Props) {
	return (
			<DndProvider showConfirmation={false} currentUser={currentUser}>
				<div className="w-full border rounded-xl">
					<CalendarHeader currentUser={currentUser}/>
					<CalendarBody currentUser={currentUser} />
				</div>
			</DndProvider>
	);
}
