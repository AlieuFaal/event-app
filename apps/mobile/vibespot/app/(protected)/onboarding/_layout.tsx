import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";


export default function onboardingLayout() {
  return (
    <View style={{ flex: 1 }} >
      <Stack screenOptions={{ headerTransparent: true, headerTitle: "", headerShadowVisible: false }}>
        <Stack.Protected guard={true} >
          <Stack.Screen name="(protected)/onboarding" />
        </Stack.Protected>
      </Stack>
      <PortalHost />
    </View>
  )
}