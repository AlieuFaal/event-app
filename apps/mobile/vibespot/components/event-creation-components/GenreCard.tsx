import { Genre } from "@/schemas/ZodSchemas";
import { View, Text, Pressable } from "react-native";


interface Props {
    genre: Genre;
    selected: boolean;
    onPress: () => void;
}

export function GenreCard({ genre, selected, onPress }: Props) {

    return (
        <View className="bg-gray-200 dark:bg-secondary-foreground shadow border-0 border-gray-600 items-center justify-center h-24 w-24 m-3 rounded-lg active:scale-95" onTouchEnd={onPress}>
            <View className={`items-center justify-center h-full w-full rounded-lg ${selected ? 'bg-white/5 border border-primary' : 'bg-gray-300 dark:bg-secondary-foreground'}`}>
                <Text className="dark:text-white text-center">{genre}</Text>
            </View>
        </View>
    );
}