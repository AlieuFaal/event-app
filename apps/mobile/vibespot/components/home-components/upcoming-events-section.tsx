import type { EventWithAttendance } from "@/types/event";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SectionHeader } from "./section-header";
import { UpcomingEventTile } from "./upcoming-event-tile";

type UpcomingEventsSectionProps = {
  isDark: boolean;
  now: Date;
  onActionsPress: (event: EventWithAttendance) => void;
  upcomingEvents: EventWithAttendance[];
};

export function UpcomingEventsSection({
  isDark,
  now,
  onActionsPress,
  upcomingEvents,
}: UpcomingEventsSectionProps) {
  const router = useRouter();

  return (
    <View className="gap-4">
      <SectionHeader
        actionLabel="See all"
        isDark={isDark}
        onActionPress={() => router.navigate("/(protected)/(tabs)/events")}
        title="Upcoming"
      />
      {upcomingEvents.length > 0 ? (
        <ScrollView
          contentContainerStyle={{ gap: 16, paddingHorizontal: 20 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {upcomingEvents.slice(0, 8).map((event) => (
            <UpcomingEventTile
              event={event}
              isDark={isDark}
              key={event.id}
              now={now}
              onActionsPress={onActionsPress}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          className={`mx-5 rounded-3xl border p-5 ${
            isDark
              ? "border-white/10 bg-[#171020]"
              : "border-violet-100 bg-white"
          }`}
        >
          <Text
            className={`text-[17px] font-bold ${isDark ? "text-white" : "text-gray-950"}`}
          >
            No upcoming events
          </Text>
          <Text
            className={`mt-2 text-[14px] leading-5 ${isDark ? "text-[#9d8dac]" : "text-gray-600"}`}
          >
            New events will show up here as soon as they are published.
          </Text>
        </View>
      )}
    </View>
  );
}
