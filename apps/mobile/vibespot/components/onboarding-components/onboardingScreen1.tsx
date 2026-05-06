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

export default function OnboardingScreenComponent1() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <Card className="flex-1 items-center justify-center bg-transparent dark:bg-transparent rounded-none px-0 border-transparent">
        <CardHeader className="flex flex-col items-center -mt-64 px-0">
          <CardTitle className="text-3xl text-primary dark:text-purple-400">
            Welcome to VibeSpot!
          </CardTitle>
          <CardDescription className="text-xl">
            Let&apos;s setup your account!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center px-0">
          <Button
            className="p-3 h-fit w-60 rounded-3xl"
            onPress={() => {
              router.push("/(protected)/onboarding/onboardingScreen2");
              console.log("Proceeding to onboarding step 2.");
            }}
          >
            <Text>Continue</Text>
          </Button>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}
