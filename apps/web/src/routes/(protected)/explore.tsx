import { ExploreEventDialog } from "@/components/explore-components/explore-event-dialog";
import { ExploreGenreSection } from "@/components/explore-components/explore-genre-section";
import { ExploreHero } from "@/components/explore-components/explore-hero";
import { ExploreLiveSection } from "@/components/explore-components/explore-live-section";
import { ExploreSnapshot } from "@/components/explore-components/explore-snapshot";
import { ExploreTrendingSection } from "@/components/explore-components/explore-trending-section";
import { ExploreUpcomingSection } from "@/components/explore-components/explore-upcoming-section";
import { ExploreWeekRail } from "@/components/explore-components/explore-week-rail";
import {
  getEventCountsByGenre,
  getCreatorName,
  isEventLive,
  isSameDay,
  isWithinThisWeek,
} from "@/components/explore-components/explore-utils";
import type { ExploreEvent } from "@/components/explore-components/types";
import {
  addFavoriteEventFn,
  getExploreEventsFn,
  removeFavoriteEventFn,
  toggleEventAttendanceFn,
} from "@/services/eventService";
import { getUserDataFn } from "@/services/user-service";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useDeferredValue, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/(protected)/explore")({
  component: ExploreComponent,
  loader: async (ctx) => {
    const currentUser = ctx.context.currentUser;
    const [events, users] = await Promise.all([
      getExploreEventsFn(),
      getUserDataFn(),
    ]);

    return {
      currentUser,
      events,
      nowIso: new Date().toISOString(),
      users,
    };
  },
});

function ExploreComponent() {
  const { currentUser, events, nowIso, users } = Route.useLoaderData();
  const router = useRouter();
  const addFavoriteEvent = useServerFn(addFavoriteEventFn);
  const removeFavoriteEvent = useServerFn(removeFavoriteEventFn);
  const toggleEventAttendance = useServerFn(toggleEventAttendanceFn);
  const [searchInput, setSearchInput] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [attendancePendingEventId, setAttendancePendingEventId] = useState<string | null>(null);
  const deferredSearchInput = useDeferredValue(searchInput);
  const [now] = useState(() => new Date(nowIso));

  const activeEvents = useMemo(
    () => events.filter((event) => new Date(event.endDate) >= now),
    [events, now],
  );

  const filteredEvents = useMemo(() => {
    const normalizedSearch = deferredSearchInput.trim().toLowerCase();

    return activeEvents.filter((event) => {
      const creatorName = getCreatorName(event, users);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        event.title.toLowerCase().includes(normalizedSearch) ||
        event.address.toLowerCase().includes(normalizedSearch) ||
        event.venue?.toLowerCase().includes(normalizedSearch) ||
        event.genre?.toLowerCase().includes(normalizedSearch) ||
        creatorName.toLowerCase().includes(normalizedSearch);

      const matchesGenre =
        selectedGenres.length === 0 ||
        (event.genre ? selectedGenres.includes(event.genre) : false);

      const matchesDate = selectedDate
        ? isSameDay(new Date(event.startDate), selectedDate)
        : true;

      return matchesSearch && matchesGenre && matchesDate;
    });
  }, [activeEvents, deferredSearchInput, selectedDate, selectedGenres, users]);

  const liveEvents = useMemo(
    () => filteredEvents.filter((event) => isEventLive(event, now)),
    [filteredEvents, now],
  );

  const upcomingEvents = useMemo(
    () => filteredEvents.filter((event) => new Date(event.startDate) > now),
    [filteredEvents, now],
  );

  const trendingEvents = useMemo(() => {
    const hasAttendance = filteredEvents.some((event) => event.attendeeCount > 0);
    const baseEvents = hasAttendance ? filteredEvents : upcomingEvents;

    return [...baseEvents].sort((eventA, eventB) => {
      if (eventB.attendeeCount !== eventA.attendeeCount) {
        return eventB.attendeeCount - eventA.attendeeCount;
      }

      return new Date(eventA.startDate).getTime() - new Date(eventB.startDate).getTime();
    });
  }, [filteredEvents, upcomingEvents]);

  const genreCounts = useMemo(() => getEventCountsByGenre(activeEvents), [activeEvents]);
  const selectedEvent = selectedEventId
    ? events.find((event) => event.id === selectedEventId) ?? null
    : null;
  const goingCount = activeEvents.filter((event) => event.isGoing).length;
  const savedCount = activeEvents.filter((event) => event.isStarred).length;
  const thisWeekCount = activeEvents.filter((event) =>
    isWithinThisWeek(new Date(event.startDate), now),
  ).length;
  const liveCount = activeEvents.filter((event) => isEventLive(event, now)).length;

  const handleFilterClick = () => {
    document
      .getElementById("explore-genres")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((currentGenres) =>
      currentGenres.includes(genre)
        ? currentGenres.filter((currentGenre) => currentGenre !== genre)
        : [...currentGenres, genre],
    );
  };

  const handleToggleFavorite = async (event: ExploreEvent) => {
    try {
      if (event.isStarred) {
        await removeFavoriteEvent({ data: { id: event.id } });
        toast.success("Removed from favorites");
      } else {
        await addFavoriteEvent({ data: { eventId: event.id } });
        toast.success("Saved to favorites");
      }

      await router.invalidate();
    } catch (error) {
      console.error("Failed to update favorite state:", error);
      toast.error("Could not update favorite");
    }
  };

  const handleToggleAttendance = async (event: ExploreEvent) => {
    setAttendancePendingEventId(event.id);

    try {
      await toggleEventAttendance({ data: { eventId: event.id } });
      toast.success(event.isGoing ? "RSVP removed" : "You're going");
      await router.invalidate();
    } catch (error) {
      console.error("Failed to update RSVP state:", error);
      toast.error(error instanceof Error ? error.message : "Could not update RSVP");
    } finally {
      setAttendancePendingEventId(null);
    }
  };

  const handleProfileOpen = (userId: string) => {
    setSelectedEventId(null);
    router.navigate({ to: "/user/$id", params: { id: userId } });
  };

  const handleFlyToEvent = (event: ExploreEvent) => {
    setSelectedEventId(null);
    router.navigate({ to: "/event-map", search: { id: event.id } });
  };

  return (
    <div className="explore-page min-h-screen overflow-hidden">
      <main className="relative mx-auto flex max-w-[1600px] flex-col gap-5 px-4 pb-16 sm:px-8 lg:px-[60px]">
        <ExploreHero
          onFilterClick={handleFilterClick}
          onSearchChange={setSearchInput}
          resultsCount={filteredEvents.length}
          searchInput={searchInput}
        />

        <ExploreSnapshot
          goingCount={goingCount}
          liveCount={liveCount}
          savedCount={savedCount}
          thisWeekCount={thisWeekCount}
        />

        <ExploreWeekRail
          events={activeEvents}
          now={now}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />

        <div className="grid gap-4 lg:grid-cols-[1.04fr_1fr]">
          <ExploreLiveSection
            liveEvents={liveEvents}
            nextEvent={upcomingEvents[0]}
            now={now}
            onOpenEvent={(event) => setSelectedEventId(event.id)}
            onToggleFavorite={handleToggleFavorite}
          />
          <ExploreUpcomingSection
            attendancePendingEventId={attendancePendingEventId}
            events={upcomingEvents}
            onOpenEvent={(event) => setSelectedEventId(event.id)}
            onToggleAttendance={handleToggleAttendance}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        <ExploreTrendingSection
          events={trendingEvents}
          onOpenEvent={(event) => setSelectedEventId(event.id)}
          onToggleFavorite={handleToggleFavorite}
        />

        <ExploreGenreSection
          genres={genreCounts}
          onClearGenres={() => setSelectedGenres([])}
          onGenreToggle={handleGenreToggle}
          selectedGenres={selectedGenres}
        />
      </main>

      <ExploreEventDialog
        attendancePendingEventId={attendancePendingEventId}
        currentUser={currentUser}
        event={selectedEvent}
        onFlyToEvent={handleFlyToEvent}
        onOpenChange={(open) => {
          if (!open) setSelectedEventId(null);
        }}
        onProfileOpen={handleProfileOpen}
        onToggleAttendance={handleToggleAttendance}
        onToggleFavorite={handleToggleFavorite}
        open={Boolean(selectedEvent)}
        users={users}
      />
    </div>
  );
}
