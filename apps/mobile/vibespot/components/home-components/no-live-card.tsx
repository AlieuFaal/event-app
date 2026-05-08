import type { EventWithAttendance } from "@/types/event";
import { LinearGradient } from "expo-linear-gradient";
import { Flame } from "lucide-react-native";
import { Text, View } from "react-native";
import { formatStartsIn } from "./home-utils";

type NoLiveCardProps = {
  isDark: boolean;
  nextEvent?: EventWithAttendance;
  now: Date;
};

export function NoLiveCard({ isDark, nextEvent, now }: NoLiveCardProps) {
  return (
    <View
      className={`mx-5 overflow-hidden rounded-[28px] border p-5 shadow-lg ${
        isDark
          ? "border-white/10 bg-[#171020] shadow-black/20"
          : "border-violet-100 bg-white shadow-violet-900/10"
      }`}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(139, 92, 246, 0.28)", "rgba(255, 107, 95, 0.08)"]
            : ["rgba(139, 92, 246, 0.16)", "rgba(255, 107, 95, 0.08)"]
        }
        style={{
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
      <View className="gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#8b5cf6]">
          <Flame color="#ffffff" size={24} />
        </View>
        <Text
          className={`text-[24px] font-black ${isDark ? "text-white" : "text-gray-950"}`}
        >
          Nothing live right now
        </Text>
        <Text
          className={`text-[15px] leading-6 ${isDark ? "text-[#aa9ab7]" : "text-gray-600"}`}
        >
          {nextEvent
            ? `${nextEvent.title} is next. ${formatStartsIn(new Date(nextEvent.startDate), now)}.`
            : "Fresh events will appear here as soon as they start."}
        </Text>
      </View>
    </View>
  );
}
