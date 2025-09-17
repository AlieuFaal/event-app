import { EventWithComments, User } from "drizzle/db";
import EventCards from "../event-components/event-cards";
import FavoriteEventCards from "./favoriteEventCards";
import { useState } from "react";


export default function FavoritesList({ favoriteEvents, users }: { favoriteEvents: EventWithComments[], users: User[] }) {

    const [eventState, setEventState] = useState<EventWithComments[]>(favoriteEvents);
    
    return (
        <div className="flex flex-col border-2 rounded-2xl shadow-2xl bg-card text-card-foreground p-4">
            <div className="">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-6xl mb-5 mt-5">
                        Favorites
                    </h1>
                </div>
            </div>
            <FavoriteEventCards favoriteEvents={favoriteEvents} users={users} />
        </div>
    )
}