import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { eventInsertSchema } from "@vibespot/validation";
import { LucideImagePlus, X } from "lucide-react-native";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import type z from "zod";
import { Button } from "@/components/ui/button";

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function ImageUpload({ form }: Props) {
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            form.setValue('imageUrl', image);
        }

        console.log(form.getValues());
    };

    const removeImage = () => {
        setImage(null);
        form.setValue('imageUrl', null);
        console.log(form.getValues());
    }

    return (
        <View className="flex-1">
            <View className="">
                <CardHeader className="flex flex-col items-center mt-5 gap-2">
                    <CardTitle className="text-5xl text-secondary-foreground dark:text-white text-center">Add a Event Image</CardTitle>
                    <CardDescription className="text-secondary-foreground dark:text-white text-base text-center mt-2">
                        (Optional) Select an image that fits the vibe of your event.
                    </CardDescription>
                </CardHeader>
            </View>
            <Button className="w-10/12 h-80 bg-secondary-foreground/20 dark:bg-secondary-foreground/80 rounded-2xl mx-auto mt-10 flex items-center justify-center active:opacity-10" onPress={pickImage}>
                {!image && (
                    <LucideImagePlus size={34} />
                )}
                {image && (
                    <Image source={{ uri: image }} className="w-fit h-80 rounded-2xl aspect-square" />
                )}
                {image && (
                    <TouchableOpacity
                        onPress={removeImage}
                        className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
                    >
                        <X size={24} color="white" />
                    </TouchableOpacity>
                )}
            </Button>
        </View>
    );
}       