import { EventWithComments, User } from "drizzle/db";
import FavoriteEventCard from "./favoriteEventCard";


export default function FavoriteEventCards({ favoriteEvents, users }: { favoriteEvents: EventWithComments[], users: User[] }) {
    return (
        <div className="p-4 space-y-6">
            {favoriteEvents.map((e) => (
                <FavoriteEventCard key={e.id} favoriteEvent={e} users={users} />
            ))}
        </div>
    )
}