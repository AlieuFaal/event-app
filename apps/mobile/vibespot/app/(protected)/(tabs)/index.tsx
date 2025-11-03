import { EventCard1 } from "@/components/event-components/event-card-1";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "../../../../../../packages/database/src/schema";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";

const AnimatedScrollView = Animated.ScrollView;

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {

    const fetchEvents = async () => {

      const res = await apiClient.events.$get();

      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        console.log("Events fetched");
      }
    };

    fetchEvents();
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <View className="flex-1">
        <View className="bg-gray-100 w-11/12 justify-center items-center rounded-3xl mx-auto p-6 mt-5 shadow-lg drop-shadow-lg border-1">
          <Text className="text-3xl text-center">BOX 1</Text>
        </View>
        <View className="flex flex-row mt-28 w-11/12 mx-auto ml-11">
          <Text className="text-2xl font-extralight text-center items-start justify-start">Happening Now</Text>
        </View>
        <AnimatedScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: 25, paddingHorizontal: 35 }}>
          {events.slice(0, 5).map((event) => (
            <EventCard1 key={event.id} {...event} />
          ))}
        </AnimatedScrollView>
      </View>
    </SafeAreaView>
  );
}
