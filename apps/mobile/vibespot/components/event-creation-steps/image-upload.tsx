import type { eventInsertSchema } from "@vibespot/validation";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImagePlus, Sparkles, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
	Alert,
	Image,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import type z from "zod";
import {
	PlaceholderImage1,
	PlaceholderImage2,
	PlaceholderImage3,
	PlaceholderImage4,
	PlaceholderImage5,
	PlaceholderImage6,
} from "@/assets";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/image-upload";

interface Props {
	form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
	onUploadStateChange?: (isUploading: boolean) => void;
}

const suggestedImages = [
	{ id: "placeholder-1", source: PlaceholderImage1 },
	{ id: "placeholder-2", source: PlaceholderImage2 },
	{ id: "placeholder-3", source: PlaceholderImage3 },
	{ id: "placeholder-4", source: PlaceholderImage4 },
	{ id: "placeholder-5", source: PlaceholderImage5 },
	{ id: "placeholder-6", source: PlaceholderImage6 },
];

export function ImageUpload({ form, onUploadStateChange }: Props) {
	const [image, setImage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [selectedPlaceholderId, setSelectedPlaceholderId] = useState<
		string | null
	>(null);
	const eventDraftId = useMemo(() => Crypto.randomUUID(), []);
	const { data: session } = authClient.useSession();

	const uploadSelectedImage = async (
		selectedUri: string,
		placeholderId: string | null = null,
	) => {
		const userId = session?.user.id;

		if (!userId) {
			console.error("User is not authenticated.");
			return;
		}

		try {
			setIsUploading(true);
			onUploadStateChange?.(true);
			setImage(selectedUri);
			setSelectedPlaceholderId(placeholderId);

			const { url } = await uploadImage({
				uri: selectedUri,
				kind: "event",
				userId,
				resourceId: eventDraftId,
			});
			form.setValue("imageUrl", url);
			console.log("Image has been uploaded");
		} catch (error) {
			setImage(null);
			setSelectedPlaceholderId(null);
			form.setValue("imageUrl", null);
			console.error("Failed to upload image:", error);
		} finally {
			setIsUploading(false);
			onUploadStateChange?.(false);
		}
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.86,
			preferredAssetRepresentationMode:
				ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
		});

		if (!result.canceled) {
			await uploadSelectedImage(result.assets[0].uri);
		}
		console.log(form.getValues());
	};

	const takePhoto = async () => {
		const permission = await ImagePicker.requestCameraPermissionsAsync();

		if (!permission.granted) {
			Alert.alert(
				"Camera access needed",
				"Allow camera access in settings to take a photo, or choose an image from your library.",
			);
			console.error("Camera permission was not granted.");
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.86,
		});

		if (!result.canceled) {
			await uploadSelectedImage(result.assets[0].uri);
		}
		console.log(form.getValues());
	};

	const selectPlaceholder = async (
		placeholder: (typeof suggestedImages)[number],
	) => {
		const resolvedAsset = Image.resolveAssetSource(placeholder.source);

		if (!resolvedAsset?.uri) {
			console.error("Unable to resolve placeholder image asset.");
			return;
		}

		await uploadSelectedImage(resolvedAsset.uri, placeholder.id);
		console.log(form.getValues());
	};

	const removeImage = () => {
		setImage(null);
		setSelectedPlaceholderId(null);
		form.setValue("imageUrl", null);
		console.log(form.getValues());
	};

	return (
		<View className="flex-1 pb-8">
			<View className="overflow-hidden rounded-3xl border border-purple-400 bg-white/70 dark:border-purple-500/70 dark:bg-white/10">
				<Pressable
					className="h-64 items-center justify-center overflow-hidden active:opacity-80"
					disabled={isUploading}
					onPress={pickImage}
				>
					{!image && !isUploading && (
						<View className="items-center gap-3 px-6">
							<View className="h-16 w-16 items-center justify-center rounded-full bg-white/80 dark:bg-black/30">
								<ImagePlus size={30} color="#7c3aed" />
							</View>
							<Text className="text-center font-semibold text-base text-gray-950 dark:text-white">
								Choose an image from your library
							</Text>
						</View>
					)}
					{isUploading && (
						<Text className="text-center text-base text-gray-950 dark:text-white">
							Uploading image...
						</Text>
					)}
					{image && !isUploading && (
						<Image
							className="h-full w-full"
							resizeMode="cover"
							source={{ uri: image }}
						/>
					)}
				</Pressable>

				{image && !isUploading && (
					<TouchableOpacity
						className="absolute top-3 right-3 rounded-full bg-black/60 p-2 active:opacity-70"
						onPress={removeImage}
					>
						<X size={22} color="white" />
					</TouchableOpacity>
				)}
			</View>

			<View className="mt-4 flex-row gap-3">
				<Button
					className="h-12 flex-1 rounded-2xl bg-purple-600 active:opacity-80 dark:bg-white/15"
					disabled={isUploading}
					onPress={pickImage}
				>
					<ImagePlus size={20} color="white" />
					<Text className="font-semibold text-white">Library</Text>
				</Button>
				<Button
					className="h-12 flex-1 rounded-2xl bg-purple-600 active:opacity-80 dark:bg-white/15"
					disabled={isUploading}
					onPress={takePhoto}
				>
					<Camera size={20} color="white" />
					<Text className="font-semibold text-white">Take photo</Text>
				</Button>
			</View>

			<View className="mt-8 gap-3">
				<View className="flex-row items-center gap-2">
					<Sparkles size={18} color="#7c3aed" />
					<Text className="font-semibold text-gray-950 dark:text-white">
						Suggested styles
					</Text>
				</View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="-mx-5"
					contentContainerClassName="gap-3 px-5"
				>
					{suggestedImages.map((placeholder) => {
						const isSelected = selectedPlaceholderId === placeholder.id;

						return (
							<Pressable
								className={`h-28 w-36 overflow-hidden rounded-2xl border-2 active:opacity-80 ${
									isSelected
										? "border-purple-500"
										: "border-purple-100 dark:border-white/10"
								}`}
								disabled={isUploading}
								key={placeholder.id}
								onPress={() => selectPlaceholder(placeholder)}
							>
								<Image
									className="h-full w-full"
									resizeMode="cover"
									source={placeholder.source}
								/>
								<View className="absolute inset-x-0 bottom-0 bg-black/45 px-3 py-2">
									<Text className="font-semibold text-white text-xs">
										Use this style
									</Text>
								</View>
							</Pressable>
						);
					})}
				</ScrollView>
			</View>
		</View>
	);
}
