import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type StatCardProps = {
  accessibilityLabel?: string;
  icon: ReactNode;
  isDark: boolean;
  label: string;
  onPress?: () => void;
  value: number;
};

export function StatCard({
  accessibilityLabel,
  icon,
  isDark,
  label,
  onPress,
  value,
}: StatCardProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? "button" : undefined}
      className={`h-[92px] flex-1 justify-between rounded-2xl border p-4 shadow-lg active:opacity-80 ${
        isDark
          ? "border-white/10 bg-[#171020] shadow-black/20"
          : "border-violet-100 bg-white shadow-violet-900/10"
      }`}
      disabled={!onPress}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-[28px] font-black leading-8 ${isDark ? "text-white" : "text-gray-950"}`}
        >
          {value}
        </Text>
        {icon}
      </View>
      <Text
        className={`text-[11px] font-bold tracking-[1.5px] ${
          isDark ? "text-[#8f7ca1]" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
