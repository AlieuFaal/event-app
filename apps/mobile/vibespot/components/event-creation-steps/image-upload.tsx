import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/image-upload";
import type { eventInsertSchema } from "@vibespot/validation";
import * as Crypto from "expo-crypto";
import * as ImagePicker from 'expo-image-picker';
import { LucideImagePlus, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { View, TouchableOpacity, Image } from "react-native";
import type z from "zod";
import { Button } from "@/components/ui/button";

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
    onUploadStateChange?: (isUploading: boolean) => void;
}

export function ImageUpload({ form, onUploadStateChange }: Props) {
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const eventDraftId = useMemo(() => Crypto.randomUUID(), []);
    const { data: session } = authClient.useSession();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.86,
            preferredAssetRepresentationMode:
                ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
        });

        if (!result.canceled) {
            const selectedUri = result.assets[0].uri;
            const userId = session?.user.id;

            if (!userId) {
                console.error("User is not authenticated.");
                return;
            }

            try {
                setIsUploading(true);
                onUploadStateChange?.(true);
                setImage(selectedUri);
                const { url } = await uploadImage({
                    uri: selectedUri,
                    kind: "event",
                    userId,
                    resourceId: eventDraftId,
                });
                form.setValue('imageUrl', url);
                console.log("Image has been uploaded")
            } catch (error) {
                setImage(null);
                form.setValue('imageUrl', null);
                console.error("Failed to upload image:", error);
            } finally {
                setIsUploading(false);
                onUploadStateChange?.(false);
            }
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
            <Button className="w-10/12 h-80 bg-secondary-foreground/20 dark:bg-secondary-foreground/80 rounded-2xl mx-auto mt-10 flex items-center justify-center active:opacity-10" onPress={pickImage} disabled={isUploading}>
                {!image && !isUploading && (
                    <LucideImagePlus size={34} />
                )}
                {isUploading && (
                    <CardDescription className="text-secondary-foreground dark:text-white text-base text-center">
                        Uploading image...
                    </CardDescription>
                )}
                {image && !isUploading && (
                    <Image source={{ uri: image }} className="w-fit h-80 rounded-2xl aspect-square" />
                )}
                {image && !isUploading && (
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
