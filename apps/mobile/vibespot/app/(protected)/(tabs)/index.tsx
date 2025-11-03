import { EventCard1 } from "@/components/event-components/event-card-1";
import { apiClient } from "@/lib/api-client";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "../../../../../../packages/database/src/schema";
import { useEffect, useRef, useState } from "react";
import Animated from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedScrollView = Animated.ScrollView;

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {

    const fetchEvents = async () => {

      const res = await apiClient.events.$get();

      if (res.ok) {
        const data = await res.json();
        const events = data.map(event => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          repeatEndDate: event.repeatEndDate ? new Date(event.repeatEndDate) : null,
          createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
        })) as Event[];
        setEvents(events);
        console.log("Events fetched");
      }
    };

    fetchEvents();
  }, []);

  return (
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1">
          <View className="bg-gray-100 w-10/12 justify-center items-center rounded-3xl mx-auto p-16 mt-5 shadow-lg drop-shadow-lg border-1">
            <Text className="text-3xl text-center">BOX 1</Text>
          </View>
          <View className="flex flex-row mt-10 w-11/12 mx-auto ml-11 h-fit">
            <Text className="text-2xl font-semibold text-center items-start justify-start">Happening Now</Text>
          </View>
          <AnimatedScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ columnGap: 25, paddingHorizontal: 35, paddingVertical: 15 }}>
            {events.slice(0, 5).map((event) => (
              <EventCard1 key={event.id} event={event} onLongPress={() => { }} />
            ))}
          </AnimatedScrollView>
        </View>
      </SafeAreaView>
  );
}
