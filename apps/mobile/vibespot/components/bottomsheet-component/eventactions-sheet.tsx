import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Calendar, Flag, Heart, MapPin, ReceiptText, Share } from "lucide-react-native";
import { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import { Event } from "../../../../../packages/database/src/schema";
import * as Haptics from 'expo-haptics';
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/app/_layout";

interface EventDetailsSheetProps {
    selectedEvent: Event | null;
    bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
    snapPoints: string[];
}

export function EventActionsSheet({ selectedEvent, bottomSheetRef, snapPoints }: EventDetailsSheetProps) {
    const router = useRouter();
    const session = authClient.useSession();
    const { colorScheme } = useColorScheme();

    const handleSheetChange = useCallback((index: number) => {
        console.log("handleSheetChange", index);
    }, []);

    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, [bottomSheetRef]);

    const handleViewDetails = useCallback(() => {
        if (selectedEvent) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            router.push(`/event-details/${selectedEvent.id}`);
            console.log("Navigating to details for event ID:", selectedEvent.id);
            bottomSheetRef.current?.close();
        }
    }, [bottomSheetRef, router, selectedEvent]);

    const mutation = useMutation({
        mutationFn: async (eventId: string) => {
            return apiClient.events.favorites[":eventId"].$post({ param: { eventId } });
        },
        onSuccess: () => {
            console.log('Event saved or deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['favoriteEvent', selectedEvent?.id, session.data?.user?.id] });
            queryClient.invalidateQueries({ queryKey: ['favoriteEvents', session.data?.user?.id] });
        },
    });

    const { data: isFavorited = false } = useQuery({
        queryKey: ['favoriteEvent', selectedEvent?.id, session.data?.user?.id],
        queryFn: async () => {
            if (!selectedEvent?.id || !session.data?.user?.id) return false;

            const res = await apiClient.events.favorites[':userid'].$get({
                param: { userid: session.data.user.id }
            });

            if (res.ok) {
                const events = await res.json();
                return events.some((item: any) => item.event.id === selectedEvent.id);
            }
            return false;
        },
        enabled: !!selectedEvent?.id && !!session.data?.user?.id,
    });

    const handleSaveEvent = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        console.log("Save Event pressed");

        if (selectedEvent) {
            mutation.mutate(selectedEvent.id);
        }
    }, [selectedEvent, mutation]);

    return (
        <BottomSheet 
            ref={bottomSheetRef} 
            onChange={handleSheetChange} 
            index={-1} 
            snapPoints={snapPoints} 
            enablePanDownToClose={true} 
            onClose={handleClosePress}
            backgroundStyle={{
                backgroundColor: colorScheme === 'dark' ? '#111827' : '#ffffff',
            }}
            handleIndicatorStyle={{
                backgroundColor: colorScheme === 'dark' ? '#6b7280' : '#d1d5db',
            }}
        >
            <BottomSheetView className="flex-1 bg-white dark:bg-gray-900">

                <View className="items-center">
                    <Text className="text-lg font-semibold mt-1 text-gray-900 dark:text-white">Event Actions</Text>
                </View>

                <View className="">

                    <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200" onPress={handleViewDetails}>
                        <ReceiptText size={24} className="text-gray-900 dark:text-white" />
                        <Text className="text-center p-5 text-gray-900 dark:text-white">View Details</Text>
                    </Pressable>

                    <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200" onPress={handleSaveEvent}>
                        <Heart size={24} fill={isFavorited ? "#C51104" : "none"} className="text-gray-900 dark:text-white" />
                        <Text className="text-center p-5 text-gray-900 dark:text-white">Save Event</Text>
                    </Pressable>

                    <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <Calendar size={24} className="text-gray-900 dark:text-white" />
                        <Text className="text-center p-5 text-gray-900 dark:text-white">Add To Calendar</Text>
                    </Pressable>

                    <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <MapPin size={24} className="text-gray-900 dark:text-white" />
                        <Text className="text-center p-5 text-gray-900 dark:text-white">View On Map</Text>
                    </Pressable>

                    <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <Share size={24} className="text-gray-900 dark:text-white" />
                        <Text className="text-center p-5 text-gray-900 dark:text-white">Share Event</Text>
                    </Pressable>

                    <Pressable className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200 mb-5" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                        <Flag size={24} fill={"red"} fillOpacity={80} />
                        <Text className="text-center text-red-500 dark:text-red-400 p-5">Report Event</Text>
                    </Pressable>

                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}