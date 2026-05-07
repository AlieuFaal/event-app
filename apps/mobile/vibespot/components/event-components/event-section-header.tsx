import { Text, View } from "react-native";

interface EventSectionHeaderProps {
  title: string;
  count: number;
  isDark: boolean;
  isPast: boolean;
}

export function EventSectionHeader({
  title,
  count,
  isDark,
  isPast,
}: EventSectionHeaderProps) {
  const accentColor = isPast ? (isDark ? "#5a4a6e" : "#9ca3af") : "#8b5cf6";

  return (
    <View className="flex-row items-center px-5 pb-2 pt-2">
      <View
        className="mr-2.5 h-4 w-[3px] rounded-sm"
        style={{ backgroundColor: accentColor }}
      />
      <Text
        className={`flex-1 text-[11px] font-bold uppercase tracking-[1px] ${isDark ? "text-[#5a4a6e]" : "text-gray-500"}`}
      >
        {title}
      </Text>
      <View
        className={`rounded-full px-2 py-0.5 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
      >
        <Text
          className={`text-[11px] font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          {count}
        </Text>
      </View>
    </View>
  );
}
