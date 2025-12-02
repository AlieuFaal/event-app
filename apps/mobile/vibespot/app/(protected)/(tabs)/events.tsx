import { queryClient } from "@/app/_layout";
import { useCallback, useState, } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Event } from "@vibespot/database/schema";
import { useGetEvent } from "@/hooks/useGetEvent";
import { Separator } from "@/components/ui/separator";
import EventCard2 from "@/components/event-components/event-card-2";

export default function Events() {
  const [refreshing, setRefreshing] = useState(false);
  const { isPending, error, data } = useGetEvent();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, []);

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="fuchsia" />
          <Text className="text-gray-600 dark:text-gray-300">Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 dark:text-gray-300">No events available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 dark:text-red-400">Error fetching events: {(error as Error).message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <View className="flex-1 p-4">

        <View>
          <Text className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">All Events</Text>
          <Separator className="bg-gray-300 dark:bg-gray-700 mb-5 h-1" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          {data?.map((event: Event) => (
            <EventCard2 key={event.id} event={event} />
          ))}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
