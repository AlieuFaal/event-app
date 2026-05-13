import type { EventWithComments, User } from "@vibespot/database/schema";
import FavoriteEventCard from "./favoriteEventCard";

export default function FavoriteEventCards({
	favoriteEvents,
	users,
	currentUser,
}: {
	favoriteEvents: EventWithComments[];
	users: User[];
	currentUser: User | null;
}) {
	return (
		<div className="space-y-6 p-4">
			{favoriteEvents.map((e) => (
				<FavoriteEventCard
					key={e.id}
					favoriteEvent={e}
					users={users}
					currentUser={currentUser}
				/>
			))}
		</div>
	);
}
