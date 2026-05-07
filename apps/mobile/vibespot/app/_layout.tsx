import "../global.css";
import { isRunningInExpoGo } from "expo";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { authClient } from "@/lib/auth-client";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { Animated, useColorScheme, View } from "react-native";
import * as SystemUI from "expo-system-ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

const splashImages = {
  light: require("../assets/images/VibeSpot-Splash-Light.png"),
  dark: require("../assets/images/VibeSpot-Splash-Dark.png"),
};

const MIN_SPLASH_DURATION_MS = 800;
const SPLASH_FADE_DURATION_MS = 500;

void SplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  if (__DEV__) {
    console.warn("Failed to keep native splash screen visible", error);
  }
});

if (!isRunningInExpoGo()) {
  SplashScreen.setOptions({
    duration: SPLASH_FADE_DURATION_MS,
    fade: true,
  });
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const [hasHiddenNativeSplash, setHasHiddenNativeSplash] = useState(false);
  const [hasRootLayout, setHasRootLayout] = useState(false);
  const [hasMinimumSplashTimeElapsed, setHasMinimumSplashTimeElapsed] =
    useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const isAppReady = !isSessionPending && hasMinimumSplashTimeElapsed;
  const splashBackgroundColor = colorScheme === "dark" ? "#07001d" : "#ffffff";
  const splashImage =
    colorScheme === "dark" ? splashImages.dark : splashImages.light;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("transparent");
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasMinimumSplashTimeElapsed(true);
    }, MIN_SPLASH_DURATION_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isAppReady || !hasRootLayout || hasHiddenNativeSplash) {
      return;
    }

    void SplashScreen.hideAsync()
      .catch((error: unknown) => {
        if (__DEV__) {
          console.warn("Failed to hide native splash screen", error);
        }
      })
      .finally(() => {
        setHasHiddenNativeSplash(true);
      });
  }, [hasHiddenNativeSplash, hasRootLayout, isAppReady]);

  useEffect(() => {
    if (!isAppReady || !hasHiddenNativeSplash) {
      return;
    }

    Animated.timing(splashOpacity, {
      toValue: 0,
      duration: SPLASH_FADE_DURATION_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsSplashVisible(false);
      }
    });
  }, [hasHiddenNativeSplash, isAppReady, splashOpacity]);

  const handleRootLayout = useCallback(() => {
    setHasRootLayout(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <View
              onLayout={handleRootLayout}
              style={{ flex: 1, backgroundColor: splashBackgroundColor }}
            >
              <StatusBar
                style="auto"
                translucent
                animated
                backgroundColor="transparent"
              />
              {isAppReady ? (
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
              ) : (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: splashBackgroundColor,
                  }}
                />
              )}
              <PortalHost />
              {isSplashVisible ? (
                <Animated.View
                  pointerEvents="none"
                  style={{
                    bottom: 0,
                    left: 0,
                    opacity: splashOpacity,
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                >
                  <Image
                    contentFit="cover"
                    source={splashImage}
                    style={{
                      flex: 1,
                      backgroundColor: splashBackgroundColor,
                    }}
                  />
                </Animated.View>
              ) : null}
            </View>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
