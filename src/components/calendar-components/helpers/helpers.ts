import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	differenceInDays,
	differenceInMinutes,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	endOfYear,
	format,
	isSameDay,
	isSameMonth,
	isSameWeek,
	isSameYear,
	isValid,
	parseISO,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subDays,
	subMonths,
	subWeeks,
	subYears,
} from "date-fns";
import type {
    CalendarView,
	EventColor,
} from "../types/types";

const FORMAT_STRING = "MMM d, yyyy";

export function rangeText(view: CalendarView, date: Date): string {
    let start: Date;
    let end: Date;

    switch (view) {
        case "month":
            start = startOfMonth(date);
            end = endOfMonth(date);
            break;
        case "week":
            start = startOfWeek(date);
            end = endOfWeek(date);
            break;
        case "day":
            return format(date, FORMAT_STRING);
        case "year":
            start = startOfYear(date);
            end = endOfYear(date);
            break;
        case "list":
            start = startOfMonth(date);
            end = endOfMonth(date);
            break;
        default:
            return "Error while formatting";
    }

    return `${format(start, FORMAT_STRING)} - ${format(end, FORMAT_STRING)}`;
}

export function navigateDate(
    date: Date,
    view: CalendarView,
    direction: "previous" | "next",
): Date {
    const operations: Record<CalendarView, (d: Date, n: number) => Date> = {
        month: direction === "next" ? addMonths : subMonths,
        week: direction === "next" ? addWeeks : subWeeks,
        day: direction === "next" ? addDays : subDays,
        year: direction === "next" ? addYears : subYears,
        list: direction === "next" ? addMonths : subMonths,
    };

    return operations[view](date, 1);
}

