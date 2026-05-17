import { zodResolver } from "@hookform/resolvers/zod";
import { type UserForm, userFormSchema } from "@vibespot/database/schema";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
	ArrowLeft,
	Camera,
	Check,
	ListMinus,
	LucideImagePlus,
	MapPin,
	Phone,
	User,
	X,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	ActivityIndicator,
	Image,
	RefreshControl,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/image-upload";
import { queryClient } from "@/lib/query-client";

export default function EditProfile() {
	const { data, isPending, error, refetch } = authClient.useSession();
	const [refreshing, setRefreshing] = useState(false);
	const router = useRouter();
	const currentUser = data?.user;
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const colorScheme = useColorScheme();
	const {
		handleMomentumScrollBegin,
		handleMomentumScrollEnd,
		handleScroll,
		handleScrollEnd,
	} = useTabBarScrollVisibility();

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries();
		setRefreshing(false);
	}, []);

	const form = useForm<UserForm>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			id: currentUser?.id ?? "",
			name: currentUser?.name ?? "",
			phone: currentUser?.phone ?? "",
			location: currentUser?.location ?? "",
			bio: currentUser?.bio ?? "",
			role: currentUser?.role === "user" ? "user" : "artist",
		},
	});

	const goBack = () => {
		Haptics.impactAsync();
		router.back();
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
		Haptics.selectionAsync();

		if (!result.canceled) {
			const selectedUri = result.assets[0].uri;
			const userId = data?.user.id;

			if (!userId) {
				alert("User not found");
				return;
			}

			try {
				setIsUploadingImage(true);
				const { url } = await uploadImage({
					uri: selectedUri,
					kind: "avatar",
					userId,
				});
				await authClient.updateUser({ image: url });
				await refetch();
			} catch (error) {
				alert("Failed to upload image");
				console.error("Failed to upload image:", error);
			} finally {
				setIsUploadingImage(false);
			}
		}
	};

	const removeImage = () => {
		Haptics.impactAsync();
		authClient.updateUser({ image: null });
		console.log("Image has been removed");
		refetch();
	};

	const handleSubmit = async () => {
		const id = data?.user?.id || "";
		const values = form.getValues();

		Haptics.impactAsync();

		try {
			const result = await apiClient.users.updateprofile[":id"].$put({
				param: { id: id },
				json: {
					id: id,
					name: values.name || "",
					phone: values.phone || "",
					location: values.location || "",
					bio: values.bio || "",
				},
			});

			if (result.status === 200) {
				refetch();
				alert("Profile updated successfully");
			} else {
				alert("Failed to update profile");
			}
		} catch (error) {
			alert("Error updating profile");
			console.error("Failed to update profile:", error);
		}
	};

	if (isPending) {
		return (
			<SafeAreaView className="flex-1" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#8b5cf6" />
					<Text className="mt-4 text-gray-600 dark:text-gray-300">
						Loading user...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!data?.user) {
		return (
			<SafeAreaView className="flex-1" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<Text className="text-gray-600 dark:text-gray-300">
						User not found
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView className="flex-1" edges={["top"]}>
				<View className="flex-1 items-center justify-center">
					<Text className="text-red-500 dark:text-red-400">
						Error loading user: {(error as Error).message}
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1" edges={["top"]}>
			<View className="flex-row items-center border-gray-200 border-b px-4 py-3 dark:border-gray-800">
				<Button
					hitSlop={8}
					onPress={goBack}
					pressRetentionOffset={{ top: 16, right: 16, bottom: 16, left: 16 }}
					className="mr-2 h-12 w-12 bg-transparent p-0 active:opacity-50 dark:bg-transparent dark:active:opacity-50"
				>
					<ArrowLeft size={24} color="#8b5cf6" />
				</Button>
				<Text className="flex-1 font-semibold text-gray-900 text-xl dark:text-white">
					Edit Profile
				</Text>
				<Button onPress={handleSubmit}>
					<Check color="white" />
					<Text className="font-semibold text-white">Save</Text>
				</Button>
			</View>
			<KeyboardAwareScrollView
				keyboardDismissMode="interactive"
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
				onMomentumScrollBegin={handleMomentumScrollBegin}
				onMomentumScrollEnd={handleMomentumScrollEnd}
				onScroll={handleScroll}
				onScrollEndDrag={handleScrollEnd}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				showsVerticalScrollIndicator={false}
			>
				<View className="mt-8 flex flex-row items-center border-none bg-transparent">
					<Button
						className="ml-5 flex h-32 w-32 rounded-2xl bg-secondary-foreground/20 active:opacity-10 dark:bg-secondary-foreground/80"
						onPress={pickImage}
						disabled={isUploadingImage}
					>
						{!data.user?.image && <LucideImagePlus size={34} />}
						{data.user?.image && (
							<View>
								<Image
									source={{ uri: data.user?.image || undefined }}
									className="aspect-square h-32 w-32 rounded-2xl"
								/>
								<TouchableOpacity
									onPress={removeImage}
									className="absolute -top-3.5 -right-3.5 rounded-full bg-black/50 p-3"
								>
									<X size={20} color="white" />
								</TouchableOpacity>
							</View>
						)}
					</Button>
					<View className="flex-1">
						<View className="mx-8">
							<Text className="font-extrabold text-3xl text-gray-900 dark:text-white">
								{data.user?.name}
							</Text>
							<Text className="text- mt-2 text-gray-600 text-md dark:text-gray-400">
								{data.user?.email}
							</Text>
							<Pressable onPress={pickImage}>
								<View className="mt-6 flex h-10 flex-row items-center gap-3">
									<Camera
										size={16}
										color={colorScheme === "dark" ? "white" : "black"}
										className=""
									/>
									<Text className="font-semibold text-gray-600 active:scale-95 active:opacity-50 dark:text-gray-400">
										Change photo
									</Text>
								</View>
							</Pressable>
						</View>
					</View>
				</View>
				<Text className="mt-6 mb-2 px-8 font-semibold text-gray-600 dark:text-gray-500">
					Personal Info
				</Text>
				<View className="flex flex-col px-8">
					<View>
						<Label nativeID="name-label" className="p-2 dark:text-gray-400">
							Name
						</Label>
						<Controller
							control={form.control}
							name="name"
							render={({ field }) => (
								<View className="flex flex-row items-center gap-1">
									<User
										color={colorScheme === "dark" ? "white" : "black"}
										className=""
										size={16}
									/>
									<Input
										id="name"
										placeholder="Ludvig Skoeld"
										className="-mx-7 h-fit rounded-sm bg-gray-200 p-6 text-black dark:border-secondary-foreground dark:bg-gray-900/40 dark:text-white"
										placeholderTextColor="#00000"
										value={field.value}
										onChangeText={field.onChange}
									/>
								</View>
							)}
						/>
					</View>
					<View>
						<Label nativeID="phone-label" className="p-2 dark:text-gray-400">
							Phone
						</Label>
						<Controller
							control={form.control}
							name="phone"
							render={({ field }) => (
								<View className="flex flex-row items-center gap-1">
									<Phone
										color={colorScheme === "dark" ? "white" : "black"}
										className=""
										size={16}
									/>
									<Input
										id="phone"
										placeholder="0701234567"
										className="-mx-7 h-fit rounded-sm bg-gray-200 p-6 text-black dark:border-secondary-foreground dark:bg-gray-900/40 dark:text-white"
										placeholderTextColor="#00000"
										value={field.value || ""}
										onChangeText={field.onChange}
									/>
								</View>
							)}
						/>
					</View>
					<View>
						<Label nativeID="location-label" className="p-2 dark:text-gray-400">
							Location
						</Label>
						<Controller
							control={form.control}
							name="location"
							render={({ field }) => (
								<View className="flex flex-row items-center gap-1">
									<MapPin
										color={colorScheme === "dark" ? "white" : "black"}
										className=""
										size={16}
									/>
									<Input
										id="location"
										placeholder="Varberg, Halland"
										className="-mx-7 h-fit rounded-sm bg-gray-200 p-6 text-black dark:border-secondary-foreground dark:bg-gray-900/40 dark:text-white"
										placeholderTextColor="#00000"
										value={field.value || ""}
										onChangeText={field.onChange}
									/>
								</View>
							)}
						/>
					</View>
					<View>
						<Label nativeID="bio-label" className="p-2 dark:text-gray-400">
							Bio
						</Label>
						<Controller
							control={form.control}
							name="bio"
							render={({ field }) => (
								<View className="flex flex-row items-center gap-1">
									<ListMinus
										color={colorScheme === "dark" ? "white" : "black"}
										className=""
										size={16}
									/>
									<Input
										id="bio"
										placeholder="Tell people about yourself..."
										className="right -mx-7 h-32 rounded-sm bg-gray-200 p-6 text-black dark:border-secondary-foreground dark:bg-gray-900/40 dark:text-white"
										placeholderTextColor="#00000"
										value={field.value || ""}
										onChangeText={field.onChange}
									/>
								</View>
							)}
						/>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}
