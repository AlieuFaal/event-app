import { Stack } from "expo-router";
import { View } from "react-native";

export default function ProfileLayout() {
  return (
    <View className="flex-1 bg-transparent">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="views/Connections"
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="views/EditProfile" />
        <Stack.Screen name="views/SavedEvents" />
        <Stack.Screen name="views/UserEvents" />
        <Stack.Screen name="views/Settings" />
        <Stack.Screen name="views/Support" />
      </Stack>
    </View>
  );
}
