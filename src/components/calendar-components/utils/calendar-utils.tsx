"use client";

import { Dispatch, SetStateAction } from "react";
import FullCalendar from "@fullcalendar/react";
import { RefObject } from "react";

export type calendarRef = RefObject<FullCalendar | null>;

export function setView(calendarRef: calendarRef, viewName: string, setCurrentView: Dispatch<SetStateAction<string>>) {
    const calendarApi = calendarRef.current!.getApi();
    setCurrentView(viewName);
    calendarApi.changeView(viewName);
}