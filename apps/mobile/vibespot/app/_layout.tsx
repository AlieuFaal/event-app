import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { authClient } from "@/lib/auth-client";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export default function RootLayout() {

  queryClient.setDefaultOptions({
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    },
  });

  // queryClient.invalidateQueries();

  const session = authClient.useSession();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("transparent");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <View style={{ flex: 1 }}>
              <StatusBar
                style="auto"
                translucent
                animated
                backgroundColor="transparent"
              />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                  animation: "fade",
                  animationDuration: 400,
                  freezeOnBlur: true,
                }}
              >
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
    </QueryClientProvider>
  );
}
