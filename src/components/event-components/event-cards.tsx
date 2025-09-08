import EventCard from "./event-card";
import { User, Event } from "./event-list";


export default function EventCards({ events, users }: { events: Event[], users: User[] }) {
    return (
        <div className="p-4 space-y-6">
            {events.map((e) => (
                <EventCard key={e.title} event={e} users={users} />
            ))}
        </div>
    )
}