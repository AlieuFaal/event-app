import { Tabs, useRouter, usePathname } from "expo-router";
import { View, Pressable, useColorScheme, Alert } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { House, ListMusic, MapPin, Plus, User } from "lucide-react-native";
import { authClient } from "@/lib/auth-client";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "@/lib/tab-bar-visibility";

function TabBarContent() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { isTabBarHidden, tabBarHiddenProgress } = useTabBarVisibility();

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
      pointerEvents={isTabBarHidden ? "none" : "auto"}
      className="absolute bottom-0 left-0 right-0 z-[999]"
      style={animatedTabBarStyle}
    >
      <View
        className={`w-full flex-row items-center justify-around border-t px-2 pb-4 pt-2 ${isDark ? "border-black/20 bg-accent/90" : "border-gray-300 bg-white/90"}`}
      >
        <Pressable
          onPress={() => router.navigate("/(protected)/(tabs)")}
          className="mb-1 items-center px-2 py-3 active:scale-95"
        >
          <House color={isHome ? "#8b5cf6" : isDark ? "#545563" : "#6b7280"} />
        </Pressable>

        <Pressable
          onPress={() => router.navigate("/(protected)/(tabs)/events")}
          className="mb-1 items-center px-2 py-3 active:scale-95"
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
          className={`mb-1 scale-90 items-center rounded-full bg-white p-4 shadow drop-shadow-xl active:scale-[0.85] ${!canCreateEvents ? "opacity-60" : ""}`}
        >
          <View className="scale-150 rounded-full bg-gray-100 p-2 shadow-lg drop-shadow-xl">
            <Plus
              color={pathname.includes("/create-event") ? "#8b5cf6" : "#000000"}
              strokeWidth={"2.5"}
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.navigate("/(protected)/(tabs)/map")}
          className="mb-1 items-center px-2 py-3 active:scale-95"
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
          onPress={() => router.navigate("/(protected)/(tabs)/profile")}
          className="mb-1 items-center px-2 py-3 active:scale-95"
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
