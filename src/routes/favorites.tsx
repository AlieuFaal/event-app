import FavoritesList from '@/components/favorites-components/favorites-list'
import { getFavoriteEventsFn } from '@/utils/eventService';
import { getUserDataFn } from '@/utils/user-service';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/favorites')({
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
