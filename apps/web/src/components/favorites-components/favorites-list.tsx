import { EventWithComments, User } from "@vibespot/database/schema";
import FavoriteEventCards from "./favoriteEventCards";

export default function FavoritesList({
  favoriteEvents,
  users,
  currentUser,
}: {
  favoriteEvents: EventWithComments[];
  users: User[];
  currentUser: User | null;
}) {
  return (
    <div className="flex flex-col p-8">
      {favoriteEvents.length === 0 && (
        <p className="text-2xl text-center text-gray-600 dark:text-amber-50">
          No favorites found.
        </p>
      )}
      <FavoriteEventCards
        favoriteEvents={favoriteEvents}
        users={users}
        currentUser={currentUser}
      />
    </div>
  );
}
