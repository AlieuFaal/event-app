import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { EventCard1 } from "@/components/event-components/event-card-1";
import { apiClient } from "@/lib/api-client";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "../../../../../../packages/database/src/schema";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Animated from "react-native-reanimated";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Calendar, Flag, Heart, MapPin, ReceiptText, Share } from "lucide-react-native";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";


const AnimatedScrollView = Animated.ScrollView;

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const router = useRouter();

  const openSheet = (event: Event) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEvent(event);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleViewDetails = useCallback(() => {
    if (selectedEvent) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      router.push(`/event-details/${selectedEvent.id}`);
      console.log("Navigating to details for event ID:", selectedEvent.id);
      bottomSheetRef.current?.close();
    }
  }, [router, selectedEvent]);

  const { isPending, error, data } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
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

        return events;
      } else {
        throw new Error('Failed to fetch events');
      }
    }
  });

  if (isPending) {
    return (
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1 justify-center items-center">
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
        <View className="bg-gray-100 w-10/12 justify-center items-center rounded-3xl mx-auto p-16 mt-5 shadow drop-shadow-lg border-1">
          <Text className="text-3xl text-center">BOX 1</Text>
        </View>
        <View className="flex flex-row mt-10 w-11/12 mx-auto ml-11 h-fit">
          <Text className="text-2xl font-semibold text-center items-start justify-start">Happening Now</Text>
        </View>
        <AnimatedScrollView horizontal={true} showsHorizontalScrollIndicator={false} className={"px-9 py-3"} contentContainerStyle={{ columnGap: 25 }}>
          {data.slice(0, 5).map((event) => (
            <EventCard1 key={event.id} event={event} onLongPress={() => openSheet(event)} />
          ))}
        </AnimatedScrollView>
        <BottomSheet ref={bottomSheetRef} onChange={handleSheetChange} index={-1} snapPoints={snapPoints} enablePanDownToClose={true} onClose={handleClosePress} >
          <BottomSheetView className="flex-1">

            <View className="items-center">
              <Text className="text-lg font-semibold mt-1">Event Actions</Text>
            </View>

            <View className="">

              <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 shadow-sm drop-shadow-sm transition-all duration-200" onPress={handleViewDetails}>
                <ReceiptText size={24} />
                <Text className="text-center p-5">View Details</Text>
              </Pressable>

              <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 shadow-sm drop-shadow-sm transition-all duration-200" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Heart size={24} />
                <Text className="text-center p-5">Save Event</Text>
              </Pressable>

              <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 shadow-sm drop-shadow-sm transition-all duration-200" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Calendar size={24} />
                <Text className="text-center p-5">Add To Calendar</Text>
              </Pressable>

              <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 shadow-sm drop-shadow-sm transition-all duration-200" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <MapPin size={24} />
                <Text className="text-center p-5">View On Map</Text>
              </Pressable>

              <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 shadow-sm drop-shadow-sm transition-all duration-200" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Share size={24} />
                <Text className="text-center p-5">Share Event</Text>
              </Pressable>

              <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 shadow-sm drop-shadow-lg transition-all duration-200 mb-5" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Flag size={24} fill={"red"} fillOpacity={80} />
                <Text className="text-center text-red-500 p-5">Report Event</Text>
              </Pressable>

            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}
