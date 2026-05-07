import { authClient } from "@/lib/auth-client";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, useColorScheme, View } from "react-native";

const lightModeColors: readonly [string, string, string] = [
  "#f9f8fc",
  "#f5f3ff",
  "#faf8ff",
];
const darkModeColors: readonly [string, string, string] = [
  "#2a1525",
  "#1e1829",
  "#221b2e",
];

export default function ProtectedLayout() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const colorScheme = useColorScheme();
  const isNewUser = session?.user?.role === "New User";

  return (
    <LinearGradient
      colors={colorScheme === "dark" ? darkModeColors : lightModeColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      {isSessionPending || !session ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "simple_push",
          }}
        >
          <Stack.Protected guard={isNewUser}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>

          <Stack.Protected guard={!isNewUser}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="event-details" />
          </Stack.Protected>
        </Stack>
      )}
    </LinearGradient>
  );
}
