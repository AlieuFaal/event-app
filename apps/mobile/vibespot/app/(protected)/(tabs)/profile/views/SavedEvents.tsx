import { queryClient } from "@/app/_layout";
import EventCard2 from "@/components/event-components/event-card-2";
import { Separator } from "@/components/ui/separator";
import { useGetFavoriteEvents } from "@/hooks/useGetFavoriteEvents";
import type { Event } from "@vibespot/database";
import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// Drizzle join uses the SQL table name as the key, not the JS variable name
type FavoriteEventRow = { event: Event };

export default function SavedEvents() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, []);

  const { isPending, error, data } = useGetFavoriteEvents();

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
      <View className="flex-1 p-4">
        <View>
          <Text className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
            Favorites
          </Text>
          <Separator className="bg-gray-300 dark:bg-gray-700 mb-5 h-1" />
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {(data as unknown as FavoriteEventRow[])
            ?.sort(
              (a, b) =>
                new Date(a.event.startDate).getTime() -
                new Date(b.event.startDate).getTime(),
            )
            .map(({ event }) => (
              <EventCard2 key={event.id} event={event} />
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
