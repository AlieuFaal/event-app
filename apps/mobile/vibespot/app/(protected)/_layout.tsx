import { authClient } from "@/lib/auth-client";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'react-native';

export default function ProtectedLayout() {

    const { data: session } = authClient.useSession();
    const colorScheme = useColorScheme();

    useEffect(() => {
        if (session && session.user?.role === 'New User') {
            router.replace("/(protected)/onboarding");
        }
    }, [session])

    // Light mode: Very light purple/lavender gradient (matches web app background)
    // Dark mode: Deep purple gradient (matches web app dark mode)
    const lightModeColors: readonly [string, string, string] = ['#f9f8fc', '#f5f3ff', '#faf8ff'];
    const darkModeColors: readonly [string, string, string] = ['#1a1525', '#1e1829', '#221b2e'];

    return (
        <LinearGradient
            colors={colorScheme === 'dark' ? darkModeColors : lightModeColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <Stack screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' }
            }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="event-details" />
            </Stack>
        </LinearGradient>
    );
}