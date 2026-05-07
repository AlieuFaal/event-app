import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "../ui/button";
import { useRouter } from "expo-router";
import { roleUpdateSchema } from "@vibespot/validation";

export function OnboardingScreenComponent2() {
  // const updateUser = useServerFn(updateRoleFn);

  const session = authClient.useSession();

  const router = useRouter();

  async function updateRoleToUser() {
    if (!session.data) return;

    try {
      const payload = roleUpdateSchema.parse({ role: "user" });
      const response = await apiClient.users.updaterole[":id"].$put({
        param: { id: session.data.user.id },
        json: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      console.log(
        `${session.data.user.name}'s role has been updated to User / Enthusiast.`,
      );
    } catch (error) {
      console.error("Error updating role to user:", error);
    }
  }

  async function updateRoleToArtist() {
    if (!session.data) return;

    try {
      const payload = roleUpdateSchema.parse({ role: "artist" });
      const response = await apiClient.users.updaterole[":id"].$put({
        param: { id: session.data.user.id },
        json: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      console.log(
        `${session.data.user.name}'s role has been updated to Artist.`,
      );
    } catch (error) {
      console.error("Error updating role to artist:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-1">
        <Card className="flex-1 rounded-none bg-transparent dark:bg-transparent px-0 border-transparent">
          <CardHeader className="flex flex-col items-center mt-8 gap-2 px-6">
            <CardTitle className="text-5xl text-primary dark:text-purple-400 text-center">
              Which of these fits you best?
            </CardTitle>
            <CardDescription className="text-xl text-center mt-5">
              Only Artists will be able to create events.
            </CardDescription>
            <CardDescription className="text-xl">
              You can change this later in settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row items-center justify-center gap-3 mx-auto mt-5 px-6">
            <View>
              <Button
                className="h-fit w-40 p-6 rounded-3xl"
                onPress={async () => {
                  await updateRoleToUser();
                  router.replace("/(protected)/onboarding/onboardingScreen3");
                  console.log(
                    "Selected account type: Enthusiast, proceeding to next step.",
                  );
                }}
              >
                <Text className="text-xs text-center">The Concert Lover</Text>
              </Button>
            </View>
            <Text className="dark:text-white">or</Text>
            <View>
              <Button
                className="h-fit w-40 p-8 rounded-3xl"
                onPress={async () => {
                  await updateRoleToArtist();
                  router.push("/(protected)/onboarding/onboardingScreen3");
                  console.log(
                    "Selected account type: Artist, proceeding to next step.",
                  );
                }}
              >
                <Text className="text-xs">The Artist</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
