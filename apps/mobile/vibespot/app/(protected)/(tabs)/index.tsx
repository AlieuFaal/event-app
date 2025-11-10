import {
  useQuery,
} from '@tanstack/react-query'
import { EventCard1 } from "@/components/event-components/event-card-1";
import { apiClient } from "@/lib/api-client";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "../../../../../../packages/database/src/schema";
import { useMemo, useRef, useState } from "react";
import Animated from "react-native-reanimated";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Haptics from 'expo-haptics';
import { EventActionsSheet } from '@/components/bottomsheet-component/eventactions-sheet';
import UpcomingEventCard from '@/components/event-components/upcoming-event-card';
import { useGetEvent } from '@/hooks/useGetEvent';

const AnimatedScrollView = Animated.ScrollView;

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["82%"], []);

  const openSheet = (event: Event) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(event);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const { isPending, error, data } = useGetEvent();

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
      <View className="flex-1">
        <View className='h-fit mt-4'>
          <Text className="text-left mx-11 text-2xl font-semibold text-gray-900 dark:text-white">Upcoming Event</Text>
        </View>
        {data.slice(0, 1).map(event => (
          <UpcomingEventCard key={event.id} event={event} onLongPress={() => openSheet(event)} />
        ))}
        <View className="flex flex-row mt-10 w-11/12 mx-auto ml-11 h-fit">
          <Text className="text-2xl font-semibold text-center items-start justify-start text-gray-900 dark:text-white">Happening Now</Text>
        </View>
        <AnimatedScrollView horizontal={true} showsHorizontalScrollIndicator={false} className={"px-9 py-3"} contentContainerStyle={{ columnGap: 25 }} >
          {data.slice(0, 5).map((event) => (
            <EventCard1 key={event.id} event={event} onLongPress={() => openSheet(event)} />
          ))}
        </AnimatedScrollView>
        <EventActionsSheet selectedEvent={selectedEvent} bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
      </View>
    </SafeAreaView>
  );
}
