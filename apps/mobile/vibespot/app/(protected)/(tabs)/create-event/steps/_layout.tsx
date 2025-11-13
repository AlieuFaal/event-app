import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { View } from "react-native";


export default function CreateEventStepsLayout() {

    return (
        <View style={{ flex: 1 }} >
            <Stack screenOptions={{ headerTransparent: true, headerTitle: "", headerShadowVisible: false }}>
                <Stack.Screen name="GenreSelection" />
                <Stack.Screen name="EventDetails" />
                <Stack.Screen name="LocationPicker" />
                <Stack.Screen name="DateTimePicker" />
                <Stack.Screen name="ImageUpload" />
            </Stack>
            <PortalHost />
        </View>
    )
}