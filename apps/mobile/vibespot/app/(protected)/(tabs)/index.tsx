import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <View className="flex-1">
        <Text className="text-3xl text-center mt-4">Home</Text>
      </View>
    </SafeAreaView>
  );
}
