import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Map() {

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <View className="flex-1 p-4">
        <Text className="text-3xl text-center mt-4 text-gray-900 dark:text-white">Map</Text>
      </View>
    </SafeAreaView>
  );
}
