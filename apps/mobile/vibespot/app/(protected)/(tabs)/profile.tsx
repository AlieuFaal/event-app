import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { TextInput, View, Text } from "react-native";

export default function Profile() {

  const handleSignoout = async () => {
    await authClient.signOut();
  };

  return (
    <View>
      <Text className="text-3xl text-center">Profile</Text>
      <Button className="h-20" onPress={handleSignoout}>
        <Text className="text-center text-white">
          Sign Out
        </Text>
      </Button>
    </View>
  );
}