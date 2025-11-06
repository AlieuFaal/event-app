import { PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6 } from "@/assets";
import { Event } from "../../../../../packages/database/src/schema";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Pressable, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics';


export function EventCard1({ event, onLongPress }: { event: Event, onLongPress: (event: Event) => void }) {

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
        <Pressable className="active:scale-90 transition-transform duration-200"
            onPress={onPress}
            onLongPress={handleLongPress}
            delayLongPress={500}>
            <Card className="bg-gray-100 w-80 items-center rounded-3xl mx-auto h-96 mt-2 shadow drop-shadow-lg border-primary">
                <CardContent className="w-full bg-gray-200 mx-auto rounded-t-3xl -top-6 h-4/5 justify-center items-center border-b-1 overflow-hidden">
                    <Image className="rounded-3xl w-full h-full aspect-video" source={randomImage()} resizeMode="cover" />
                </CardContent>
                <CardContent className="w-full h-fit justify-center items-center -top-12">
                    <CardTitle className="text-xl mt-6">{event.title}</CardTitle>
                    <CardDescription className="text-lg line-clamp-1">{event.description}</CardDescription>
                </CardContent>
            </Card>
        </Pressable>
    );
}