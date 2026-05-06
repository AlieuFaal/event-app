import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";

export default function OnboardingLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboardingScreen2" />
        <Stack.Screen name="onboardingScreen3" />
        <Stack.Screen name="onboardingScreen4" />
      </Stack>
      <PortalHost />
    </View>
  );
}
