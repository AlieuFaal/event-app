import { EventWithComments, User } from "drizzle/db";
import EventCards from "./event-cards";

export default function EventList({ events, users }: { events: EventWithComments[], users: User[] }) {
    
    return (
        <div className="flex flex-col p-4">
            <div className="m-8">
                <EventCards events={events} users={users} />
            </div>
        </div>
    )
}
