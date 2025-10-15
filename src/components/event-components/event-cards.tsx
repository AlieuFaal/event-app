import { EventWithComments, User } from "drizzle/db";
import EventCard from "./event-card";
import { useRef } from "react";
import { useIsVisible } from "@/hooks/useIsVisible";


export default function EventCards({ events, users, currentUser }: { events: EventWithComments[], users: User[], currentUser: User | null }) {

    const ref1 = useRef<HTMLDivElement>(null);
    const isVisible1 = useIsVisible(ref1);

    return (
        <>

            <div className={`transition-opacity ease-in duration-400 ${isVisible1 ? "opacity-100" : "opacity-0"}`} ref={ref1}>
                <div className="space-y-6">
                    {events.map((e) => (
                        <EventCard key={e.title} event={e} users={users} currentUser={currentUser}/>
                    ))}
                </div>
            </div>
        </>
    )
}