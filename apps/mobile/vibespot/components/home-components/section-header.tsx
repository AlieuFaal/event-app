import { Pressable, Text, View } from "react-native";

type SectionHeaderProps = {
  actionLabel?: string;
  isDark: boolean;
  liveCount?: number;
  onActionPress?: () => void;
  title: string;
};

export function SectionHeader({
  actionLabel,
  isDark,
  liveCount,
  onActionPress,
  title,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5">
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        {liveCount !== undefined ? (
          <View
            className={`h-2.5 w-2.5 rounded-full ${
              liveCount > 0 ? "bg-[#ff6b5f]" : "bg-[#7c6a8e]"
            }`}
          />
        ) : null}
        <Text
          className={`text-[26px] font-bold ${isDark ? "text-white" : "text-gray-950"}`}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          className="rounded-full px-3 py-2 active:opacity-75"
          onPress={onActionPress}
        >
          <Text className="text-[15px] font-bold text-[#9b5cff]">
            {actionLabel}
          </Text>
        </Pressable>
      ) : liveCount && liveCount > 0 ? (
        <View className="rounded-lg bg-[#4b1f25] px-3 py-1.5">
          <Text className="text-[13px] font-black tracking-[0.6px] text-[#ff7569]">
            LIVE
          </Text>
        </View>
      ) : null}
    </View>
  );
}
