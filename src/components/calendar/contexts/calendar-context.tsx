"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "@/components/calendar/hooks";
import { CalendarEvent, deleteEventData, Event, postCalendarEventData, postEventData, putEventData } from "@/utils/event";
import type {
	TCalendarView,
	TEventColor,
} from "@/components/calendar/types";
import { User } from "better-auth";
import { authClient } from "@/lib/auth-client";
import { TEventFormData } from "../schemas";

interface ICalendarContext {
	selectedDate: Date;
	view: TCalendarView;
	setView: (view: TCalendarView) => void;
	agendaModeGroupBy: "date" | "color";
	setAgendaModeGroupBy: (groupBy: "date" | "color") => void;
	use24HourFormat: boolean;
	toggleTimeFormat: () => void;
	setSelectedDate: (date: Date | undefined) => void;
	selectedUserId: User["id"] | "all";
	setSelectedUserId: (userId: User["id"] | "all") => void;
	badgeVariant: "dot" | "colored";
	setBadgeVariant: (variant: "dot" | "colored") => void;
	selectedColors: TEventColor[];
	filterEventsBySelectedColors: (colors: TEventColor) => void;
	filterEventsBySelectedUser: (userId: User["id"] | "all") => void;
	users: User[];
	events: Event[];
	addEvent: (event: TEventFormData) => void;
	updateEvent: (event: TEventFormData) => void;
	removeEvent: (eventId: string) => void;
	clearFilter: () => void;
}

interface CalendarSettings {
	badgeVariant: "dot" | "colored";
	view: TCalendarView;
	use24HourFormat: boolean;
	agendaModeGroupBy: "date" | "color";
}

const DEFAULT_SETTINGS: CalendarSettings = {
	badgeVariant: "colored",
	view: "day",
	use24HourFormat: true,
	agendaModeGroupBy: "date",
};

const CalendarContext = createContext({} as ICalendarContext);

export function CalendarProvider2({
	children,
	users,
	events,
	badge = "colored",
	view = "day",
}: {
	children: React.ReactNode;
	users: User[];
	events: Event[];
	view?: TCalendarView;
	badge?: "dot" | "colored";
}) {
	const [settings, setSettings] = useLocalStorage<CalendarSettings>(
		"calendar-settings",
		{
			...DEFAULT_SETTINGS,
			badgeVariant: badge,
			view: view,
		},
	);

	const [badgeVariant, setBadgeVariantState] = useState<"dot" | "colored">(
		settings.badgeVariant,
	);
	const [currentView, setCurrentViewState] = useState<TCalendarView>(
		settings.view,
	);
	const [use24HourFormat, setUse24HourFormatState] = useState<boolean>(
		settings.use24HourFormat,
	);
	const [agendaModeGroupBy, setAgendaModeGroupByState] = useState<
		"date" | "color"
	>(settings.agendaModeGroupBy);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedUserId, setSelectedUserId] = useState<User["id"] | "all">(
		"all",
	);
	const [selectedColors, setSelectedColors] = useState<TEventColor[]>([]);

	const [allEvents, setAllEvents] = useState<Event[]>(events || []);
	const [filteredEvents, setFilteredEvents] = useState<Event[]>(events || []);

	const updateSettings = (newPartialSettings: Partial<CalendarSettings>) => {
		setSettings({
			...settings,
			...newPartialSettings,
		});
	};

	const setBadgeVariant = (variant: "dot" | "colored") => {
		setBadgeVariantState(variant);
		updateSettings({ badgeVariant: variant });
	};

	const setView = (newView: TCalendarView) => {
		setCurrentViewState(newView);
		updateSettings({ view: newView });
	};

	const toggleTimeFormat = () => {
		const newValue = !use24HourFormat;
		setUse24HourFormatState(newValue);
		updateSettings({ use24HourFormat: newValue });
	};

	const setAgendaModeGroupBy = (groupBy: "date" | "color") => {
		setAgendaModeGroupByState(groupBy);
		updateSettings({ agendaModeGroupBy: groupBy });
	};

	const filterEventsBySelectedColors = (color: TEventColor) => {
		const isColorSelected = selectedColors.includes(color);
		const newColors = isColorSelected
			? selectedColors.filter((c) => c !== color)
			: [...selectedColors, color];

		if (newColors.length > 0) {
			const filtered = allEvents.filter((event) => {
				const eventColor = event.color || "blue";
				return newColors.includes(eventColor);
			});
			setFilteredEvents(filtered);
		} else {
			setFilteredEvents(allEvents);
		}

		setSelectedColors(newColors);
	};

	const filterEventsBySelectedUser = (userId: User["id"] | "all") => {
		setSelectedUserId(userId);
		if (userId === "all") {
			setFilteredEvents(allEvents);
		} else {
			const filtered = allEvents.filter((event) => event.userId === userId);
			setFilteredEvents(filtered);
		}
	};

	const handleSelectDate = (date: Date | undefined) => {
		if (!date) return;
		setSelectedDate(date);
	};

	const { data: session } = authClient.useSession()

	const addEvent = async (event: TEventFormData) => {
		console.log("Adding event:", event);
		
		setAllEvents((prev) => [...prev, event]);
		setFilteredEvents((prev) => [...prev, event]);
		
		try {
			await postCalendarEventData({ data: event });
			console.log("Event saved to database successfully");
		} catch (error) {
			console.error("Failed to save event to database:", error);
		}
	};

	const updateEvent = async (event: TEventFormData) => {
		const updatedEvent = {
			...event,
			startDate: new Date(event.startDate),
			endDate: new Date(event.endDate)
		};

		setAllEvents((prev) => prev.map((e) => (e.id === event.id ? updatedEvent : e)));
		setFilteredEvents((prev) =>
			prev.map((e) => (e.id === event.id ? updatedEvent : e)),
		);
		console.log("Updating event:", updatedEvent);
		
		try {
			await putEventData({ data: updatedEvent });
			console.log("Event updated in database successfully");
		} catch (error) {
			console.error("Failed to update event in database:", error);
		}
	};

	const removeEvent = async (eventId: string) => {
		setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
		setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
		
		try {
			await deleteEventData({ data: { id: eventId } });
			console.log("Event deleted from database successfully");
		} catch (error) {
			console.error("Failed to delete event from database:", error);
		}
	};

	const clearFilter = () => {
		setFilteredEvents(allEvents);
		setSelectedColors([]);
		setSelectedUserId("all");
	};

	const value = {
		selectedDate,
		setSelectedDate: handleSelectDate,
		selectedUserId,
		setSelectedUserId,
		badgeVariant,
		setBadgeVariant,
		users,
		selectedColors,
		filterEventsBySelectedColors,
		filterEventsBySelectedUser,
		events: filteredEvents,
		view: currentView,
		use24HourFormat,
		toggleTimeFormat,
		setView,
		agendaModeGroupBy,
		setAgendaModeGroupBy,
		addEvent,
		updateEvent,
		removeEvent,
		clearFilter,
	};

	return (
		<CalendarContext.Provider value={value}>
			{children}
		</CalendarContext.Provider>
	);
}

export function useCalendar(): ICalendarContext {
	const context = useContext(CalendarContext);
	if (!context)
		throw new Error("useCalendar must be used within a CalendarProvider.");
	return context;
}
