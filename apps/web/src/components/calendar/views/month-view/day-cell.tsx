"use client";

import type { Event, User } from "@vibespot/database/schema";
import { cva } from "class-variance-authority";
import { isMonday, isSameDay, isSameMonth, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";
import { transition } from "@/components/calendar/animations";
import { EventListDialog } from "@/components/calendar/dialogs/events-list-dialog";
import { DroppableArea } from "@/components/calendar/dnd/droppable-area";
import { getMonthCellEvents } from "@/components/calendar/helpers";
import { useMediaQuery } from "@/components/calendar/hooks";
import type { ICalendarCell } from "@/components/calendar/interfaces";
import { EventBullet } from "@/components/calendar/views/month-view/event-bullet";
import { MonthEventBadge } from "@/components/calendar/views/month-view/month-event-badge";
import { Button } from "@/components/shadcn/ui/button";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { AddEditEventDialog } from "../../dialogs/add-edit-event-dialog";

interface IProps {
	cell: ICalendarCell;
	users: User[];
	events: Event[];
	eventPositions: Record<string, number>;
	currentUser?: User | null;
}

export const dayCellVariants = cva("text-white", {
	variants: {
		color: {
			Blue: "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 ",
			Green:
				"bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400",
			Red: "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400",
			Yellow:
				"bg-yellow-600 dark:bg-yellow-500 hover:bg-yellow-700 dark:hover:bg-yellow-400",
			Purple:
				"bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-400",
			Orange:
				"bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-400",
			gray: "bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-400",
		},
	},
	defaultVariants: {
		color: "Blue",
	},
});

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({
	cell,
	events,
	eventPositions,
	users,
	currentUser,
}: IProps) {
	const { day, currentMonth, date } = cell;
	const isMobile = useMediaQuery("(max-width: 768px)");

	const { cellEvents, currentCellMonth } = useMemo(() => {
		const cellEvents = getMonthCellEvents(date, events, eventPositions);
		const currentCellMonth = startOfDay(
			new Date(date.getFullYear(), date.getMonth(), 1),
		);
		return { cellEvents, currentCellMonth };
	}, [date, events, eventPositions]);

	const renderEventAtPosition = useCallback(
		(position: number) => {
			const event = cellEvents.find((e) => e.position === position);
			if (!event) {
				return (
					<motion.div
						key={`empty-${position}`}
						className="lg:flex-1"
						initial={false}
						animate={false}
					/>
				);
			}
			const showBullet = isSameMonth(
				new Date(event.startDate),
				currentCellMonth,
			);

			return (
				<motion.div
					key={`event-${event.id}-${position}`}
					className="lg:flex-1"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: position * 0.1, ...transition }}
				>
					{showBullet && (
						<EventBullet className="lg:hidden" color={event.color} />
					)}
					<MonthEventBadge
						className="hidden lg:flex"
						event={event}
						users={users}
						cellDate={startOfDay(date)}
					/>
				</motion.div>
			);
		},
		[cellEvents, currentCellMonth, date, users],
	);

	const showMoreCount = cellEvents.length - MAX_VISIBLE_EVENTS;

	const showMobileMore = isMobile && currentMonth && showMoreCount > 0;
	const showDesktopMore = !isMobile && currentMonth && showMoreCount > 0;

	const cellContent = useMemo(
		() => (
			<motion.div
				className={cn(
					"flex h-full flex-col gap-1 border-t border-l lg:min-h-[10rem]",
					isMonday(date) && "border-l-0",
				)}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={transition}
			>
				<DroppableArea date={date} className="h-full w-full py-2">
					<motion.span
						className={cn(
							"h-6 px-1 font-semibold text-xs lg:px-2",
							!currentMonth && "opacity-20",
							isSameDay(startOfDay(date), startOfDay(new Date())) &&
								"flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary px-0 font-bold text-primary-foreground",
						)}
					>
						{day}
					</motion.span>

					<motion.div
						className={cn(
							"mt-1 flex h-fit gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0",
							!currentMonth && "opacity-50",
						)}
					>
						{cellEvents.length === 0 && !isMobile ? (
							<div className="group flex h-full w-full items-center justify-center">
								{currentUser?.role !== "user" && (
									<AddEditEventDialog startDate={date}>
										<Button
											variant="ghost"
											className="border opacity-0 transition-opacity duration-200 group-hover:opacity-100"
										>
											<Plus className="h-4 w-4" />
											<span className="max-sm:hidden">
												{m.calendar_add_event()}
											</span>
										</Button>
									</AddEditEventDialog>
								)}
							</div>
						) : (
							[0, 1, 2].map(renderEventAtPosition)
						)}
					</motion.div>

					{showMobileMore && (
						<div className="mx-2 flex items-end justify-end">
							<span className="font-semibold text-[0.6rem] text-accent-foreground">
								+{showMoreCount}
							</span>
						</div>
					)}

					{showDesktopMore && (
						<motion.div
							className={cn(
								"my-2 h-4.5 px-1.5 text-end font-semibold text-muted-foreground text-xs",
								!currentMonth && "opacity-50",
							)}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, ...transition }}
						>
							<EventListDialog users={users} date={date} events={cellEvents} />
						</motion.div>
					)}
				</DroppableArea>
			</motion.div>
		),
		[
			date,
			day,
			currentMonth,
			cellEvents,
			showMobileMore,
			showDesktopMore,
			showMoreCount,
			renderEventAtPosition,
			users,
			isMobile,
			currentUser?.role,
		],
	);

	if (isMobile && currentMonth) {
		return (
			<EventListDialog users={users} date={date} events={cellEvents}>
				{cellContent}
			</EventListDialog>
		);
	}

	return cellContent;
}
