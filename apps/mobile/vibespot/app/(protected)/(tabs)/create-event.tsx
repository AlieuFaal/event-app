import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateEvents() {

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <View className="flex-1 p-4">
        <Text className="text-3xl text-center mt-4 text-gray-900 dark:text-white">Create Event</Text>
      </View>
    </SafeAreaView>
  );
}
