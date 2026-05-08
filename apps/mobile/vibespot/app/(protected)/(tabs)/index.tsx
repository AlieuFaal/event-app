import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { EventActionsSheet } from "@/components/bottomsheet-component/eventactions-sheet";
import { HomeContent } from "@/components/home-components/home-content";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";
import { useGetEvent } from "@/hooks/useGetEvent";
import type { EventWithAttendance } from "@/types/event";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HOME_EVENTS_REFETCH_INTERVAL_MS = 30_000;
const HOME_EVENTS_STALE_TIME_MS = 15_000;

export default function Home() {
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithAttendance | null>(null);

  const bottomSheetRef = useRef<BottomSheetMethods | null>(null);
  const { data: session } = authClient.useSession();
  const { handleScroll } = useTabBarScrollVisibility();

  const openSheet = (event: EventWithAttendance) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(event);
    bottomSheetRef.current?.expand();
  };

  const { isPending, error, data } = useGetEvent({
    refetchInterval: HOME_EVENTS_REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    staleTime: HOME_EVENTS_STALE_TIME_MS,
  });

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

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-[15px] leading-[22px] text-red-500 dark:text-red-400">
            Error fetching events: {(error as Error).message}
          </Text>
          <Pressable
            onPress={() => {
              void queryClient.invalidateQueries({ queryKey: ["events"] });
            }}
            className="mt-4 rounded-xl bg-violet-500 px-4 py-2.5 active:opacity-80"
          >
            <Text className="text-[13px] font-bold text-white">Try Again</Text>
          </Pressable>
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

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
      <HomeContent
        events={data}
        onActionsPress={openSheet}
        onScroll={handleScroll}
        userName={session?.user.name}
      />
      <EventActionsSheet
        selectedEvent={selectedEvent}
        bottomSheetRef={bottomSheetRef}
      />
    </SafeAreaView>
  );
}
