import { Stack, Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";


export default function tabsLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Tabs>
                {/* <Tabs.Protected guard={false}>
                    <Tabs.Screen name="(protected)" />
                </Tabs.Protected>

                <Tabs.Protected guard={false}>
                    <Tabs.Screen name="(tabs)" />
                </Tabs.Protected> */}
            </Tabs>
            <PortalHost />
        </View>
    )
}
