import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { eventInsertSchema } from "@vibespot/validation";
import { LucideImagePlus } from "lucide-react-native";
import type { UseFormReturn } from "react-hook-form";
import { View, Text, TouchableOpacity } from "react-native";
import type z from "zod";

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function ImageUpload({ form }: Props) {
    return (
        <View className="flex-1">
            <View className="">
                <CardHeader className="flex flex-col items-center mt-5 gap-2">
                    <CardTitle className="text-5xl text-secondary-foreground dark:text-white text-center">Add a Event Image</CardTitle>
                    <CardDescription className="text-secondary-foreground dark:text-white text-base text-center mt-2">
                        Select an image that fits the vibe of your event.
                    </CardDescription>
                </CardHeader>
            </View>
            <View className="w-10/12 h-72 bg-secondary-foreground/20 dark:bg-secondary-foreground/80 rounded-2xl mx-auto mt-10 flex items-center justify-center active:opacity-70">
                <TouchableOpacity onPress={() => { }}>
                    <LucideImagePlus size={34} />
                </TouchableOpacity>
            </View>
        </View>
    );
}       