import { EventWithComments, User } from "drizzle/db";
import FavoriteEventCards from "./favoriteEventCards";


export default function FavoritesList({ favoriteEvents, users }: { favoriteEvents: EventWithComments[], users: User[] }) {

    return (
        <div className="flex flex-col border-2 rounded-2xl shadow-2xl  text-card-foreground p-4 m-10">
            {favoriteEvents.length === 0 && (
                <p className="text-2xl text-center text-gray-600 dark:text-amber-50">No favorites found.</p>
            )}
            <FavoriteEventCards favoriteEvents={favoriteEvents} users={users} />
        </div>
    )
}