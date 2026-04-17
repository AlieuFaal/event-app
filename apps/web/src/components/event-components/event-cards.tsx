import { EventWithComments, User } from "@vibespot/database/schema";
import EventCard from "./event-card";

export default function EventCards({ events, users, currentUser }: { events: EventWithComments[], users: User[], currentUser?: User | null }) {
    return (
        <>
            <div>
                <div className="space-y-6">
                    {events.map((e) => (
                        <EventCard key={e.id} event={e} users={users} currentUser={currentUser ?? null}/>
                    ))}
                </div>
            </div>
        </>
    )
}
