import {
	differenceInDays,
	endOfDay,
	isWithinInterval,
	startOfDay,
} from "date-fns";
import { MonthEventBadge } from "@/components/calendar/views/month-view/month-event-badge";
import { Event, User } from "drizzle/db";

interface IProps {
	selectedDate: Date;
	multiDayEvents: Event[];
	users: User[];
}

export function DayViewMultiDayEventsRow({
	selectedDate,
	multiDayEvents,
	users
}: IProps) {
	const dayStart = startOfDay(selectedDate);
	const dayEnd = endOfDay(selectedDate);

	const multiDayEventsInDay = multiDayEvents
		.filter((event) => {
			const eventStart = (event.startDate);
			const eventEnd = (event.endDate);

			return (
				isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
				isWithinInterval(dayEnd, { start: eventStart, end: eventEnd }) ||
				(eventStart <= dayStart && eventEnd >= dayEnd)
			);
		})
		.sort((a, b) => {
			const durationA = differenceInDays(
				(a.endDate),
				(a.startDate),
			);
			const durationB = differenceInDays(
				(b.endDate),
				(b.startDate),
			);
			return durationB - durationA;
		});

	if (multiDayEventsInDay.length === 0) return null;

	return (
		<div className="flex border-b">
			<div className="w-18"></div>
			<div className="flex flex-1 flex-col gap-1 border-l py-1">
				{multiDayEventsInDay.map((event) => {
					const eventStart = startOfDay((event.startDate));
					const eventEnd = startOfDay((event.endDate));
					const currentDate = startOfDay(selectedDate);

					const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1;
					const eventCurrentDay = differenceInDays(currentDate, eventStart) + 1;

					return (
						<MonthEventBadge
							key={event.id}
							event={event}
							users={users}
							cellDate={selectedDate}
							eventCurrentDay={eventCurrentDay}
							eventTotalDays={eventTotalDays}
						/>
					);
				})}
			</div>
		</div>
	);
}
