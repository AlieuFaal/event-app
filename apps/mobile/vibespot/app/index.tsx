import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiClient } from "../lib/api-client";
import { Event } from "@vibespot/database";

export default function HomeScreen() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    apiClient.events.$get()
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl mb-4">Events ({events.length})</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-2 mb-2 border">
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
