import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MapPin, UserRound } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFollowUser } from "@/hooks/useFollowUser";
import { useGetUserById } from "@/hooks/useGetUserById";
import { authClient } from "@/lib/auth-client";

const getInitials = (name: string | undefined) =>
	name
		?.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toLocaleUpperCase() || "VS";

export default function PublicUserProfile() {
	const params = useLocalSearchParams();
	const userId = typeof params.id === "string" ? params.id : params.id?.[0];
	const router = useRouter();
	const session = authClient.useSession();
	const { data: user, isPending, error } = useGetUserById(userId);
	const { toggleFollow, isPending: isFollowPending } = useFollowUser(userId);
	const isOwnProfile = session.data?.user?.id === userId;

	const goBack = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.back();
	};

	if (isPending) {
		return (
			<SafeAreaView
				className="flex-1 bg-white dark:bg-gray-900"
				edges={["top"]}
			>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#8b5cf6" />
					<Text className="mt-4 text-gray-600 dark:text-gray-300">
						Loading profile...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (error || !user) {
		return (
			<SafeAreaView
				className="flex-1 bg-white dark:bg-gray-900"
				edges={["top"]}
			>
				<View className="flex-row items-center border-gray-200 border-b bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
					<Button
						hitSlop={8}
						onPress={goBack}
						className="mr-3 h-12 w-12 bg-transparent p-0 active:opacity-50 dark:bg-transparent"
					>
						<ArrowLeft size={24} color="#8b5cf6" />
					</Button>
					<Text className="flex-1 font-semibold text-gray-900 text-xl dark:text-white">
						Profile
					</Text>
				</View>
				<View className="flex-1 items-center justify-center px-6">
					<Text className="text-center text-gray-600 dark:text-gray-300">
						Unable to load this profile.
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["top"]}>
			<View className="flex-row items-center border-gray-200 border-b bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
				<Button
					hitSlop={8}
					onPress={goBack}
					className="mr-3 h-12 w-12 bg-transparent p-0 active:opacity-50 dark:bg-transparent"
				>
					<ArrowLeft size={24} color="#8b5cf6" />
				</Button>
				<Text className="flex-1 font-semibold text-gray-900 text-xl dark:text-white">
					Creator Profile
				</Text>
			</View>

			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<View className="px-5 py-6">
					<View className="rounded-3xl border border-purple-100 bg-white p-5 shadow shadow-black/5 dark:border-purple-500/20 dark:bg-gray-950">
						<View className="flex-row items-center gap-4">
							<Avatar
								className="h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-purple-600 shadow-xl dark:border-gray-800"
								alt={`${user.name} profile image`}
							>
								<AvatarImage source={{ uri: user.image || undefined }} />
								<AvatarFallback className="bg-purple-600">
									<Text className="font-bold text-2xl text-white">
										{getInitials(user.name)}
									</Text>
								</AvatarFallback>
							</Avatar>

							<View className="flex-1">
								<Text className="font-bold text-2xl text-gray-900 dark:text-white">
									{user.name}
								</Text>
								<View className="mt-2 flex-row items-center gap-2">
									<UserRound size={14} color="#8b5cf6" />
									<Text className="text-gray-600 text-sm capitalize dark:text-gray-300">
										{user.role}
									</Text>
								</View>
								{user.location ? (
									<View className="mt-1 flex-row items-center gap-2">
										<MapPin size={14} color="#8b5cf6" />
										<Text className="text-gray-600 text-sm dark:text-gray-300">
											{user.location}
										</Text>
									</View>
								) : null}
							</View>
						</View>

						<Text className="mt-5 text-gray-700 leading-6 dark:text-gray-300">
							{user.bio || "No bio available yet."}
						</Text>

						<View className="mt-5 flex-row rounded-2xl bg-gray-100 p-2 dark:bg-gray-900/70">
							<View className="flex-1 items-center py-2">
								<Text className="font-bold text-gray-900 text-lg dark:text-white">
									{user.followersCount}
								</Text>
								<Text className="text-gray-500 text-xs dark:text-gray-400">
									Followers
								</Text>
							</View>
							<View className="w-px bg-gray-300 dark:bg-gray-700" />
							<View className="flex-1 items-center py-2">
								<Text className="font-bold text-gray-900 text-lg dark:text-white">
									{user.followingCount}
								</Text>
								<Text className="text-gray-500 text-xs dark:text-gray-400">
									Following
								</Text>
							</View>
							<View className="w-px bg-gray-300 dark:bg-gray-700" />
							<View className="flex-1 items-center py-2">
								<Text className="font-bold text-gray-900 text-lg dark:text-white">
									{user.eventsCount}
								</Text>
								<Text className="text-gray-500 text-xs dark:text-gray-400">
									Events
								</Text>
							</View>
						</View>

						{isOwnProfile ? (
							<Button
								className="mt-5 h-12"
								onPress={() => router.push("/profile")}
							>
								<Text className="font-semibold text-white">
									Open my profile
								</Text>
							</Button>
						) : (
							<Button
								className={`mt-5 h-12 ${
									user.isFollowing
										? "border border-purple-600 bg-transparent dark:bg-card-foreground"
										: ""
								}`}
								disabled={isFollowPending}
								onPress={() => toggleFollow(user.isFollowing)}
							>
								<Text
									className={`font-semibold ${
										user.isFollowing
											? "text-purple-600 dark:text-purple-400"
											: "text-white"
									}`}
								>
									{user.isFollowing ? "Following" : "Follow"}
								</Text>
							</Button>
						)}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
