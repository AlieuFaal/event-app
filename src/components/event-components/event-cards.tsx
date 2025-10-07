import { EventWithComments, User } from "drizzle/db";
import EventCard from "./event-card";


export default function EventCards({ events, users, filteredEvents }: { events: EventWithComments[], users: User[], filteredEvents?: EventWithComments[] }) {

    return (
        <>
            <div className="space-y-6">

                {events.map((e) => (
                    <EventCard key={e.title} event={e} users={users} />
                ))}
            </div>
        </>
    )
}