import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";


export default function CreateEventLayout() {

    return (
        <View style={{ flex: 1 }} >
            <Stack screenOptions={{ headerTransparent: true, headerTitle: "", headerShadowVisible: false }}>
                <Stack.Screen name="index" />
            </Stack>
            <PortalHost />
        </View>
    )
}