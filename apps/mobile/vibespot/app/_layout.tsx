import "../global.css"
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { authClient } from "@/lib/auth-client";
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function RootLayout() {

  const session = authClient.useSession();
  console.log("Current session username in RootLayout:", session.data?.user.name);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#ffffff');
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <KeyboardProvider>
          <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <StatusBar style="dark" translucent backgroundColor="transparent" />
            <Stack screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#ffffff' },
              animation: 'default',
              freezeOnBlur: true,
            }}>

              <Stack.Protected guard={!session.data}>
                <Stack.Screen name="index" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="forgotpassword" />
              </Stack.Protected>

              <Stack.Protected guard={!!session.data}>
                <Stack.Screen name="(protected)" />
              </Stack.Protected>

            </Stack>
            <PortalHost />
          </View>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
