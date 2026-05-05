import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  useColorScheme,
  ActivityIndicator,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Lock,
  ShieldCheck,
  User2,
} from "lucide-react-native";
import { authClient } from "@/lib/auth-client";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { data, isPending, error } = authClient.useSession();
  const currentUser = data?.user;
  const colorScheme = useColorScheme();

  const goBack = () => {
    Haptics.impactAsync();
    router.back();
  };

  if (isPending) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text className="text-gray-600 dark:text-gray-300 mt-4">
            Loading user...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data?.user) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 dark:text-gray-300">
            User not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 dark:text-red-400">
            Error loading user: {(error as Error).message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View className="flex-col items-start h-52 border-gray-200 dark:border-gray-800 gap-4">
        <Button
          onPress={goBack}
          className="mr-2 bg-transparent active:opacity-50 active:scale-90 p-5 dark:bg-transparent dark:active:opacity-50"
        >
          <View className="flex-row items-center gap-2 h-20">
            <ChevronLeft size={24} color="#8b5cf6" />
            <Text className="dark:text-secondary font-semibold text-lg">
              Profile
            </Text>
          </View>
        </Button>
        <Text className="text-4xl font-bold flex-1 text-gray-900 dark:text-white/70 ml-5">
          Settings
        </Text>
      </View>
      <View className="flex flex-col -mt-20 items-center justify-center">
        <Avatar
          className="w-28 h-28 justify-center items-center overflow-hidden rounded-full border-3 border-white dark:border-gray-800 shadow-xl"
          alt="ProfileImage"
        >
          <AvatarImage source={{ uri: currentUser?.image || undefined }} />
          <AvatarFallback className="bg-primary">
            <Text className="text-lg font-bold text-white">
              {currentUser?.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toLocaleUpperCase()}
            </Text>
          </AvatarFallback>
        </Avatar>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white/70 mt-4">
          {currentUser?.name}
        </Text>
        <Text className="text-md text-gray-900 dark:text-gray-400/40 mt-2">
          {currentUser?.email}
        </Text>
      </View>
      <View className="mt-5 mx-5">
        <Text className="uppercase text-gray-400/40 font-extrabold ml-1">
          Account mode
        </Text>
        <Card className="mt-2 bg-secondary-foreground/30 border border-gray-500/20 rounded-2xl px-8">
          <CardContent className="flex flex-row gap-3 max-w-60 mt-5">
            <View className="relative flex flex-col items-center bg-secondary-foreground p-2 w-10 max-h-10 rounded-xl -ml-10 bottom-3">
              <User2 color={"lavender"} />
            </View>
            <View className="flex flex-col">
              <Text className="text-lg text-gray-900 dark:text-white/70 font-medium -mt-7">
                Artist Mode
              </Text>
              <Text className="text-xs text-gray-900 dark:text-gray-400/40">
                Switch to Artist mode to manage and create events.
              </Text>
            </View>
            <View className="flex flex-row items-center gap-3">
              {/*<Text className="text-sm text-gray-900 dark:text-gray-400/70 font-semibold -mt-10">
                Enthusiast
              </Text>*/}
              <Switch className="scale-85" />
              {/*<Text className="text-sm text-gray-900 dark:text-gray-400/70 font-semibold -mt-10">
                Artist
              </Text>*/}
            </View>
          </CardContent>
        </Card>
      </View>
      <View className="m-5">
        <Text className="uppercase text-gray-400/40 font-extrabold ml-1">
          Security
        </Text>
        <Card className="mt-2 bg-secondary-foreground/30 border border-gray-500/20 rounded-2xl px-8">
          <Pressable className="active:opacity-70">
            <CardContent className="flex flex-row items-center gap-3 mt-5">
              <View className="relative flex flex-col items-center bg-secondary-foreground p-2 w-10 max-h-10 rounded-xl -ml-10 bottom-3">
                <Lock color={"lavender"} />
              </View>
              <View className="flex flex-col">
                <Text className="text-lg text-gray-900 dark:text-white/70 font-medium -mt-7">
                  Change Password
                </Text>
                <Text className="text-xs text-gray-900 dark:text-gray-400/40">
                  Last changed on {new Date().toLocaleDateString()}
                </Text>
              </View>
              <View className="relative items-center left-10 bottom-3">
                <ChevronRight color={"gray"} className="" />
              </View>
            </CardContent>
          </Pressable>
          <Separator className="bg-gray-500/15 w-full -mt-3" />
          <CardContent className="flex flex-row items-center gap-3 mt-3 max-w-52">
            <View className="relative flex flex-col items-center bg-secondary-foreground p-2 w-10 max-h-10 rounded-xl -ml-10 bottom-3">
              <ShieldCheck color={"lavender"} />
            </View>
            <View className="flex flex-col">
              <Text className="text-lg text-gray-900 dark:text-white/70 font-medium -mt-7">
                Two-Factor Auth
              </Text>
              <Text className="text-xs text-gray-900 dark:text-gray-400/40">
                Adds an extra layer of security to your account.
              </Text>
            </View>
            <View className="relative items-center left-10 bottom-3">
              <Switch
                onValueChange={(value) => {}}
                className="relative right-1"
              />
            </View>
          </CardContent>
        </Card>
      </View>
      <View className="m-5">
        <Text className="uppercase text-gray-400/40 font-extrabold ml-1">
          Data
        </Text>
        <Text className="text-gray-900 dark:text-white/70 mt-2"></Text>
      </View>
      <View className="m-5">
        <Text className="uppercase text-gray-400/40 font-extrabold ml-1">
          Danger zone
        </Text>
        <Text className="text-gray-900 dark:text-white/70 mt-2"></Text>
      </View>
    </SafeAreaView>
  );
}
