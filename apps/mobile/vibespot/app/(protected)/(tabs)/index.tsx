import { EventCard1 } from "@/components/event-components/event-card-1";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import Animated from "react-native-reanimated";
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as Haptics from "expo-haptics";
import { EventActionsSheet } from "@/components/bottomsheet-component/eventactions-sheet";
import { useGetEvent } from "@/hooks/useGetEvent";
import { UpcomingEventCard } from "@/components/event-components/upcoming-event-card";
import type { EventWithAttendance } from "@/types/event";

const AnimatedScrollView = Animated.ScrollView;

export default function Home() {
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithAttendance | null>(null);

  const bottomSheetRef = useRef<BottomSheetMethods | null>(null);

  const openSheet = (event: EventWithAttendance) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(event);
    bottomSheetRef.current?.expand();
  };

  const { isPending, error, data } = useGetEvent();

  const upcomingEvents = data?.filter(
    (event) => new Date(event.startDate) > new Date(),
  );

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="fuchsia" />
          <Text className="text-gray-600 dark:text-gray-300">
            Loading events...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 dark:text-gray-300">
            No events available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 dark:text-red-400">
            Error fetching events: {(error as Error).message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
      <View className="flex-1">
        <View className="h-fit mt-4">
          <Text className="text-left mx-11 text-2xl font-semibold text-gray-900 dark:text-white">
            Happening Now
          </Text>
        </View>
        {upcomingEvents && upcomingEvents.length > 0 ? (
          upcomingEvents
            .slice(0, 1)
            .map((event) => (
              <UpcomingEventCard
                key={event.id}
                event={event}
                onActionsPress={openSheet}
              />
            ))
        ) : (
          <View className="flex-1 justify-center items-center mt-10 border border-gray-300 rounded-lg mx-11 p-6">
            <Text>
              No upcoming events at the moment. Please check back later!
            </Text>
          </View>
        )}
        <View className="flex flex-row mt-10 w-11/12 mx-auto ml-11 h-fit">
          <Text className="text-2xl font-semibold text-center items-start justify-start text-gray-900 dark:text-white">
            Upcoming Events
          </Text>
        </View>
        <AnimatedScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className={"px-9 py-3"}
          contentContainerStyle={{ columnGap: 25 }}
        >
          {upcomingEvents?.slice(0, 5).map((event) => (
            <EventCard1
              key={event.id}
              event={event}
              onLongPress={() => openSheet(event)}
            />
          ))}
        </AnimatedScrollView>
        <EventActionsSheet
          selectedEvent={selectedEvent}
          bottomSheetRef={bottomSheetRef}
        />
      </View>
    </SafeAreaView>
  );
}
