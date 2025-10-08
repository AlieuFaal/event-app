import { EventWithComments, User } from "drizzle/db";
import EventCards from "./event-cards";
import { Separator } from "../shadcn/ui/separator";
import { useState, useMemo } from "react";

export default function EventList({ events, users }: { events: EventWithComments[], users: User[] }) {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });

    const currentMonthEvents = events.filter(event => {
        const eventMonth = new Date(event.startDate).getMonth();
        return eventMonth === new Date().getMonth();
    });

    const nextMonthEvents = events.filter(event => {
        const eventMonth = new Date(event.startDate).getMonth();
        return eventMonth === new Date(new Date().setMonth(new Date().getMonth() + 1)).getMonth();
    });

    return (
        <div className="flex flex-col p-4">
            <div className="m-8">
                {currentMonthEvents.length === 0 && nextMonthEvents.length === 0 && (
                    <p className="text-center text-lg">No events found...</p>
                )}
                {currentMonthEvents.length > 0 && (
                    <>
                        <div className="bg-primary w-fit p-3 rounded-t-lg relative">
                            <p className="text-2xl font-bold mb-4">{currentMonth}</p>
                        </div>
                        <Separator className="bg-primary mb-2 py-0.5 rounded-r-lg" />
                    </>
                )}

                <EventCards events={currentMonthEvents} users={users} />

                {nextMonthEvents.length > 0 && (
                    <>
                        <div className="bg-primary w-fit p-3 rounded-t-lg relative mt-5">
                            <p className="text-2xl font-bold mb-4">{nextMonth}</p>
                        </div>
                        <Separator className="bg-primary mb-2 py-0.5 rounded-r-lg" />
                    </>
                )}

                <EventCards events={nextMonthEvents} users={users} />
                
            </div>
        </div>
    )
}
