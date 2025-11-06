import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft, Calendar, MapPin, Clock, Star } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Event } from "../../../../../../packages/database/src/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6 } from "@/assets";
import { queryClient } from "@/app/_layout";
import * as Haptics from 'expo-haptics';
import { authClient } from "@/lib/auth-client";

export default function EventDetails() {
    const params = useLocalSearchParams();
    const eventId = typeof params.id === 'string' ? params.id : params.id?.[0];
    const router = useRouter();
    const session = authClient.useSession();

    const { isPending, error, data } = useQuery<Event, Error>({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const res = await apiClient.events[':id'].$get({ param: { id: eventId as string } });

            if (res.ok) {
                const events = await res.json();

                return {
                    ...events,
                    startDate: new Date(events.startDate),
                    endDate: new Date(events.endDate),
                    repeatEndDate: events.repeatEndDate ? new Date(events.repeatEndDate) : null,
                    createdAt: events.createdAt ? new Date(events.createdAt) : undefined,
                } as Event;
            } else {
                throw new Error('Failed to fetch event');
            }
        },
        enabled: !!eventId,
    });

    const mutation = useMutation({
        mutationFn: async (eventId: string) => {
            return apiClient.events.favorites[":eventId"].$post({ param: { eventId } });
        },
        onSuccess: () => {
            console.log('Event saved or deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['favoriteEvent', eventId, session.data?.user?.id] });
            queryClient.invalidateQueries({ queryKey: ['favoriteEvents', session.data?.user?.id] });
        },
    });

    const { data: isFavorited = false } = useQuery({
        queryKey: ['favoriteEvent', eventId, session.data?.user?.id],
        queryFn: async () => {
            if (!session.data?.user?.id) return false;

            const res = await apiClient.events.favorites[':userid'].$get({
                param: { userid: session.data.user.id }
            });

            if (res.ok) {
                const events = await res.json();
                return events.some((item: any) => item.event.id === eventId);
            }
            return false;
        },
        enabled: !!eventId && !!session.data?.user?.id,
    });

    const handleSaveEvent = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log("Save Event pressed");

        if (eventId) {
            mutation.mutate(eventId);
        }
    }, [eventId, mutation]);

    function randomImage() {
        let images = [PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6];
        return images[Math.floor(Math.random() * images.length)];
    }

    if (isPending) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']} style={{ backgroundColor: '#ffffff' }}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']} style={{ backgroundColor: '#ffffff' }}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Event not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']} style={{ backgroundColor: '#ffffff' }}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500">Error loading event: {(error as Error).message}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']} style={{ backgroundColor: '#ffffff' }}>
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <Pressable onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text className="text-xl font-semibold flex-1 text-black">Event Details</Text>
                <Pressable onPress={handleSaveEvent} className="active:scale-110">
                    <Star fill={isFavorited ? "#FFFF00" : "#ffffff"} />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                <Image
                    source={randomImage()}
                    className="w-full h-64 aspect-auto"
                    resizeMode="cover"
                />

                <View className="p-6">
                    <Text className="text-3xl font-bold mb-2 text-black">{data.title}</Text>

                    <View className="bg-purple-100 self-start px-3 py-1 rounded-full mb-4">
                        <Text className="text-purple-700 font-medium">{data.genre}</Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Calendar size={20} color="#6b7280" />
                        <Text className="ml-2 text-gray-700">
                            {new Date(data.startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Clock size={20} color="#6b7280" />
                        <Text className="ml-2 text-gray-700">
                            {new Date(data.endDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <MapPin size={20} color="#6b7280" />
                        <Text className="ml-2 text-gray-700">{data.address}</Text>
                    </View>

                    <Text className="text-lg font-semibold mb-2 text-black">About This Event</Text>
                    <Text className="text-gray-700 leading-6 mb-6">
                        {data.description || "No description available."}
                    </Text>

                    {/* {event.price && (
                        <View className="mb-6">
                            <Text className="text-lg font-semibold mb-2 text-black">Ticket Price</Text>
                            <Text className="text-2xl font-bold text-purple-600">
                                ${event.price}
                            </Text>
                        </View>
                    )} */}

                    <View className="flex-row gap-3 mt-4">
                        <Button className="flex-1 bg-purple-600 p-4 rounded-xl h-fit">
                            <Text className="text-white font-semibold">Add To Calendar</Text>
                        </Button>
                        <Button variant="outline" className="px-6 py-4 rounded-xl border-purple-600 h-fit">
                            <Text className="text-purple-600 font-semibold">Share</Text>
                        </Button>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}