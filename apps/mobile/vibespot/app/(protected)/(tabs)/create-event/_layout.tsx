import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";


export default function CreateEventLayout() {

    return (
        <View className="flex-1 bg-transparent" >
            <Stack screenOptions={{ 
                headerTransparent: true, 
                headerTitle: "", 
                headerShadowVisible: false,
                contentStyle: { backgroundColor: 'transparent' }
            }}>
                <Stack.Screen name="index" />
            </Stack>
            <PortalHost />
        </View>
    )
}