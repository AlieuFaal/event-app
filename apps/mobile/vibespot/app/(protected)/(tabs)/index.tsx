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
import UpcomingeventCard from '@/components/event-components/upcoming-event-card';
import { useEvent } from '@/hooks/useEvent';

const AnimatedScrollView = Animated.ScrollView;

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const openSheet = (event: Event) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(event);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const { isPending, error, data } = useEvent();

  if (isPending) {
    return (
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="fuchsia" />
          <Text className="text-gray-500">Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No events available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">Error fetching events: {(error as Error).message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <View className="flex-1">
        <View className='h-fit'>
          <Text className="text-left mx-11 text-2xl font-semibold">Upcoming Event</Text>
        </View>
        {data.slice(0, 1).map(event => (
          <UpcomingeventCard key={event.id} event={event} onLongPress={() => openSheet(event)} />
        ))}
        <View className="flex flex-row mt-10 w-11/12 mx-auto ml-11 h-fit">
          <Text className="text-2xl font-semibold text-center items-start justify-start">Happening Now</Text>
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
