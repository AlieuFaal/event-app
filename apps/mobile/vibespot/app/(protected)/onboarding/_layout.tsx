import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";
import { authClient } from "@/lib/auth-client";


export default function onboardingLayout() {
    const session = authClient.useSession();
  
  return (
    <View style={{ flex: 1 }} >
      <Stack screenOptions={{ headerTransparent: true, headerTitle: "", headerShadowVisible: false }}>
        <Stack.Protected guard={!session} >
          <Stack.Screen name="(protected)/onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={!session} >
          <Stack.Screen name="(protected)/onbScreen2" />
        </Stack.Protected>
        <Stack.Protected guard={!session} >
          <Stack.Screen name="(protected)/onbScreen3" />
        </Stack.Protected>
        <Stack.Protected guard={!session} >
          <Stack.Screen name="(protected)/onbScreen4" />
        </Stack.Protected>
      </Stack>
      <PortalHost />
    </View>
  )
}