import {
  formatTimeRange,
  getAccentColor,
  getGenreBg,
  getLocationLabel,
} from "@/components/event-components/all-events-utils";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Clock3, MapPin, Users } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { EventActionButton } from "./event-action-button";
import {
  formatEndsIn,
  getEventImageSource,
  openEventDetails,
} from "./home-utils";
import type { HomeEventCardProps } from "./types";

type LiveEventCardProps = HomeEventCardProps & {
  cardWidth: number;
};

export function LiveEventCard({
  cardWidth,
  event,
  isDark,
  now,
  onActionsPress,
}: LiveEventCardProps) {
  const router = useRouter();
  const accentColor = getAccentColor(event.color);
  const genreBg = getGenreBg(event.color, isDark);
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <Pressable
      className={`overflow-hidden rounded-[30px] border shadow-2xl active:opacity-90 ${
        isDark
          ? "border-white/10 bg-[#160f20] shadow-black/30"
          : "border-violet-200 bg-white shadow-violet-900/10"
      }`}
      onLongPress={() => onActionsPress(event)}
      onPress={() => openEventDetails(router, event.id)}
      style={{ width: cardWidth }}
    >
      <View
        className="overflow-hidden"
        style={{ height: Math.max(205, cardWidth * 0.62) }}
      >
        <Image
          contentFit="cover"
          source={getEventImageSource(event)}
          style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
        />
        <LinearGradient
          colors={["rgba(57, 18, 99, 0.15)", "rgba(18, 8, 29, 0.92)"]}
          style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
        />
        <View className="absolute left-4 right-4 top-4 flex-row items-start justify-between">
          <View className="rounded-full bg-black/55 px-3 py-2">
            <Text className="text-[12px] font-black tracking-[1.4px] text-white">
              LIVE FEED
            </Text>
          </View>
          <EventActionButton
            event={event}
            isDark={true}
            onActionsPress={onActionsPress}
          />
        </View>
        <View className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-2">
          <Text className="text-[13px] font-bold text-white">
            {formatEndsIn(endDate, now)}
          </Text>
        </View>
      </View>

      <View className="gap-4 p-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1 gap-2">
            <Text
              className={`text-[28px] font-black leading-[32px] ${isDark ? "text-white" : "text-gray-950"}`}
              numberOfLines={2}
            >
              {event.title}
            </Text>
            <View className="flex-row flex-wrap gap-x-4 gap-y-2">
              <View className="max-w-[58%] flex-row items-center gap-1.5">
                <MapPin color={isDark ? "#a696b5" : "#6b6473"} size={15} />
                <Text
                  className={`text-[15px] ${isDark ? "text-[#b6a8c4]" : "text-gray-600"}`}
                  numberOfLines={1}
                >
                  {getLocationLabel(event)}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Clock3 color={isDark ? "#a696b5" : "#6b6473"} size={15} />
                <Text
                  className={`text-[15px] ${isDark ? "text-[#b6a8c4]" : "text-gray-600"}`}
                  numberOfLines={1}
                >
                  {formatTimeRange(startDate, endDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row flex-wrap items-center gap-2">
          <View
            className="rounded-full px-3.5 py-2"
            style={{ backgroundColor: genreBg }}
          >
            <Text
              className="text-[14px] font-black"
              style={{ color: accentColor }}
            >
              {event.genre}
            </Text>
          </View>
          {event.attendeeCount > 0 ? (
            <View className="flex-row items-center gap-1.5 rounded-full bg-[#37204f] px-3.5 py-2">
              <Users color="#c7a7ff" size={14} />
              <Text className="text-[14px] font-bold text-[#d8c4ff]">
                {event.attendeeCount} going
              </Text>
            </View>
          ) : null}
          <View className="ml-auto rounded-full bg-[#8b5cf6] px-4 py-2">
            <Text className="text-[14px] font-black text-white">Details</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
