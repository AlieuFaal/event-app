import { useRouter } from "expo-router";
import { CalendarDays, Flame, Ticket } from "lucide-react-native";
import { View } from "react-native";
import { StatCard } from "./stat-card";

type HomeStatsRowProps = {
  goingCount: number;
  isDark: boolean;
  liveCount: number;
  thisWeekCount: number;
};

export function HomeStatsRow({
  goingCount,
  isDark,
  liveCount,
  thisWeekCount,
}: HomeStatsRowProps) {
  const router = useRouter();

  const openEventsFilter = (filter: "live" | "going" | "this-week") => {
    router.navigate({
      pathname: "/(protected)/(tabs)/events",
      params: { filter },
    });
  };

  return (
    <View className="flex-row gap-3">
      <StatCard
        accessibilityLabel="Show live events"
        icon={<Flame color="#ff7569" size={20} />}
        isDark={isDark}
        label="LIVE NOW"
        onPress={() => openEventsFilter("live")}
        value={liveCount}
      />
      <StatCard
        accessibilityLabel="Show events I am going to"
        icon={<Ticket color="#9b5cff" size={20} />}
        isDark={isDark}
        label="GOING"
        onPress={() => openEventsFilter("going")}
        value={goingCount}
      />
      <StatCard
        accessibilityLabel="Show this week's events"
        icon={<CalendarDays color="#5ee1a1" size={20} />}
        isDark={isDark}
        label="THIS WEEK"
        onPress={() => openEventsFilter("this-week")}
        value={thisWeekCount}
      />
    </View>
  );
}
