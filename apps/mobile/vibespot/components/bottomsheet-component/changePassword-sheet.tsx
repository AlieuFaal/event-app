import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { passwordChangeSchema } from "@vibespot/validation";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Alert, Text, useColorScheme, View } from "react-native";

interface ChangePasswordSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
  snapPoints: string[];
}

export function ChangePasswordSheet({
  bottomSheetRef,
  snapPoints,
}: ChangePasswordSheetProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
    setErrorMessage(null);
  }, [bottomSheetRef]);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setPasswordConfirmation("");
    setErrorMessage(null);
  };

  const handleUpdatePassword = async () => {
    const validation = passwordChangeSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword: passwordConfirmation,
    });

    if (!validation.success) {
      const issue = validation.error.issues[0];
      setErrorMessage(issue?.message ?? "Please check your password fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await authClient.changePassword({
        currentPassword: validation.data.currentPassword,
        newPassword: validation.data.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setErrorMessage(error.message || "Unable to update password.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Password updated", "Your password has been changed.");
      resetForm();
      bottomSheetRef.current?.close();
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Unable to update password. Please try again.",
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={handleClosePress}
      backgroundStyle={{
        backgroundColor: colorScheme === "dark" ? "#1e1829" : "#ffffff",
      }}
      handleIndicatorStyle={{
        backgroundColor: colorScheme === "dark" ? "#6b7280" : "#d1d5db",
      }}
    >
      <BottomSheetView>
        <View className="items-center">
          <Text className="text-xl font-extrabold mt-1 text-gray-900 dark:text-white">
            Change password
          </Text>
        </View>
        <View className="flex flex-col gap-4 p-4">
          <View className="gap-2">
            <Text className="uppercase text-gray-400/40 font-extrabold ml-1 text-xs">
              Current Password
            </Text>
            <Input
              id="current-password"
              secureTextEntry
              returnKeyType="next"
              placeholder="Current password"
              className="h-fit p-4 bg-white dark:bg-secondary-foreground/40 text-gray-900 dark:text-gray-900 dark:border-secondary-foreground"
              placeholderTextColor="#6b7280"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>
          <View className="gap-2">
            <Text className="uppercase text-gray-400/40 font-extrabold ml-1 text-xs">
              New Password
            </Text>
            <Input
              id="new-password"
              secureTextEntry
              returnKeyType="next"
              placeholder="New password"
              className="h-fit p-4 bg-white dark:bg-secondary-foreground/40 text-gray-900 dark:text-gray-900 dark:border-secondary-foreground"
              placeholderTextColor="#6b7280"
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
          <View className="gap-2">
            <Text className="uppercase text-gray-400/40 font-extrabold ml-1 text-xs">
              Confirm Password
            </Text>
            <Input
              id="confirm-password"
              secureTextEntry
              returnKeyType="done"
              placeholder="Confirm password"
              className="h-fit p-4 bg-white dark:bg-secondary-foreground/40 text-gray-900 dark:text-gray-900 dark:border-secondary-foreground"
              placeholderTextColor="#6b7280"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              onSubmitEditing={handleUpdatePassword}
            />
          </View>
          {errorMessage ? (
            <Text className="text-red-500 dark:text-red-400 text-sm">
              {errorMessage}
            </Text>
          ) : null}
          <Button
            className="mt-4"
            onPress={handleUpdatePassword}
            disabled={isSubmitting}
          >
            <Text className="text-gray-400/80 font-semibold">
              {isSubmitting ? "Updating..." : "Update Password"}
            </Text>
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
