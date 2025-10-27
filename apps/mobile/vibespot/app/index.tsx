import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiClient } from "../lib/api-client";
import { Event } from "@vibespot/database";

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiClient.events.$get();
        const res = await data.json();
        const transformedEvents = res.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          repeatEndDate: event.repeatEndDate ? new Date(event.repeatEndDate) : null,
          createdAt: new Date(event.createdAt),
        }));
        console.log("Fetched events:", transformedEvents);
        setEvents(transformedEvents);
      }
      catch (error) {
        console.error("Error fetching events:", error);
        setError(error as Error);
      }
    };
    fetchEvents();
  }, []);

  return (
    (error && <Text>Error: {error.stack}</Text>) ||
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl mb-4">Events ({events.length})</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-2 mb-2 border">
            <Text>{item.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
