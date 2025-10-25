import { useEffect } from "react";
import { Text, View, Appearance, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getData } from "./api/get+api";

export default function HomeScreen() {

  const colorScheme = useColorScheme();
  
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-3xl">asds</Text>
        <Text className="bg-red-200">Edit app/index.tsx to edit this screen.</Text>
      </View>
    </SafeAreaView>
  );
}
