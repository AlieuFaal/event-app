import { View, Image, Pressable } from "react-native";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Event } from "../../../../../packages/database/src/schema";
import { PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6 } from "@/assets";
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics';

export default function UpcomingeventCard({ event, onLongPress }: { event: Event, onLongPress: (event: Event) => void }) {
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

    const handleLongPress = () => {
        console.log("Event long-pressed:", event.title);
        onLongPress(event);
    }

    return (
        <Pressable className="active:scale-95 transition-transform duration-200"
            onPress={onPress}
            onLongPress={handleLongPress}
            delayLongPress={500}>
            <Card className="bg-gray-100 dark:bg-gray-900 w-10/12 min-h-36 max-h-36 justify-center items-center rounded-3xl mx-auto mt-5 shadow drop-shadow-lg border-primary">
                <CardContent className='w-full flex flex-row justify-around items-center p-1 gap-2 rounded-xl'>
                    <View className="w-32 h-28 justify-center items-center overflow-hidden rounded-sm border-1">
                        <Image className="w-full h-full aspect-video" source={randomImage()} resizeMode="cover" />
                    </View>
                    <View className=' w-40 h-28 items-center rounded-2xl p-2 -left-2'>
                        <CardHeader className=''>
                            <CardTitle className="text-sm line-clamp-1 w-full text-gray-900 dark:text-white">{event.title}</CardTitle>
                            <CardDescription className="text-sm line-clamp-1 text-gray-600 dark:text-gray-300">{event.description}</CardDescription>
                            <CardDescription className="text-sm line-clamp-1 text-gray-600 dark:text-gray-300">{event.address}</CardDescription>
                        </CardHeader>
                    </View>
                </CardContent>
            </Card>
        </Pressable>
    );
}