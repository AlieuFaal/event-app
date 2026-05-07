import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Share,
  View,
  Text,
  ActivityIndicator,
  Switch,
  Pressable,
} from "react-native";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  OctagonAlertIcon,
  ShieldCheck,
  User2,
} from "lucide-react-native";
import { authClient } from "@/lib/auth-client";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollView } from "react-native-gesture-handler";
import React, { useMemo, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { ChangePasswordSheet } from "@/components/bottomsheet-component/changePassword-sheet";
import BottomSheet from "@gorhom/bottom-sheet";
import * as FileSystem from "expo-file-system/legacy";
import { roleUpdateSchema } from "@vibespot/validation";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";

export default function Settings() {
  const { data, isPending, error, refetch } = authClient.useSession();
  const currentUser = data?.user;
  const { handleScroll } = useTabBarScrollVisibility();

  const [switchState, setSwitchState] = React.useState(
    currentUser?.role === "artist" ? true : false,
  );
  const [isRoleUpdating, setIsRoleUpdating] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["65%", "75%", "92%"], []);

  const openSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const goBack = () => {
    Haptics.impactAsync();
    router.back();
  };

  // React.useEffect(() => {
  //   if (!isRoleUpdating) {
  //     // setSwitchState(currentUser?.role === "artist");
  //   }
  // }, [currentUser?.role, isRoleUpdating]);

  const handleRoleToggle = async (checked: boolean) => {
    if (!currentUser?.id || isRoleUpdating) {
      return;
    }

    Haptics.impactAsync();
    setSwitchState(checked);
    setIsRoleUpdating(true);

    try {
      const payload = roleUpdateSchema.parse({
        role: checked ? "artist" : "user",
      });

      const response = await apiClient.users.updaterole[":id"].$put({
        param: { id: currentUser.id },
        json: payload,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update role.");
      }

      await queryClient.invalidateQueries();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      setSwitchState((prev) => !prev);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Role update failed", "Please try again.");
    } finally {
      setIsRoleUpdating(false);
      refetch();
    }
  };

  const handleExportData = async () => {
    if (!currentUser?.id || isExporting) {
      return;
    }

    setIsExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await apiClient.users[":id"].export.$get({
        param: { id: currentUser.id },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to export data.");
      }

      const exportPayload = await response.json();
      const baseDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;

      if (!baseDir) {
        throw new Error("Unable to access local storage for export.");
      }

      const fileUri = `${baseDir}vibespot-data-export-${Date.now()}.json`;
      const json = JSON.stringify(exportPayload, null, 2);

      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Share.share({
        title: "VibeSpot Data Export",
        url: fileUri,
        message: "Your VibeSpot data export is ready.",
      });
    } catch (err) {
      Alert.alert(
        "Export failed",
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    if (isDeletingAccount) {
      return;
    }

    Alert.alert(
      "Delete account?",
      "This permanently removes your account and all associated data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Final confirmation",
              "This action cannot be undone. Are you absolutely sure?",
              [
                { text: "Keep Account", style: "cancel" },
                {
                  text: "Delete Account",
                  style: "destructive",
                  onPress: async () => {
                    setIsDeletingAccount(true);

                    try {
                      const result = await authClient.deleteUser({
                        callbackURL: "/",
                      });

                      if (result?.error) {
                        throw new Error(result.error.message);
                      }
                      refetch();
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                      );
                      Alert.alert(
                        "Account deleted",
                        "Your account has been successfully deleted.",
                        [{ text: "OK" }],
                      );
                    } catch (err) {
                      Alert.alert(
                        "Delete failed",
                        err instanceof Error
                          ? err.message
                          : "Failed to delete your account. Please try again.",
                      );
                    } finally {
                      setIsDeletingAccount(false);
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const roleLabel = switchState ? "Artist" : "Enthusiast";

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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="flex-col items-start h-52 border-gray-200 dark:border-gray-800 gap-4">
          <Button
            hitSlop={8}
            onPress={goBack}
            pressRetentionOffset={{ top: 16, right: 16, bottom: 16, left: 16 }}
            className="mr-2 bg-transparent p-3 active:opacity-50 dark:bg-transparent dark:active:opacity-50"
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
            className="w-24 h-24 justify-center items-center overflow-hidden rounded-full border border-white dark:border-gray-800 shadow-xl"
            alt="ProfileImage"
          >
            <AvatarImage source={{ uri: currentUser?.image || undefined }} />
            <AvatarFallback className="bg-primary">
              <Text className="text-2xl font-extrabold text-white">
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
          <Card className="mt-2 bg-gray-400/40 dark:bg-secondary-foreground/40 border border-gray-500/20 rounded-2xl px-8">
            <CardContent className="flex flex-row gap-3 max-w-60 mt-5">
              <View className="relative flex flex-col items-center bg-purple-500/25 p-2 w-10 max-h-10 rounded-xl -ml-10 bottom-3">
                <User2 color={"#c4a0f0"} />
              </View>
              <View className="flex flex-col">
                <Text className="text-lg text-gray-900 dark:text-white/70 font-medium -mt-7">
                  Artist Mode
                </Text>
                <Text className="text-xs text-gray-900 dark:text-gray-400/40">
                  {switchState
                    ? "Managing your performances & setlists"
                    : "Switch to manage your performances"}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-2">
                <Switch
                  className="scale-85"
                  value={switchState}
                  onValueChange={handleRoleToggle}
                  disabled={isRoleUpdating}
                />
              </View>
            </CardContent>
          </Card>
        </View>

        <View className="m-5">
          <Text className="uppercase text-gray-400/40 font-extrabold ml-1">
            Security
          </Text>
          <Card className="mt-2 bg-gray-400/40 dark:bg-secondary-foreground/40 border border-gray-500/20 rounded-2xl px-8">
            <Pressable className="active:opacity-70" onPress={openSheet}>
              <CardContent className="flex flex-row items-center gap-3 mt-5">
                <View className="relative flex flex-col items-center bg-blue-500/20 p-2 w-10 max-h-10 rounded-xl -ml-10 bottom-3">
                  <Lock color={"#7ab4f0"} />
                </View>
                <View className="flex flex-col">
                  <Text className="text-lg text-gray-900 dark:text-white/70 font-medium -mt-7">
                    Change Password
                  </Text>
                  <Text className="text-xs text-gray-900 dark:text-gray-400/40">
                    Last changed on {new Date().toLocaleDateString()}
                  </Text>
                </View>
                <View className="relative items-center left-16 bottom-3">
                  <ChevronRight color={"gray"} className="" />
                </View>
              </CardContent>
            </Pressable>
            <Separator className="bg-gray-500/15 w-full -mt-3" />
            <CardContent className="flex flex-row items-center gap-3 mt-3 max-w-52 opacity-60">
              <View className="relative flex flex-col items-center bg-green-500/20 p-2 w-10 max-h-10 rounded-xl -ml-10 bottom-3">
                <ShieldCheck color={"#5ee09a"} />
              </View>
              <View className="flex flex-col">
                <Text className="text-lg text-gray-900 dark:text-white/70 font-medium -mt-7">
                  Two-Factor Auth
                </Text>
                <Text className="text-xs text-gray-900 dark:text-gray-400/40">
                  Coming in a future update
                </Text>
              </View>
              <View className="relative items-center left-10 bottom-3">
                <Switch className="relative right-1" disabled value={false} />
              </View>
            </CardContent>
          </Card>
        </View>

        <View className="m-5">
          <Text className="uppercase text-gray-400/40 font-extrabold ml-1">
            Data
          </Text>
          <Card className="mt-2 bg-gray-400/40 dark:bg-secondary-foreground/40 border border-gray-500/20 rounded-2xl px-8">
            <Pressable
              className="active:opacity-70"
              onPress={handleExportData}
              disabled={isExporting}
            >
              <CardContent className="flex flex-row items-center gap-3 mt-5">
                <View className="relative flex flex-col items-center bg-orange-500/20 p-2 w-10 max-h-10 rounded-xl -ml-10 bottom-3">
                  <Download color={"#e8a050"} />
                </View>
                <View className="flex flex-col">
                  <Text className="text-lg text-gray-900 dark:text-white/70 font-medium -mt-7">
                    Export My Data
                  </Text>
                  <Text className="text-xs text-gray-900 dark:text-gray-400/40">
                    {isExporting
                      ? "Preparing export..."
                      : "Download a copy of your events & profile"}
                  </Text>
                </View>
                <View className="relative items-center right-4 bottom-3">
                  <ChevronRight color={"gray"} className="" />
                </View>
              </CardContent>
            </Pressable>
          </Card>
        </View>

        <View className="m-5">
          <Text className="uppercase text-gray-400/40 font-extrabold ml-1">
            Danger zone
          </Text>
          <Card className="mt-2 bg-gray-400/40 dark:bg-secondary-foreground/40 border border-gray-500/20 rounded-2xl px-8">
            <Pressable
              className="active:opacity-70"
              onPress={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              <CardContent className="flex flex-row items-center gap-3 mt-5">
                <View className="relative flex flex-col items-center bg-red-500/20 p-2 w-10 max-h-10 rounded-xl -ml-10 bottom-3">
                  <OctagonAlertIcon color={"#e05555"} />
                </View>
                <View className="flex flex-col">
                  <Text className="text-lg text-destructive dark:text-destructive font-medium -mt-7">
                    Delete Account
                  </Text>
                  <Text className="text-xs text-gray-900 dark:text-gray-400/40">
                    {isDeletingAccount
                      ? "Deleting account..."
                      : "Permanently remove all your data"}
                  </Text>
                </View>
                <View className="relative items-center left-7 bottom-3">
                  <ChevronRight color={"gray"} className="" />
                </View>
              </CardContent>
            </Pressable>
          </Card>
        </View>
      </ScrollView>

      <ChangePasswordSheet
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
      />
    </SafeAreaView>
  );
}
