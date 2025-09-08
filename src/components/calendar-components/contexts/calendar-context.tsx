import { User } from "better-auth";
import { Event, CalendarEvent } from "../../../utils/event";
import { createContext, useContext, useState, useRef } from "react";
import { CalendarView } from "../types/types";
import FullCalendar from '@fullcalendar/react';

interface CalendarContext {
    selectedDate: Date;
    setSelectedDate: (date: Date | undefined) => void;
    currentView: CalendarView;
    setCurrentView: (view: CalendarView) => void;
    calendarRef: React.RefObject<FullCalendar | null>;
    navigateCalendar: (direction: "prev" | "next") => void;
}

const CalendarContext = createContext({} as CalendarContext);

export function CalendarProvider({
    children,
    users,
    events,
    badge = "colored",
    view = "month",
}: {
    children: React.ReactNode;
    users: User[];
    events: CalendarEvent[];
    view?: CalendarView;
    badge?: "dot" | "colored";
}) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<CalendarView>(view);
    const calendarRef = useRef<FullCalendar>(null);

    const handleSelectDate = (date: Date | undefined) => {
        if (!date) return;
        setSelectedDate(date);
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(date);
        }
    };

    const navigateCalendar = (direction: "prev" | "next") => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            if (direction === "prev") {
                calendarApi.prev();
            } else {
                calendarApi.next();
            }
            setSelectedDate(calendarApi.getDate());
        }
    };

    const value = {
        selectedDate,
        setSelectedDate: handleSelectDate,
        currentView,
        setCurrentView,
        calendarRef,
        navigateCalendar,
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar(): CalendarContext {
    const context = useContext(CalendarContext);
    if (!context)
        throw new Error("useCalendar must be used within a CalendarProvider.");
    return context;
}