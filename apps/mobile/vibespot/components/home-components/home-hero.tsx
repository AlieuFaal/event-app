import { useRouter } from "expo-router";
import { Search, User } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { formatDateHeading, getHomeHeroMessage } from "./home-utils";

type HomeHeroProps = {
  firstName: string;
  isDark: boolean;
  now: Date;
};

export function HomeHero({ firstName, isDark, now }: HomeHeroProps) {
  const router = useRouter();
  const heroMessage = getHomeHeroMessage(now);

  return (
    <View className="flex-row items-start justify-between gap-4">
      <View className="min-w-0 flex-1">
        <Text
          className={`text-[13px] font-black tracking-[1.6px] ${
            isDark ? "text-[#7d6a8d]" : "text-gray-500"
          }`}
        >
          {formatDateHeading(now)}
        </Text>
        <Text
          className={`mt-3 text-[44px] font-black leading-[48px] ${
            isDark ? "text-white" : "text-gray-950"
          }`}
        >
          {heroMessage.lead}
          {"\n"}
          <Text className="text-[#9b5cff]">
            {firstName}
            {heroMessage.endMark}
          </Text>
        </Text>
      </View>
      <View className="flex-row gap-3">
        <Pressable
          accessibilityLabel="Open event search"
          accessibilityRole="button"
          className={`h-14 w-14 items-center justify-center rounded-full ${
            isDark ? "bg-[#2a1b3c]" : "bg-white"
          }`}
          onPress={() => router.navigate("/(protected)/(tabs)/events")}
        >
          <Search color={isDark ? "#d9c8ed" : "#4b3865"} size={24} />
        </Pressable>
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          className="h-14 w-14 items-center justify-center rounded-full bg-[#8b5cf6]"
          onPress={() => router.navigate("/(protected)/(tabs)/profile")}
        >
          <User color="#ffffff" size={23} />
        </Pressable>
      </View>
    </View>
  );
}
