import { queryClient } from "@/app/_layout";
import EventCard2 from "@/components/event-components/event-card-2";
import { Separator } from "@/components/ui/separator";
import { useGetFavoriteEvents } from "@/hooks/useGetFavoriteEvents";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";
import type { Event } from "@vibespot/database";
import { useRouter } from "expo-router";
import { CalendarDays, Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// Drizzle join uses the SQL table name as the key, not the JS variable name
type FavoriteEventRow = { event: Event };

export default function SavedEvents() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { handleScroll } = useTabBarScrollVisibility();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, []);

  const { isPending, error, data } = useGetFavoriteEvents();

  const onCreatePress = () => {
    router.navigate("/(protected)/(tabs)/events");
  };

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

  if (!data || data.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
        }}
      >
        <View
          className="bg-gray-100 dark:bg-gray-900"
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <CalendarDays size={36} strokeWidth={1.5} />
        </View>

        <Text
          className="text-gray-600 dark:text-gray-300"
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          No favorites yet
        </Text>

        <Text
          className="text-gray-600 dark:text-gray-300"
          style={{
            fontSize: 14,
            textAlign: "center",
            lineHeight: 20,
            marginBottom: 28,
          }}
        >
          Events you save will appear here. Tap the button below to see more
          events you might like.
        </Text>

        <Pressable
          onPress={onCreatePress}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#8b5cf6",
            borderRadius: 12,
            paddingHorizontal: 20,
            paddingVertical: 12,
          }}
          className="active:opacity-80"
        >
          <Plus size={18} color="#ffffff" strokeWidth={2.5} />
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
            Check out upcoming events
          </Text>
        </Pressable>
      </View>
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
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
