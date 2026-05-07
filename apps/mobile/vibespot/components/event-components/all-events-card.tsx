import { useRouter } from "expo-router";
import { Clock3, MapPin, MoreVertical } from "lucide-react-native";
import type { GestureResponderEvent } from "react-native";
import { Pressable, Text, View } from "react-native";
import type { EventWithAttendance } from "@/types/event";
import {
  formatDay,
  formatMonth,
  formatTimeRange,
  getAccentColor,
  getGenreBg,
  getLocationLabel,
} from "./all-events-utils";

interface AllEventsCardProps {
  event: EventWithAttendance;
  isPast: boolean;
  isDark: boolean;
  onActionsPress: (event: EventWithAttendance) => void;
}

export function AllEventsCard({
  event,
  isPast,
  isDark,
  onActionsPress,
}: AllEventsCardProps) {
  const router = useRouter();
  const accentColor = getAccentColor(event.color);
  const genreBg = getGenreBg(event.color, isDark);
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const handleActionsPress = (pressEvent: GestureResponderEvent) => {
    pressEvent.stopPropagation();
    onActionsPress(event);
  };

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(protected)/event-details/[id]",
          params: { id: event.id },
        })
      }
      className="mx-4 mb-2.5 active:opacity-85"
      style={{ opacity: isPast ? 0.55 : 1 }}
    >
      <View
        className={`flex-row items-center gap-3 rounded-2xl border px-3 py-3 ${isDark ? "border-white/10 bg-[#231529]" : "border-gray-200 bg-white"}`}
      >
        <View className="h-[50px] w-[44px] items-center justify-center rounded-[10px] border border-gray-400/20 dark:bg-black">
          <Text className="text-[9px] font-bold tracking-[1px] text-red-500 dark:text-muted-foreground">
            {formatMonth(startDate)}
          </Text>
          <Text className="text-[20px] font-bold leading-5 text-black dark:text-white">
            {formatDay(startDate)}
          </Text>
        </View>

        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            className={`text-[15px] font-semibold ${isDark ? "text-[#f0eaf5]" : "text-gray-900"}`}
          >
            {event.title}
          </Text>

          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={11} color={isDark ? "#7c6a8e" : "#6b7280"} />
            <Text
              numberOfLines={1}
              className={`flex-1 text-xs ${isDark ? "text-[#7c6a8e]" : "text-gray-500"}`}
            >
              {getLocationLabel(event)}
            </Text>
          </View>

          <View className="mt-1 flex-row items-center gap-1">
            <Clock3 size={11} color={isDark ? "#7c6a8e" : "#6b7280"} />
            <Text
              numberOfLines={1}
              className={`flex-1 text-xs ${isDark ? "text-[#7c6a8e]" : "text-gray-500"}`}
            >
              {formatTimeRange(startDate, endDate)}
            </Text>
          </View>

          <View
            className="mt-1.5 self-start rounded-full px-2 py-0.5"
            style={{ backgroundColor: genreBg }}
          >
            <Text
              className="text-[11px] font-semibold"
              style={{ color: accentColor }}
            >
              {event.genre}
            </Text>
          </View>
        </View>

        <View className="items-end gap-2">
          <Pressable hitSlop={10} onPress={handleActionsPress}>
            <MoreVertical
              size={15}
              color={isDark ? "#4a3a5a" : "#9ca3af"}
              strokeWidth={2.2}
            />
          </Pressable>
          {isPast ? (
            <Text
              className="text-[10px] font-semibold tracking-[0.4px]"
              style={{ color: isDark ? "#4a3a5a" : "#6b7280" }}
            >
              PAST
            </Text>
          ) : event.isGoing ? (
            <View className="rounded-md bg-[#7c3fdb]/20 px-2 py-0.5">
              <Text className="text-[10px] font-bold tracking-[0.4px] text-[#a78bca]">
                GOING
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
