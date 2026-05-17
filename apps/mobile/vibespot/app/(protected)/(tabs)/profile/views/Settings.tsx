import type BottomSheet from "@gorhom/bottom-sheet";
import { roleUpdateSchema } from "@vibespot/validation";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
	ChevronLeft,
	ChevronRight,
	Download,
	Lock,
	OctagonAlertIcon,
	ShieldCheck,
	User2,
} from "lucide-react-native";
import React, { useMemo, useRef } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	Share,
	Switch,
	Text,
	View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChangePasswordSheet } from "@/components/bottomsheet-component/changePassword-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";

export default function Settings() {
	const { data, isPending, error, refetch } = authClient.useSession();
	const currentUser = data?.user;
	const {
		handleMomentumScrollBegin,
		handleMomentumScrollEnd,
		handleScroll,
		handleScrollEnd,
	} = useTabBarScrollVisibility();

	const [switchState, setSwitchState] = React.useState(
		currentUser?.role === "artist",
	);
	const [isRoleUpdating, setIsRoleUpdating] = React.useState(false);
	const [isExporting, setIsExporting] = React.useState(false);
	const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);

	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ["65%", "75%", "92%"], []);

	const openSheet = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		bottomSheetRef.current?.snapToIndex(1);
	};

	const goBack = () => {
		Haptics.impactAsync();
		router.back();
	};

	// React.useEffect(() => {
	//   if (!isRoleUpdating) {
	//     // setSwitchState(currentUser?.role === "artist");
	//   }
	// }, [currentUser?.role, isRoleUpdating]);

	const handleRoleToggle = async (checked: boolean) => {
		if (!currentUser?.id || isRoleUpdating) {
			return;
		}

		Haptics.impactAsync();
		setSwitchState(checked);
		setIsRoleUpdating(true);

		try {
			const payload = roleUpdateSchema.parse({
				role: checked ? "artist" : "user",
			});

			const response = await apiClient.users.updaterole[":id"].$put({
				param: { id: currentUser.id },
				json: payload,
			});

			if (!response.ok) {
				const message = await response.text();
				throw new Error(message || "Failed to update role.");
			}

			await queryClient.invalidateQueries();
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		} catch {
			setSwitchState((prev) => !prev);
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert("Role update failed", "Please try again.");
		} finally {
			setIsRoleUpdating(false);
			refetch();
		}
	};

	const handleExportData = async () => {
		if (!currentUser?.id || isExporting) {
			return;
		}

		setIsExporting(true);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		try {
			const response = await apiClient.users[":id"].export.$get({
				param: { id: currentUser.id },
			});

			if (!response.ok) {
				const message = await response.text();
				throw new Error(message || "Failed to export data.");
			}

			const exportPayload = await response.json();
			const baseDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;

			if (!baseDir) {
				throw new Error("Unable to access local storage for export.");
			}

			const fileUri = `${baseDir}vibespot-data-export-${Date.now()}.json`;
			const json = JSON.stringify(exportPayload, null, 2);

			await FileSystem.writeAsStringAsync(fileUri, json, {
				encoding: FileSystem.EncodingType.UTF8,
			});

			await Share.share({
				title: "VibeSpot Data Export",
				url: fileUri,
				message: "Your VibeSpot data export is ready.",
			});
		} catch (err) {
			Alert.alert(
				"Export failed",
				err instanceof Error ? err.message : "Something went wrong.",
			);
		} finally {
			setIsExporting(false);
		}
	};

	const handleDeleteAccount = () => {
		if (isDeletingAccount) {
			return;
		}

		Alert.alert(
			"Delete account?",
			"This permanently removes your account and all associated data.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Continue",
					style: "destructive",
					onPress: () => {
						Alert.alert(
							"Final confirmation",
							"This action cannot be undone. Are you absolutely sure?",
							[
								{ text: "Keep Account", style: "cancel" },
								{
									text: "Delete Account",
									style: "destructive",
									onPress: async () => {
										setIsDeletingAccount(true);

										try {
											const result = await authClient.deleteUser({
												callbackURL: "/",
											});

											if (result?.error) {
												throw new Error(result.error.message);
											}
											refetch();
											Haptics.notificationAsync(
												Haptics.NotificationFeedbackType.Success,
											);
											Alert.alert(
												"Account deleted",
												"Your account has been successfully deleted.",
												[{ text: "OK" }],
											);
										} catch (err) {
											Alert.alert(
												"Delete failed",
												err instanceof Error
													? err.message
													: "Failed to delete your account. Please try again.",
											);
										} finally {
											setIsDeletingAccount(false);
										}
									},
								},
							],
						);
					},
				},
			],
		);
	};

	const _roleLabel = switchState ? "Artist" : "Enthusiast";

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
		<SafeAreaView>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
				showsVerticalScrollIndicator={false}
				onMomentumScrollBegin={handleMomentumScrollBegin}
				onMomentumScrollEnd={handleMomentumScrollEnd}
				onScroll={handleScroll}
				onScrollEndDrag={handleScrollEnd}
				scrollEventThrottle={16}
			>
				<View className="h-52 flex-col items-start gap-4 border-gray-200 dark:border-gray-800">
					<Button
						hitSlop={8}
						onPress={goBack}
						pressRetentionOffset={{ top: 16, right: 16, bottom: 16, left: 16 }}
						className="mr-2 bg-transparent p-3 active:opacity-50 dark:bg-transparent dark:active:opacity-50"
					>
						<View className="h-20 flex-row items-center gap-2">
							<ChevronLeft size={24} color="#8b5cf6" />
							<Text className="font-semibold text-lg dark:text-secondary">
								Profile
							</Text>
						</View>
					</Button>
					<Text className="ml-5 flex-1 font-bold text-4xl text-gray-900 dark:text-white/70">
						Settings
					</Text>
				</View>

				<View className="-mt-20 flex flex-col items-center justify-center">
					<Avatar
						className="h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white shadow-xl dark:border-gray-800"
						alt="ProfileImage"
					>
						<AvatarImage source={{ uri: currentUser?.image || undefined }} />
						<AvatarFallback className="bg-primary">
							<Text className="font-extrabold text-2xl text-white">
								{currentUser?.name
									?.split(" ")
									.map((n: string) => n[0])
									.join("")
									.toLocaleUpperCase()}
							</Text>
						</AvatarFallback>
					</Avatar>
					<Text className="mt-4 font-bold text-2xl text-gray-900 dark:text-white/70">
						{currentUser?.name}
					</Text>
					<Text className="mt-2 text-gray-900 text-md dark:text-gray-400/40">
						{currentUser?.email}
					</Text>
				</View>

				<View className="mx-5 mt-5">
					<Text className="ml-1 font-extrabold text-gray-400/40 uppercase">
						Account mode
					</Text>
					<Card className="mt-2 rounded-2xl border border-gray-500/20 bg-gray-400/40 px-8 dark:bg-secondary-foreground/40">
						<CardContent className="mt-5 flex max-w-60 flex-row gap-3">
							<View className="relative bottom-3 -ml-10 flex max-h-10 w-10 flex-col items-center rounded-xl bg-purple-500/25 p-2">
								<User2 color={"#c4a0f0"} />
							</View>
							<View className="flex flex-col">
								<Text className="-mt-7 font-medium text-gray-900 text-lg dark:text-white/70">
									Artist Mode
								</Text>
								<Text className="text-gray-900 text-xs dark:text-gray-400/40">
									{switchState
										? "Managing your performances & setlists"
										: "Switch to manage your performances"}
								</Text>
							</View>
							<View className="flex flex-row items-center gap-2">
								<Switch
									className="scale-85"
									value={switchState}
									onValueChange={handleRoleToggle}
									disabled={isRoleUpdating}
								/>
							</View>
						</CardContent>
					</Card>
				</View>

				<View className="m-5">
					<Text className="ml-1 font-extrabold text-gray-400/40 uppercase">
						Security
					</Text>
					<Card className="mt-2 rounded-2xl border border-gray-500/20 bg-gray-400/40 px-8 dark:bg-secondary-foreground/40">
						<Pressable className="active:opacity-70" onPress={openSheet}>
							<CardContent className="mt-5 flex flex-row items-center gap-3">
								<View className="relative bottom-3 -ml-10 flex max-h-10 w-10 flex-col items-center rounded-xl bg-blue-500/20 p-2">
									<Lock color={"#7ab4f0"} />
								</View>
								<View className="flex flex-col">
									<Text className="-mt-7 font-medium text-gray-900 text-lg dark:text-white/70">
										Change Password
									</Text>
									<Text className="text-gray-900 text-xs dark:text-gray-400/40">
										Last changed on {new Date().toLocaleDateString()}
									</Text>
								</View>
								<View className="relative bottom-3 left-16 items-center">
									<ChevronRight color={"gray"} className="" />
								</View>
							</CardContent>
						</Pressable>
						<Separator className="-mt-3 w-full bg-gray-500/15" />
						<CardContent className="mt-3 flex max-w-52 flex-row items-center gap-3 opacity-60">
							<View className="relative bottom-3 -ml-10 flex max-h-10 w-10 flex-col items-center rounded-xl bg-green-500/20 p-2">
								<ShieldCheck color={"#5ee09a"} />
							</View>
							<View className="flex flex-col">
								<Text className="-mt-7 font-medium text-gray-900 text-lg dark:text-white/70">
									Two-Factor Auth
								</Text>
								<Text className="text-gray-900 text-xs dark:text-gray-400/40">
									Coming in a future update
								</Text>
							</View>
							<View className="relative bottom-3 left-10 items-center">
								<Switch className="relative right-1" disabled value={false} />
							</View>
						</CardContent>
					</Card>
				</View>

				<View className="m-5">
					<Text className="ml-1 font-extrabold text-gray-400/40 uppercase">
						Data
					</Text>
					<Card className="mt-2 rounded-2xl border border-gray-500/20 bg-gray-400/40 px-8 dark:bg-secondary-foreground/40">
						<Pressable
							className="active:opacity-70"
							onPress={handleExportData}
							disabled={isExporting}
						>
							<CardContent className="mt-5 flex flex-row items-center gap-3">
								<View className="relative bottom-3 -ml-10 flex max-h-10 w-10 flex-col items-center rounded-xl bg-orange-500/20 p-2">
									<Download color={"#e8a050"} />
								</View>
								<View className="flex flex-col">
									<Text className="-mt-7 font-medium text-gray-900 text-lg dark:text-white/70">
										Export My Data
									</Text>
									<Text className="text-gray-900 text-xs dark:text-gray-400/40">
										{isExporting
											? "Preparing export..."
											: "Download a copy of your events & profile"}
									</Text>
								</View>
								<View className="relative right-4 bottom-3 items-center">
									<ChevronRight color={"gray"} className="" />
								</View>
							</CardContent>
						</Pressable>
					</Card>
				</View>

				<View className="m-5">
					<Text className="ml-1 font-extrabold text-gray-400/40 uppercase">
						Danger zone
					</Text>
					<Card className="mt-2 rounded-2xl border border-gray-500/20 bg-gray-400/40 px-8 dark:bg-secondary-foreground/40">
						<Pressable
							className="active:opacity-70"
							onPress={handleDeleteAccount}
							disabled={isDeletingAccount}
						>
							<CardContent className="mt-5 flex flex-row items-center gap-3">
								<View className="relative bottom-3 -ml-10 flex max-h-10 w-10 flex-col items-center rounded-xl bg-red-500/20 p-2">
									<OctagonAlertIcon color={"#e05555"} />
								</View>
								<View className="flex flex-col">
									<Text className="-mt-7 font-medium text-destructive text-lg dark:text-destructive">
										Delete Account
									</Text>
									<Text className="text-gray-900 text-xs dark:text-gray-400/40">
										{isDeletingAccount
											? "Deleting account..."
											: "Permanently remove all your data"}
									</Text>
								</View>
								<View className="relative bottom-3 left-7 items-center">
									<ChevronRight color={"gray"} className="" />
								</View>
							</CardContent>
						</Pressable>
					</Card>
				</View>
			</ScrollView>

			<ChangePasswordSheet
				bottomSheetRef={bottomSheetRef}
				snapPoints={snapPoints}
			/>
		</SafeAreaView>
	);
}
