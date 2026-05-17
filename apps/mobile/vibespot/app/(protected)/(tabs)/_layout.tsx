import { Tabs, usePathname, useRouter } from "expo-router";
import { House, ListMusic, MapPin, Plus, User } from "lucide-react-native";
import { Alert, Pressable, useColorScheme, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
} from "react-native-reanimated";
import { authClient } from "@/lib/auth-client";
import {
	TabBarVisibilityProvider,
	useTabBarVisibility,
} from "@/lib/tab-bar-visibility";

const TAB_HIT_SLOP = { top: 8, right: 4, bottom: 8, left: 4 };
const TAB_PRESS_RETENTION_OFFSET = { top: 16, right: 16, bottom: 16, left: 16 };

function TabBarContent() {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const router = useRouter();
	const pathname = usePathname();
	const { data: session } = authClient.useSession();
	const { isTabBarHidden, tabBarHiddenProgress } = useTabBarVisibility();
	const isCreateEventRoute = pathname.includes("/create-event");

	const canCreateEvents =
		session?.user.role === "artist" || session?.user.role === "admin";

	const isHome =
		pathname === "/(protected)/(tabs)" ||
		pathname === "/" ||
		(!pathname.includes("/events") &&
			!pathname.includes("/map") &&
			!pathname.includes("/profile") &&
			!pathname.includes("/create-event"));

	const animatedTabBarStyle = useAnimatedStyle(() => ({
		opacity: interpolate(tabBarHiddenProgress.value, [0, 1], [1, 0]),
		transform: [
			{
				translateY: interpolate(tabBarHiddenProgress.value, [0, 1], [0, 96]),
			},
		],
	}));

	return (
		<Animated.View
			pointerEvents={isTabBarHidden || isCreateEventRoute ? "none" : "auto"}
			className="absolute right-0 bottom-0 left-0 z-[999]"
			style={[
				animatedTabBarStyle,
				isCreateEventRoute ? { display: "none" } : null,
			]}
		>
			<View
				className={`w-full flex-row items-center justify-between border-t px-2 pt-2 pb-4 ${isDark ? "border-black/20 bg-accent/90" : "border-gray-300 bg-white/90"}`}
			>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Home tab"
					hitSlop={TAB_HIT_SLOP}
					onPress={() => router.navigate("/(protected)/(tabs)")}
					pressRetentionOffset={TAB_PRESS_RETENTION_OFFSET}
					className="mb-1 h-16 flex-1 items-center justify-center active:opacity-70"
				>
					<House color={isHome ? "#8b5cf6" : isDark ? "#545563" : "#6b7280"} />
				</Pressable>

				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Events tab"
					hitSlop={TAB_HIT_SLOP}
					onPress={() => router.navigate("/(protected)/(tabs)/events")}
					pressRetentionOffset={TAB_PRESS_RETENTION_OFFSET}
					className="mb-1 h-16 flex-1 items-center justify-center active:opacity-70"
				>
					<ListMusic
						color={
							pathname.includes("/events")
								? "#8b5cf6"
								: isDark
									? "#545563"
									: "#6b7280"
						}
					/>
				</Pressable>

				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Create event tab"
					hitSlop={TAB_HIT_SLOP}
					onPress={() => {
						if (!canCreateEvents) {
							Alert.alert(
								"Artist mode required",
								"Switch to Artist mode in Settings to create events.",
							);
							return;
						}

						router.navigate("/(protected)/(tabs)/create-event");
					}}
					pressRetentionOffset={TAB_PRESS_RETENTION_OFFSET}
					className={`mb-1 h-16 flex-1 items-center justify-center active:opacity-80 ${!canCreateEvents ? "opacity-60" : ""}`}
				>
					<View className="h-14 w-14 items-center justify-center rounded-full bg-white shadow drop-shadow-xl">
						<View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 shadow-lg drop-shadow-xl">
							<Plus
								color={
									pathname.includes("/create-event") ? "#8b5cf6" : "#000000"
								}
								strokeWidth={"2.5"}
							/>
						</View>
					</View>
				</Pressable>

				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Map tab"
					hitSlop={TAB_HIT_SLOP}
					onPress={() => router.navigate("/(protected)/(tabs)/map")}
					pressRetentionOffset={TAB_PRESS_RETENTION_OFFSET}
					className="mb-1 h-16 flex-1 items-center justify-center active:opacity-70"
				>
					<MapPin
						color={
							pathname.includes("/map")
								? "#8b5cf6"
								: isDark
									? "#545563"
									: "#6b7280"
						}
					/>
				</Pressable>

				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Profile tab"
					hitSlop={TAB_HIT_SLOP}
					onPress={() => router.navigate("/(protected)/(tabs)/profile")}
					pressRetentionOffset={TAB_PRESS_RETENTION_OFFSET}
					className="mb-1 h-16 flex-1 items-center justify-center active:opacity-70"
				>
					<User
						color={
							pathname.includes("/profile")
								? "#8b5cf6"
								: isDark
									? "#545563"
									: "#6b7280"
						}
					/>
				</Pressable>
			</View>
		</Animated.View>
	);
}

export default function TabsLayout() {
	const { data: session } = authClient.useSession();

	const canCreateEvents =
		session?.user.role === "artist" || session?.user.role === "admin";

	return (
		<TabBarVisibilityProvider>
			<Tabs
				screenOptions={{
					headerShown: false,
					sceneStyle: { backgroundColor: "transparent" },
					animation: "fade",
					tabBarStyle: {
						position: "absolute",
						borderTopWidth: 0,
						elevation: 0,
					},
				}}
				tabBar={() => <TabBarContent />}
			>
				<Tabs.Screen name="index" options={{ href: "/" }} />
				<Tabs.Screen name="events" />
				<Tabs.Screen
					name="create-event"
					options={{ href: canCreateEvents ? undefined : null }}
				/>
				<Tabs.Screen name="map" />
				<Tabs.Screen name="profile" />
			</Tabs>
		</TabBarVisibilityProvider>
	);
}
