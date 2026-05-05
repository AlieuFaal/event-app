import { Tabs, useRouter, usePathname } from "expo-router";
import { View, Text, Pressable, useColorScheme } from "react-native";
import {
  CircleUser,
  House,
  ListMusic,
  MapPin,
  MapPinned,
  Plus,
  User,
} from "lucide-react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const pathname = usePathname();

  const isHome =
    pathname === "/(protected)/(tabs)" ||
    pathname === "/" ||
    (!pathname.includes("/events") &&
      !pathname.includes("/map") &&
      !pathname.includes("/profile") &&
      !pathname.includes("/create-event"));

  return (
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
      tabBar={({ state, navigation }) => {
        return (
          <View className="absolute z-[999] bottom-0 left-0 right-0">
            <View
              className={`flex-row items-center justify-around w-full border-t pt-2 pb-4 px-2 ${isDark ? "bg-accent/90 border-black/20" : "bg-white/90 border-gray-300"}`}
            >
              {/* Home Tab */}
              <Pressable
                onPress={() => router.navigate("/(protected)/(tabs)")}
                className="items-center py-3 mb-1 px-2 active:scale-95"
              >
                <House
                  color={isHome ? "#8b5cf6" : isDark ? "#545563" : "#6b7280"}
                />
                {/*<Text
                  className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-900"}`}
                >
                  Home
                </Text>*/}
              </Pressable>

              {/* Events Tab */}
              <Pressable
                onPress={() => router.navigate("/(protected)/(tabs)/events")}
                className="items-center py-3 mb-1 px-2 active:scale-95"
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
                {/*<Text
                  className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-900"}`}
                >
                  Events
                </Text>*/}
              </Pressable>

              {/* Create Event Tab */}
              <Pressable
                onPress={() =>
                  router.navigate("/(protected)/(tabs)/create-event")
                }
                className="items-center bg-white p-4 mb-1 rounded-full shadow drop-shadow-xl scale-90 active:scale-[0.85]"
              >
                <View className="bg-gray-100 rounded-full shadow-lg drop-shadow-xl scale-150 p-2">
                  <Plus
                    color={
                      pathname.includes("/create-event") ? "#8b5cf6" : "#000000"
                    }
                    strokeWidth={"2.5"}
                  />
                </View>
              </Pressable>

              {/* Map Tab */}
              <Pressable
                onPress={() => router.navigate("/(protected)/(tabs)/map")}
                className="items-center py-3 mb-1 px-2 active:scale-95"
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
                {/*<Text
                  className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-900"}`}
                >
                  Map
                </Text>*/}
              </Pressable>

              {/* Profile Tab */}
              <Pressable
                onPress={() => router.navigate("/(protected)/(tabs)/profile")}
                className="items-center py-3 mb-1 px-2 active:scale-95"
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
                {/*<Text
                  className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-900"}`}
                >
                  Profile
                </Text>*/}
              </Pressable>
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" options={{ href: "/" }} />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="create-event" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
