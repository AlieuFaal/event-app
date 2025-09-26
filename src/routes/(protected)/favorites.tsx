import FavoritesList from '@/components/favorites-components/favorites-list'
import { getFavoriteEventsFn } from '@/services/eventService';
import { getUserDataFn } from '@/services/user-service';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/favorites')({
    component: FavoritesComponent,
    loader: async () => {
        const favoriteEvents = await getFavoriteEventsFn();
        const users = await getUserDataFn();
        return {
            favoriteEvents,
            users,
        };
    }
})

function FavoritesComponent() {
    const { favoriteEvents, users } = Route.useLoaderData();
    console.log("Events with comments:", favoriteEvents);
    return (
        <FavoritesList favoriteEvents={favoriteEvents} users={users} />
    )
}
