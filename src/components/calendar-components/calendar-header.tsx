"use client";

import { motion } from "framer-motion";
import {
    GalleryVertical,
    List,
    Plus,
    Table,
    Tally3,
} from "lucide-react";
import {
    slideFromLeft,
    slideFromRight,
    transition,
} from "./animations/animations";
import { Button } from "../shadcn/ui/button";
import { Link } from "@tanstack/react-router";
import { TodayButton } from "./today-button";
import { DateDisplay } from "./date-display";
import { Tabs, TabsTrigger } from "../shadcn/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import { useState } from "react";
import { useCalendar } from "./contexts/calendar-context";

export function CalendarHeader() {
    const { calendarRef, currentView, setCurrentView } = useCalendar();
    
    const setView = (viewName: string) => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(viewName);
            const viewMapping: Record<string, any> = {
                'timeGridDay': 'day',
                'timeGridWeek': 'week', 
                'dayGridMonth': 'month',
                'listWeek': 'list'
            };
            setCurrentView(viewMapping[viewName] || 'month');
        }
    };

    return (
        <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            <motion.div
                className="flex items-center gap-3"
                variants={slideFromLeft}
                initial="initial"
                animate="animate"
            >
                <TodayButton />
                <DateDisplay view={currentView} />
            </motion.div>

            <motion.div
                className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5"
                variants={slideFromRight}
                initial="initial"
                animate="animate"
            >
                <div className="options flex-wrap flex items-center gap-4 md:gap-2">
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5">
                </div>
            </motion.div>
            <div>
                <Tabs defaultValue="dayGridMonth">
                    <TabsList className="flex w-44 md:w-64 bg-muted p-2 rounded-xl gap-1">
                        <TabsTrigger
                            value="timeGridDay"
                            onClick={() => setView("timeGridDay")}
                            className={`space-x-1 hover:scale-110 ${currentView === "day" ? "w-1/2" : "w-1/4" 
                                }`}
                        >
                            <GalleryVertical className="h-5 w-5" />
                            {currentView === "day" && (
                                <p className="text-xs md:text-sm">Day</p>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="timeGridWeek"
                            onClick={() => setView("timeGridWeek")}
                            className={`space-x-1 hover:scale-110 ${currentView === "week" ? "w-1/2" : "w-1/4"
                                }`}
                        >
                            <Tally3 className="h-5 w-5" />
                            {currentView === "week" && (
                                <p className="text-xs md:text-sm">Week</p>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="dayGridMonth"
                            onClick={() => setView("dayGridMonth")}
                            className={`space-x-1 hover:scale-110 ${currentView === "month" ? "w-1/2" : "w-1/4"
                                }`}
                        >
                            <Table className="h-5 w-5 rotate-90" />
                            {currentView === "month" && (
                                <p className="text-xs md:text-sm">Month</p>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="listWeek"
                            onClick={() => setView("listWeek")}
                            className={`space-x-1 hover:scale-110 ${currentView === "list" ? "w-1/2" : "w-1/4"
                                }`}
                        >
                            <List className="h-5 w-5 " />
                            {currentView === "list" && (
                                <p className="text-xs md:text-sm">List</p>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}