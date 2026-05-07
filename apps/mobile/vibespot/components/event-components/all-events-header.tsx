import { Search } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface AllEventsHeaderProps {
  isDark: boolean;
  stats: {
    total: number;
    upcoming: number;
    past: number;
  };
  onSearchPress?: () => void;
}

export function AllEventsHeader({
  isDark,
  stats,
  onSearchPress,
}: AllEventsHeaderProps) {
  return (
    <View className="pt-3.5">
      <View className="flex-row items-center justify-between px-5">
        <Text
          className={`text-[28px] font-bold ${isDark ? "text-[#f0eaf5]" : "text-gray-900"}`}
        >
          All Events
        </Text>
        <Pressable hitSlop={10} onPress={onSearchPress}>
          <Search size={20} color={isDark ? "#7c6a8e" : "#6b7280"} />
        </Pressable>
      </View>

      <Text
        className={`mt-1.5 px-5 text-sm ${isDark ? "text-[#7c6a8e]" : "text-gray-500"}`}
      >
        {stats.total} events ·{" "}
        <Text className="font-semibold text-[#a78bca]">
          {stats.upcoming} upcoming
        </Text>{" "}
        · {stats.past} past
      </Text>

      <View
        className="mx-5 mb-1 mt-3 h-px"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb",
        }}
      />
    </View>
  );
}
