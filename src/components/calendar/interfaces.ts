import type { TEventColor } from "@/components/calendar/types";
import { User } from "drizzle/db";

export interface IUser {
	id: string;
	name: string;
	picturePath: string | null;
}

export interface IEvent {
	id: string;
	startDate: string;
	endDate: string;
	title: string;
	color: TEventColor;
	description: string;
	user: User;
}

export interface ICalendarCell {
	day: number;
	currentMonth: boolean;
	date: Date;
}
