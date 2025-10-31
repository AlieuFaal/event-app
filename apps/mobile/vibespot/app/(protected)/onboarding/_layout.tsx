import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";
import { authClient } from "@/lib/auth-client";


export default function OnboardingLayout() {

  return (
    <View style={{ flex: 1 }} >
      <Stack screenOptions={{ headerTransparent: true, headerTitle: "", headerShadowVisible: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboardingScreen2" />
        <Stack.Screen name="onboardingScreen3" />
        <Stack.Screen name="onboardingScreen4" />
      </Stack>
      <PortalHost />
    </View>
  )
}