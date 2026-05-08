import { Clock3 } from "lucide-react-native";
import { Text, View } from "react-native";

type TodaySummaryCardProps = {
  todayCount: number;
};

export function TodaySummaryCard({ todayCount }: TodaySummaryCardProps) {
  if (todayCount <= 0) return null;

  return (
    <View className="mx-5 flex-row items-center gap-3 rounded-3xl bg-[#8b5cf6] p-4">
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
        <Clock3 color="#ffffff" size={22} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[17px] font-black text-white">
          {todayCount} {todayCount === 1 ? "event" : "events"} on deck today
        </Text>
        <Text className="text-[13px] font-semibold text-white/70">
          Open the Events tab to plan the rest of the night.
        </Text>
      </View>
    </View>
  );
}
