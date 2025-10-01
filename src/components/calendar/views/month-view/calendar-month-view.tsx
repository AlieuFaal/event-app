import { motion } from "framer-motion";
import { useMemo } from "react";
import {
	staggerContainer,
	transition,
} from "@/components/calendar/animations";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";

import {
	calculateMonthEventPositions,
	getCalendarCells,
} from "@/components/calendar/helpers";

import { DayCell } from "@/components/calendar/views/month-view/day-cell";
import { Event, User } from "drizzle/db";
import { m } from "@/paraglide/messages";

interface IProps {
	singleDayEvents: Event[];
	multiDayEvents: Event[];
	users: User[];
}

export function CalendarMonthView({ singleDayEvents, multiDayEvents, users }: IProps) {
	const { selectedDate } = useCalendar();

	const WEEK_DAYS = [
		m.calendar_weekday_mon(),
		m.calendar_weekday_tue(),
		m.calendar_weekday_wed(),
		m.calendar_weekday_thu(),
		m.calendar_weekday_fri(),
		m.calendar_weekday_sat(),
		m.calendar_weekday_sun(),
	];

	const allEvents = [...multiDayEvents, ...singleDayEvents];

	const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

	const eventPositions = useMemo(
		() =>
			calculateMonthEventPositions(
				multiDayEvents,
				singleDayEvents,
				selectedDate,
			),
		[multiDayEvents, singleDayEvents, selectedDate],
	);

	return (
		<motion.div initial="initial" animate="animate" variants={staggerContainer}>
			<div className="grid grid-cols-7">
				{WEEK_DAYS.map((day, index) => (
					<motion.div
						key={day}
						className="flex items-center justify-center py-2"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05, ...transition }}
					>
						<span className="text-xs font-medium text-t-quaternary">{day}</span>
					</motion.div>
				))}
			</div>

			<div className="grid grid-cols-7 overflow-hidden">
				{cells.map((cell, index) => (
					<DayCell
						key={index}
						cell={cell}
						events={allEvents}
						users={users}
						eventPositions={eventPositions}
					/>
				))}
			</div>
		</motion.div>
	);
}
