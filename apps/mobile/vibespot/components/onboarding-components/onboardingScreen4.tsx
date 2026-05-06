import { View } from "@rn-primitives/slot";
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
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";

export default function OnboardingScreenComponent4() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View className="flex-1">
        <Card className="flex-1 bg-transparent dark:bg-transparent rounded-none px-0 border-transparent">
          <CardHeader className="mt-10 px-6">
            <CardTitle className="text-center text-3xl sm:text-left text-gray-900 dark:text-white">
              Onboarding Complete!
            </CardTitle>
            <CardDescription className="text-center sm:text-left">
              You&apos;re all set! Tap the button below to explore VibeSpot.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-5 gap-6 px-6">
            <Text className={cn("text-center dark:text-white")}>
              Thank you for completing the onboarding process. We&apos;re
              excited to have you on board!
            </Text>
            <Button
              className="mt-4"
              onPress={() => {
                router.navigate("/(protected)/(tabs)");
              }}
            >
              <Text className="h-fit">Go to VibeSpot</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
