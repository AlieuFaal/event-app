import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Event } from "../../../../../../packages/database/src/schema";

export default function EventDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFilled, setIsFilled] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await apiClient.events[":id"].$get({
                    param: { id: id as string }
                });

                if (res.ok) {
                    const data = await res.json();
                    const event = {
                        ...data,
                        startDate: new Date(data.startDate),
                        endDate: new Date(data.endDate),
                        repeatEndDate: data.repeatEndDate ? new Date(data.repeatEndDate) : null,
                        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
                    } as Event;

                    setEvent(event);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }

    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']} style={{ backgroundColor: '#ffffff' }}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!event) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']} style={{ backgroundColor: '#ffffff' }}>
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">Event not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']} style={{ backgroundColor: '#ffffff' }}>
            {/* Header with Back Button */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <Pressable onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text className="text-xl font-semibold flex-1 text-black">Event Details</Text>
                <Pressable onPress={() => setIsFilled(!isFilled)} className="active:scale-110">
                    <Star fill={`${isFilled ? "#FFFF00" : "#ffffff"}`} />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* {event.image && (
                    <Image
                        source={{ uri: event.image }}
                        className="w-full h-64"
                        resizeMode="cover"
                    />
                )} */}

                <View className="p-6">
                    <Text className="text-3xl font-bold mb-2 text-black">{event.title}</Text>

                    <View className="bg-purple-100 self-start px-3 py-1 rounded-full mb-4">
                        <Text className="text-purple-700 font-medium">{event.genre}</Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Calendar size={20} color="#6b7280" />
                        <Text className="ml-2 text-gray-700">
                            {new Date(event.startDate).toLocaleDateString('en-US', {
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
                            {new Date(event.endDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <MapPin size={20} color="#6b7280" />
                        <Text className="ml-2 text-gray-700">{event.address}</Text>
                    </View>

                    <Text className="text-lg font-semibold mb-2 text-black">About This Event</Text>
                    <Text className="text-gray-700 leading-6 mb-6">
                        {event.description || "No description available."}
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
                            <Text className="text-white font-semibold">View on map</Text>
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