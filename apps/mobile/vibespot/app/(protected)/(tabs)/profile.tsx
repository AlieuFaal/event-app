import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {

  const handleSignoout = async () => {
    await authClient.signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <View className="flex-1 p-4">
        <Text className="text-3xl text-center mt-4 text-gray-900 dark:text-white">Profile</Text>
        <Button className="h-20 mt-4 bg-primary" onPress={handleSignoout}>
          <Text className="text-center text-primary-foreground">
            Sign Out
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}