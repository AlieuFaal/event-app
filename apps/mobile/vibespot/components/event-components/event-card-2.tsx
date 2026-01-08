import { View, Image, Pressable } from "react-native";
import { PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6 } from "@/assets";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics';
import type { Event } from "@vibespot/validation";

export default function EventCard2({ event }: { event: Event }) {
    const router = useRouter();

    function randomImage() {
        let images = [PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6];
        return images[Math.floor(Math.random() * images.length)];
    }

    const onPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        console.log("Event pressed:", event.title);
        router.push({ pathname: "/(protected)/event-details/[id]", params: { id: event.id } });
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <Pressable className="active:scale-90 transition-transform duration-200" onPress={onPress}>
            <View className="flex flex-row border border-primary bg-white dark:bg-secondary-foreground dark:border-0 rounded-lg p-4 mb-5 shadow-sm">
                <View className="w-24 h-24 justify-center items-center overflow-hidden rounded-sm border-1">
                    <Image className="w-full h-full aspect-video" source={event.imageUrl ? { uri: event.imageUrl } : randomImage()} resizeMode="cover" />
                </View>
                <View className='items-center rounded-2xl p-2 -left-2'>
                    <CardHeader>
                        <CardTitle className="text-sm line-clamp-1 w-full text-gray-900 dark:text-white">{event.title}</CardTitle>
                        <CardDescription className="text-sm line-clamp-1 text-gray-600 dark:text-gray-300">{event.address}</CardDescription>
                        <CardDescription className="text-sm line-clamp-1 text-gray-600 dark:text-gray-300">{formatDate(event.startDate.toString())}</CardDescription>
                    </CardHeader>
                </View>
            </View>
        </Pressable>
    );
}