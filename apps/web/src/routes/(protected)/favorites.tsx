import FavoriteEventPageHeader from "@/components/favorites-components/favoriteEvent-page-header";
import FavoritesList from "@/components/favorites-components/favorites-list";
import { getFavoriteEventsFn } from "@/services/eventService";
import { getUserDataFn } from "@/services/user-service";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/(protected)/favorites")({
  component: FavoritesComponent,
  loader: async (ctx) => {
    const currentUser = ctx.context.currentUser;
    const [favoriteEvents, users] = await Promise.all([
      getFavoriteEventsFn(),
      getUserDataFn(),
    ]);

    return {
      favoriteEvents,
      users,
      currentUser,
    };
  },
});

function FavoritesComponent() {
  const { favoriteEvents, users, currentUser } = Route.useLoaderData();
  const [searchInput, setSearchInput] = useState("");

  const filteredEvents = useMemo(() => {
    if (!searchInput.trim()) return favoriteEvents;

    const search = searchInput.toLowerCase();

    return favoriteEvents.filter((event) => {
      const creator = users.find((user) => user.id === event.userId);

      return (
        event.title.toLowerCase().includes(search) ||
        event.address.toLowerCase().includes(search) ||
        event.venue?.toLowerCase().includes(search) ||
        creator?.name.toLowerCase().includes(search)
      );
    });
  }, [favoriteEvents, users, searchInput]);

  return (
    <>
      <FavoriteEventPageHeader
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        resultsCount={favoriteEvents.length}
      />
      <FavoritesList
        favoriteEvents={filteredEvents}
        users={users}
        currentUser={currentUser}
      />
    </>
  );
}
