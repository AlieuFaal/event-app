import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { queryClient } from "@/lib/query-client";
import { EventActionsSheet } from "@/components/bottomsheet-component/eventactions-sheet";
import { AllEventsCard } from "@/components/event-components/all-events-card";
import { AllEventsHeader } from "@/components/event-components/all-events-header";
import {
  getErrorMessage,
  isWithinThisWeek,
} from "@/components/event-components/all-events-utils";
import { EventSectionHeader } from "@/components/event-components/event-section-header";
import { FilterPill } from "@/components/event-components/filter-pill";
import { useGetEvent } from "@/hooks/useGetEvent";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";
import type { EventWithAttendance } from "@/types/event";

type TimeFilter = "all" | "upcoming" | "this-week";
type ActiveFilter = TimeFilter | `genre:${string}`;

type EventSection = {
  title: "Upcoming" | "Past";
  isPast: boolean;
  data: EventWithAttendance[];
};

export default function Events() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isPending, error, data } = useGetEvent();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithAttendance | null>(null);
  const bottomSheetRef = useRef<BottomSheetMethods | null>(null);
  const now = useMemo(() => new Date(), []);
  const { handleScroll } = useTabBarScrollVisibility();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["events"] });
    setRefreshing(false);
  }, []);

  const openActionsSheet = useCallback((event: EventWithAttendance) => {
    setSelectedEvent(event);
    bottomSheetRef.current?.expand();
  }, []);

  const events = useMemo(() => data ?? [], [data]);

  const stats = useMemo(() => {
    const upcomingCount = events.filter(
      (event) => new Date(event.endDate) >= now,
    ).length;
    const pastCount = events.length - upcomingCount;
    return { total: events.length, upcoming: upcomingCount, past: pastCount };
  }, [events, now]);

  const genreFilters = useMemo(
    () =>
      Array.from(new Set(events.map((event) => event.genre)))
        .sort((a, b) => a.localeCompare(b))
        .map((genre) => ({ id: `genre:${genre}` as const, label: genre })),
    [events],
  );

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;
    if (activeFilter === "upcoming") {
      return events.filter((event) => new Date(event.endDate) >= now);
    }
    if (activeFilter === "this-week") {
      return events.filter((event) => {
        const startDate = new Date(event.startDate);
        return (
          isWithinThisWeek(startDate, now) && new Date(event.endDate) >= now
        );
      });
    }
    if (activeFilter.startsWith("genre:")) {
      const genre = activeFilter.replace("genre:", "");
      return events.filter((event) => event.genre === genre);
    }
    return events;
  }, [activeFilter, events, now]);

  const sections = useMemo<EventSection[]>(() => {
    const upcoming = filteredEvents
      .filter((event) => new Date(event.endDate) >= now)
      .sort(
        (eventA, eventB) =>
          new Date(eventA.startDate).getTime() -
          new Date(eventB.startDate).getTime(),
      );

    const past = filteredEvents
      .filter((event) => new Date(event.endDate) < now)
      .sort(
        (eventA, eventB) =>
          new Date(eventB.endDate).getTime() -
          new Date(eventA.endDate).getTime(),
      );

    const builtSections: EventSection[] = [];
    if (upcoming.length > 0) {
      builtSections.push({ title: "Upcoming", isPast: false, data: upcoming });
    }
    if (past.length > 0) {
      builtSections.push({ title: "Past", isPast: true, data: past });
    }
    return builtSections;
  }, [filteredEvents, now]);

  if (isPending) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text
            className={`mt-3 text-sm ${isDark ? "text-[#7c6a8e]" : "text-gray-500"}`}
          >
            Loading events...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-[15px] leading-[22px] text-red-500">
            {getErrorMessage(error)}
          </Text>
          <Pressable
            onPress={onRefresh}
            className="mt-4 rounded-xl bg-violet-500 px-4 py-2.5"
          >
            <Text className="text-[13px] font-bold text-white">Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <SectionList<EventWithAttendance, EventSection>
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8b5cf6"
            colors={["#8b5cf6"]}
          />
        }
        ListHeaderComponent={
          <>
            <AllEventsHeader isDark={isDark} stats={stats} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                gap: 8,
              }}
            >
              <FilterPill
                label="All"
                active={activeFilter === "all"}
                onPress={() => setActiveFilter("all")}
              />
              <FilterPill
                label="Upcoming"
                active={activeFilter === "upcoming"}
                onPress={() => setActiveFilter("upcoming")}
              />
              <FilterPill
                label="This week"
                active={activeFilter === "this-week"}
                onPress={() => setActiveFilter("this-week")}
              />
              {genreFilters.map((filter) => (
                <FilterPill
                  key={filter.id}
                  label={filter.label}
                  active={activeFilter === filter.id}
                  onPress={() => setActiveFilter(filter.id)}
                />
              ))}
            </ScrollView>
          </>
        }
        ListEmptyComponent={
          <View className="items-center px-6 pt-7">
            <Text
              className={`text-center text-base font-bold ${isDark ? "text-[#f0eaf5]" : "text-gray-900"}`}
            >
              {events.length === 0
                ? "No events yet"
                : "No events match the selected filter"}
            </Text>
            <Text
              className={`mt-2 text-center text-[13px] leading-[19px] ${isDark ? "text-[#7c6a8e]" : "text-gray-500"}`}
            >
              {events.length === 0
                ? "Check back later to discover upcoming events."
                : "Try selecting a different filter to see more events."}
            </Text>
            {events.length > 0 && activeFilter !== "all" ? (
              <Pressable
                onPress={() => setActiveFilter("all")}
                className="mt-4 rounded-xl bg-violet-500 px-4 py-2.5"
              >
                <Text className="text-[13px] font-bold text-white">
                  Reset Filter
                </Text>
              </Pressable>
            ) : null}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <EventSectionHeader
            title={section.title}
            count={section.data.length}
            isDark={isDark}
            isPast={section.isPast}
          />
        )}
        renderItem={({ item, section }) => (
          <AllEventsCard
            event={item}
            isPast={section.isPast}
            isDark={isDark}
            onActionsPress={openActionsSheet}
          />
        )}
      />
      <EventActionsSheet
        selectedEvent={selectedEvent}
        bottomSheetRef={bottomSheetRef}
      />
    </SafeAreaView>
  );
}
