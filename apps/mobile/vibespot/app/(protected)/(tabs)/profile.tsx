import { ProfileCard } from "@/components/profile-components/ProfileCard";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, BadgeQuestionMark, LogOut, Settings, SquareChartGantt, SquareUserRound, Star } from "lucide-react-native";
import { View, Text, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSignoout = async () => {
    await authClient.signOut();
  };

  const user = authClient.useSession().data?.user;

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <View className="flex-1 p-4">
        {/* <Text className="text-3xl text-gray-900 dark:text-white">Profile</Text> */}

        <ProfileCard key={user?.id} user={user} />

        <View>
          <Button variant={"outline"} className="h-16 mt-4 w-11/12 mx-auto border-primary shadow drop-shadow-lg dark:bg-gray-900 dark:border-gray-600">
            <View className="absolute left-4">
              <SquareUserRound color={`${isDark ? "white" : "black"}`} />
            </View>
            <Text className="text-center font-bold  text-black dark:text-white">
              Edit Profile
            </Text>
            <View className="absolute right-4">
              <ArrowRight color={`${isDark ? "white" : "black"}`} />
            </View>
          </Button>
        </View>

        <View>
          <Button variant={"outline"} className="h-16 mt-4 w-11/12 mx-auto border-primary shadow drop-shadow-lg dark:bg-gray-900 dark:border-gray-600">
            <View className="absolute left-4">
              <Star color={`${isDark ? "white" : "black"}`} />
            </View>
            <Text className="text-center font-bold  text-black dark:text-white">
              Saved Events
            </Text>
            <View className="absolute right-4">
              <ArrowRight color={`${isDark ? "white" : "black"}`} />
            </View>
          </Button>
        </View>

        <View>
          <Button variant={"outline"} className="h-16 mt-4 w-11/12 mx-auto border-primary shadow drop-shadow-lg dark:bg-gray-900 dark:border-gray-600">
            <View className="absolute left-4">
              <SquareChartGantt color={`${isDark ? "white" : "black"}`} />
            </View>
            <Text className="text-center font-bold  text-black dark:text-white">
              View My Events
            </Text>
            <View className="absolute right-4">
              <ArrowRight color={`${isDark ? "white" : "black"}`} />
            </View>
          </Button>
        </View>

        <View>
          <Button variant={"outline"} className="h-16 mt-4 w-11/12 mx-auto border-primary shadow drop-shadow-lg dark:bg-gray-900 dark:border-gray-600">
            <View className="absolute left-4">
              <Settings color={`${isDark ? "white" : "black"}`} />
            </View>
            <Text className="text-center font-bold  text-black dark:text-white">
              Settings
            </Text>
            <View className="absolute right-4">
              <ArrowRight color={`${isDark ? "white" : "black"}`} />
            </View>
          </Button>
        </View>

        <View>
          <Button variant={"outline"} className="h-16 mt-4 w-11/12 mx-auto border-primary shadow drop-shadow-lg dark:bg-gray-900 dark:border-gray-600">
            <View className="absolute left-4">
              <BadgeQuestionMark color={`${isDark ? "white" : "black"}`} />
            </View>
            <Text className="text-center font-bold  text-black dark:text-white">
              Help & Support
            </Text>
            <View className="absolute right-4">
              <ArrowRight color={`${isDark ? "white" : "black"}`} />
            </View>
          </Button>
        </View>

        <Button variant={"default"} className="h-16 mt-4 w-11/12 mx-auto border-primary shadow drop-shadow-lg dark:border-0" onPress={handleSignoout}>
          <Text className="text-center font-bold text-black dark:text-white">
            Sign Out
          </Text>
          <View className="absolute right-4">
            <LogOut color={`${isDark ? "white" : "black"}`} />
          </View>
        </Button>

      </View>
    </SafeAreaView>
  );
}