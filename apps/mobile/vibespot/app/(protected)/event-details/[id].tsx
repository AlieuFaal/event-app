import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ArrowLeft, Calendar, MapPin, Clock, Star } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6 } from "@/assets";
import { queryClient } from "@/app/_layout";
import { RefreshControl } from "react-native-gesture-handler";
import { useEventId } from "@/hooks/useEventId";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import * as Haptics from 'expo-haptics';

export default function EventDetails() {
    const params = useLocalSearchParams();
    const eventId = typeof params.id === 'string' ? params.id : params.id?.[0];
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const session = authClient.useSession();

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries();
        setRefreshing(false);
    }, []);

    const { isPending, error, data } = useEventId(eventId);

    function randomImage() {
        let images = [PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6];
        return images[Math.floor(Math.random() * images.length)];
    }

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

    if (isPending) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#8b5cf6" />
                    <Text className="text-gray-600 dark:text-gray-300 mt-4">Loading events...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-600 dark:text-gray-300">Event not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500 dark:text-red-400">Error loading event: {(error as Error).message}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <Pressable onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#8b5cf6" />
                </Pressable>
                <Text className="text-xl font-semibold flex-1 text-gray-900 dark:text-white">Event Details</Text>
                <Pressable onPress={handleSaveEvent} className="active:scale-110">
                    <Star fill={isFavorited ? "#FFFF00" : "transparent"} stroke={isFavorited ? "#FFFF00" : "#8b5cf6"} />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>

                <Image
                    source={randomImage()}
                    className="w-full h-64 aspect-auto"
                    resizeMode="cover"
                />

                <View className="p-6 bg-white dark:bg-gray-900">
                    <Text className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{data.title}</Text>

                    <View className="bg-purple-100 dark:bg-purple-900/30 self-start px-3 py-1 rounded-full mb-4">
                        <Text className="text-purple-700 dark:text-purple-400 font-medium">{data.genre}</Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Calendar size={20} color="#8b5cf6" />
                        <Text className="ml-2 text-gray-700 dark:text-gray-300">
                            {new Date(data.startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Clock size={20} color="#8b5cf6" />
                        <Text className="ml-2 text-gray-700 dark:text-gray-300">
                            {new Date(data.endDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <MapPin size={20} color="#8b5cf6" />
                        <Text className="ml-2 text-gray-700 dark:text-gray-300">{data.address}</Text>
                    </View>

                    <Text className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">About This Event</Text>
                    <Text className="text-gray-700 dark:text-gray-300 leading-6 mb-6">
                        {data.description || "No description available."}
                    </Text>

                    {/* {event.price && (
                        <View className="mb-6">
                            <Text className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Ticket Price</Text>
                            <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                ${event.price}
                            </Text>
                        </View>
                    )} */}

                    <View className="flex-row gap-3 mt-4">
                        <Button className="flex-1 bg-purple-600 dark:bg-purple-700 p-4 rounded-xl h-fit">
                            <Text className="text-white font-semibold">Add To Calendar</Text>
                        </Button>
                        <Button variant="outline" className="px-6 py-4 rounded-xl border-purple-600 dark:border-purple-500 dark:bg-card-foreground h-fit">
                            <Text className="text-purple-600 dark:text-purple-400 font-semibold">Share</Text>
                        </Button>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}