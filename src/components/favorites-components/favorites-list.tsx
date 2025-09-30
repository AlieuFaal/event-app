import { EventWithComments, User } from "drizzle/db";
import FavoriteEventCards from "./favoriteEventCards";
import { m } from "@/paraglide/messages";


export default function FavoritesList({ favoriteEvents, users }: { favoriteEvents: EventWithComments[], users: User[] }) {
    
    return (
        <div className="flex flex-col border-2 rounded-2xl shadow-2xl bg-card text-card-foreground p-4">
            <div className="">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-6xl mb-5 mt-5">
                        {m.favorites_page_title()}
                    </h1>
                </div>
            </div>
            <FavoriteEventCards favoriteEvents={favoriteEvents} users={users} />
        </div>
    )
}