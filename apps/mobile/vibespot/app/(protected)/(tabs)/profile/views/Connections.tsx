import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";
import React, { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	Text,
	TextInput,
	useColorScheme,
	useWindowDimensions,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	type ConnectionUser,
	UserListItem,
} from "@/components/profile-components/UserListItem";
import { Button } from "@/components/ui/button";
import { useGetFollowers } from "@/hooks/useGetFollowers";
import { useGetFollowing } from "@/hooks/useGetFollowing";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";
import { authClient } from "@/lib/auth-client";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "followers" | "following";

// ─── UserListScene ────────────────────────────────────────────────────────────

type UserListSceneProps = {
	data: ConnectionUser[];
	isLoading: boolean;
	emptyMessage: string;
};

const UserListScene = React.memo(function UserListScene({
	data,
	isLoading,
	emptyMessage,
}: UserListSceneProps) {
	const {
		handleMomentumScrollBegin,
		handleMomentumScrollEnd,
		handleScroll,
		handleScrollEnd,
	} = useTabBarScrollVisibility();

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#8b5cf6" />
			</View>
		);
	}

	if (data.length === 0) {
		return (
			<View className="flex-1 items-center justify-center px-8">
				<Text className="text-center text-gray-400 text-sm dark:text-gray-500">
					{emptyMessage}
				</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={data}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => <UserListItem user={item} />}
			ItemSeparatorComponent={() => (
				<View className="mx-4 h-px bg-gray-100 dark:bg-gray-800" />
			)}
			showsVerticalScrollIndicator={false}
			onMomentumScrollBegin={handleMomentumScrollBegin}
			onMomentumScrollEnd={handleMomentumScrollEnd}
			onScroll={handleScroll}
			onScrollEndDrag={handleScrollEnd}
			scrollEventThrottle={16}
			keyboardDismissMode="on-drag"
			contentContainerStyle={{ paddingBottom: 32 }}
		/>
	);
});

// ─── Connections ──────────────────────────────────────────────────────────────

export default function Connections() {
	const router = useRouter();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const { width: screenWidth } = useWindowDimensions();

	const { tab } = useLocalSearchParams<{ tab: TabKey }>();
	const [activeTab, setActiveTab] = useState<TabKey>(
		tab === "following" ? "following" : "followers",
	);
	const [search, setSearch] = useState("");

	const session = authClient.useSession();
	const userId = session.data?.user?.id ?? "";
	const userName = session.data?.user?.name ?? "Profile";

	// Both lists fetched eagerly — switching tabs is instant with no loading flash.
	const { data: followers, isPending: followersLoading } =
		useGetFollowers(userId);
	const { data: following, isPending: followingLoading } =
		useGetFollowing(userId);

	const followersCount = followers?.length ?? 0;
	const followingCount = following?.length ?? 0;

	const query = search.toLowerCase();
	const filteredFollowers =
		followers?.filter((u) => u.name.toLowerCase().includes(query)) ?? [];
	const filteredFollowing =
		following?.filter((u) => u.name.toLowerCase().includes(query)) ?? [];

	// ─── Animated indicator ──────────────────────────────────────────────────
	// A single Reanimated shared value drives the underline. 0 = Followers, 1 = Following.
	// Each tab occupies exactly half the tab bar width, so the indicator translates
	// by screenWidth / 2 to land under the Following label.

	const indicatorPosition = useSharedValue(tab === "following" ? 1 : 0);

	const indicatorStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: withTiming(indicatorPosition.value * (screenWidth / 2), {
					duration: 200,
				}),
			},
		],
	}));

	const handleTabPress = (newTab: TabKey) => {
		if (newTab === activeTab) return;
		setActiveTab(newTab);
		setSearch("");
		indicatorPosition.value = newTab === "following" ? 1 : 0;
	};

	const activeTextColor = isDark ? "#ffffff" : "#111827";
	const inactiveTextColor = isDark ? "#6b7280" : "#9ca3af";
	const indicatorColor = isDark ? "#ffffff" : "#111827";

	const goBack = () => {
		Haptics.impactAsync();
		router.back();
	};

	return (
		<SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["top"]}>
			<Stack.Screen options={{ gestureEnabled: true }} />

			{/* Header */}
			<View className="flex-row items-center border-gray-200 border-b px-4 py-3 dark:border-gray-800">
				<Button
					hitSlop={8}
					onPress={goBack}
					pressRetentionOffset={{ top: 16, right: 16, bottom: 16, left: 16 }}
					className="mr-3 h-12 w-12 bg-transparent p-0 active:opacity-50 dark:bg-transparent dark:active:opacity-50"
				>
					<ArrowLeft size={24} color="#8b5cf6" />
				</Button>
				<Text
					className="flex-1 font-semibold text-gray-900 text-lg dark:text-white"
					numberOfLines={1}
				>
					{userName}
				</Text>
			</View>

			{/* Tab bar */}
			<View className="flex-row border-gray-200 border-b dark:border-gray-800">
				<Pressable
					className="flex-1 items-center py-3"
					onPress={() => handleTabPress("followers")}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: "600",
							color:
								activeTab === "followers" ? activeTextColor : inactiveTextColor,
						}}
					>
						{followersCount} Followers
					</Text>
				</Pressable>

				<Pressable
					className="flex-1 items-center py-3"
					onPress={() => handleTabPress("following")}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: "600",
							color:
								activeTab === "following" ? activeTextColor : inactiveTextColor,
						}}
					>
						{followingCount} Following
					</Text>
				</Pressable>

				{/* Sliding underline indicator */}
				<Animated.View
					style={[
						{
							position: "absolute",
							bottom: 0,
							height: 2,
							width: screenWidth / 2,
							backgroundColor: indicatorColor,
							borderRadius: 2,
						},
						indicatorStyle,
					]}
				/>
			</View>

			{/* Search bar */}
			<View className="px-4 py-3">
				<View className="flex-row items-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5 dark:bg-gray-800">
					<Search size={16} color={isDark ? "#9ca3af" : "#6b7280"} />
					<TextInput
						className="flex-1 text-gray-900 text-sm dark:text-white"
						placeholder="Search"
						placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
						value={search}
						onChangeText={setSearch}
						autoCapitalize="none"
						autoCorrect={false}
						clearButtonMode="while-editing"
					/>
				</View>
			</View>

			{/* Content — conditional render, both datasets are already loaded */}
			{activeTab === "followers" ? (
				<UserListScene
					data={filteredFollowers}
					isLoading={followersLoading}
					emptyMessage={
						search.length > 0
							? `No results for "${search}"`
							: "No followers yet"
					}
				/>
			) : (
				<UserListScene
					data={filteredFollowing}
					isLoading={followingLoading}
					emptyMessage={
						search.length > 0
							? `No results for "${search}"`
							: "Not following anyone yet"
					}
				/>
			)}
		</SafeAreaView>
	);
}
