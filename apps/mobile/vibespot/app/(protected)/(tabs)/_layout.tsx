import { Stack, Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";
import { authClient } from "@/lib/auth-client";


export default function tabsLayout() {
    const session = authClient.useSession();

    return (
        <View style={{ flex: 1 }}>
            <Tabs>
                {/* <Tabs.Protected guard={!session}>
                    <Tabs.Screen name="(protected)" />
                </Tabs.Protected>

                <Tabs.Protected guard={!session}>
                    <Tabs.Screen name="(tabs)" />
                </Tabs.Protected> */}
            </Tabs>
            <PortalHost />
        </View>
    )
}
