import {
  formatDay,
  formatMonth,
  getAccentColor,
  getGenreBg,
  getLocationLabel,
} from "@/components/event-components/all-events-utils";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { EventActionButton } from "./event-action-button";
import {
  formatStartsIn,
  getEventImageSource,
  openEventDetails,
} from "./home-utils";
import type { HomeEventCardProps } from "./types";

export function UpcomingEventTile({
  event,
  isDark,
  now,
  onActionsPress,
}: HomeEventCardProps) {
  const router = useRouter();
  const accentColor = getAccentColor(event.color);
  const genreBg = getGenreBg(event.color, isDark);
  const startDate = new Date(event.startDate);

  return (
    <Pressable
      className={`w-[198px] overflow-hidden rounded-3xl border active:opacity-90 ${
        isDark ? "border-white/10 bg-[#181020]" : "border-violet-100 bg-white"
      }`}
      onLongPress={() => onActionsPress(event)}
      onPress={() => openEventDetails(router, event.id)}
    >
      <View className="h-[142px] overflow-hidden">
        <Image
          contentFit="cover"
          source={getEventImageSource(event)}
          style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.62)"]}
          style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
        />
        <View className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1.5">
          <Text className="text-[11px] font-black tracking-[1px] text-white">
            {formatMonth(startDate)} {formatDay(startDate)}
          </Text>
        </View>
        <View className="absolute right-2 top-2">
          <EventActionButton
            event={event}
            isDark={true}
            onActionsPress={onActionsPress}
          />
        </View>
      </View>

      <View className="gap-2 p-4">
        <Text
          className={`text-[20px] font-black leading-6 ${isDark ? "text-white" : "text-gray-950"}`}
          numberOfLines={2}
        >
          {event.title}
        </Text>
        <Text
          className={`text-[13px] ${isDark ? "text-[#9d8dac]" : "text-gray-600"}`}
          numberOfLines={1}
        >
          {getLocationLabel(event)} ·{" "}
          {formatStartsIn(startDate, now).replace("Starts in ", "in ")}
        </Text>
        <View
          className="self-start rounded-full px-3 py-1.5"
          style={{ backgroundColor: genreBg }}
        >
          <Text
            className="text-[12px] font-black"
            style={{ color: accentColor }}
          >
            {event.genre}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
