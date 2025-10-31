import "../global.css"
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { authClient } from "@/lib/auth-client";
import { KeyboardProvider } from 'react-native-keyboard-controller';


export default function RootLayout() {

  const session = authClient.useSession();
  console.log("Current session username in RootLayout:", session.data?.user.name);

  return (
    <KeyboardProvider>
      <SafeAreaView style={{ flex: 1, marginTop: 25 }} >
        <Stack screenOptions={{ headerTransparent: true, headerTitle: "", headerShadowVisible: false }}>

          <Stack.Protected guard={!session.data}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="forgotpassword" />
          </Stack.Protected>

          {/* Protected routes - only show if logged in */}
          <Stack.Protected guard={!!session.data}>
            <Stack.Screen name="(protected)" />
          </Stack.Protected>

        </Stack>
        <PortalHost />
      </SafeAreaView>
    </KeyboardProvider>
  )
}
