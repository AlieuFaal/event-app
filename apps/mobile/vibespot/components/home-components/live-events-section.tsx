import type { EventWithAttendance } from "@/types/event";
import { ScrollView, View } from "react-native";
import { LiveEventCard } from "./live-event-card";
import { NoLiveCard } from "./no-live-card";
import { SectionHeader } from "./section-header";

type LiveEventsSectionProps = {
  cardWidth: number;
  isDark: boolean;
  liveEvents: EventWithAttendance[];
  now: Date;
  onActionsPress: (event: EventWithAttendance) => void;
  upcomingEvents: EventWithAttendance[];
};

export function LiveEventsSection({
  cardWidth,
  isDark,
  liveEvents,
  now,
  onActionsPress,
  upcomingEvents,
}: LiveEventsSectionProps) {
  return (
    <View className="gap-4">
      <SectionHeader
        isDark={isDark}
        liveCount={liveEvents.length}
        title="Happening now"
      />
      {liveEvents.length > 0 ? (
        <ScrollView
          contentContainerStyle={{ gap: 16, paddingHorizontal: 20 }}
          decelerationRate="fast"
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 16}
        >
          {liveEvents.map((event) => (
            <LiveEventCard
              cardWidth={cardWidth}
              event={event}
              isDark={isDark}
              key={event.id}
              now={now}
              onActionsPress={onActionsPress}
            />
          ))}
        </ScrollView>
      ) : (
        <NoLiveCard isDark={isDark} nextEvent={upcomingEvents[0]} now={now} />
      )}
    </View>
  );
}
