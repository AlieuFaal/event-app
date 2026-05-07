import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { authClient } from "@/lib/auth-client";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

export default function RootLayout() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

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
              {isSessionPending ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size="large" color="#8b5cf6" />
                </View>
              ) : (
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                    animation: "fade",
                    animationDuration: 400,
                  }}
                >
                  <Stack.Protected guard={!session}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="forgotpassword" />
                  </Stack.Protected>

                  <Stack.Protected guard={!!session}>
                    <Stack.Screen name="(protected)" />
                  </Stack.Protected>
                </Stack>
              )}
              <PortalHost />
            </View>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
