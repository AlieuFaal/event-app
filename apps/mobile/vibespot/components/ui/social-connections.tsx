import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, Image, Platform, View } from "react-native";

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    type: "oauth_google",
    source: { uri: "https://img.clerk.com/static/google.png?width=160" },
    useTint: false,
    label: "Continue with Google",
  },
  {
    type: "oauth_github",
    source: { uri: "https://img.clerk.com/static/github.png?width=160" },
    useTint: true,
    label: "Continue with GitHub",
  },
  {
    type: "oauth_facebook",
    source: { uri: "https://img.clerk.com/static/facebook.png?width=160" },
    useTint: false,
    label: "Continue with Facebook",
  },
] as const;

type SocialConnectionsProps = {
  disabled?: boolean;
};

export function SocialConnections({
  disabled = false,
}: SocialConnectionsProps) {
  const handleSocialSignIn = () => {
    Alert.alert("Coming soon", "Social sign-in is coming soon.");
  };

  return (
    <View className="sm:flex-row sm:gap-3 flex flex-row justify-between w-fit p-5 -mt-5">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="sm:flex-1 p-8 bg-white dark:bg-white border-gray-300 dark:border-gray-300"
            disabled={disabled}
            onPress={handleSocialSignIn}
            accessibilityLabel={strategy.label}
          >
            <Image
              className={cn(
                "size-4",
                strategy.useTint && Platform.select({ web: "dark:invert" }),
              )}
              tintColor={Platform.select({
                native: strategy.useTint ? "black" : undefined,
              })}
              source={strategy.source}
            />
          </Button>
        );
      })}
    </View>
  );
}
