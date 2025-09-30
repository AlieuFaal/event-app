import { EventWithComments, User } from "drizzle/db";
import EventCards from "./event-cards";
import { m } from "@/paraglide/messages";

export default function EventList({ events, users }: { events: EventWithComments[], users: User[] }) {
    return (
        <div className="flex flex-col border-2 rounded-2xl shadow-2xl bg-card text-card-foreground p-4">
            <div className="">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-6xl mb-5 mt-5">
                        {m.events_page_title()}
                    </h1>
                </div>
            </div>
            <EventCards events={events} users={users}/>
        </div>
    )
}
