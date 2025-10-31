import { authClient } from "@/lib/auth-client";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function ProtectedLayout() {

    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (session && session.user?.role === 'New User') {
            router.replace("/(protected)/onboarding");
        }
    }, [session])

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
        </Stack>
    );
}