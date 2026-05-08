import { ScrollView, Text, View } from "react-native";
import { getWeekDays, isSameDay } from "./home-utils";

type WeekRailProps = {
  eventDates: Date[];
  isDark: boolean;
  now: Date;
};

export function WeekRail({ eventDates, isDark, now }: WeekRailProps) {
  return (
    <View className="gap-3">
      <Text
        className={`px-5 text-[17px] font-bold ${isDark ? "text-[#a999ba]" : "text-gray-600"}`}
      >
        Your week
      </Text>
      <ScrollView
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {getWeekDays(now).map((date) => {
          const isToday = isSameDay(date, now);
          const hasEvent = eventDates.some((eventDate) =>
            isSameDay(eventDate, date),
          );

          return (
            <View
              className={`h-[82px] w-[62px] items-center justify-center rounded-2xl border ${
                isToday
                  ? "border-[#965cff] bg-[#8b4cf6]"
                  : isDark
                    ? "border-white/10 bg-[#1b1225]"
                    : "border-violet-100 bg-white"
              }`}
              key={date.toISOString()}
            >
              <Text
                className={`text-[11px] font-black tracking-[1px] ${
                  isToday
                    ? "text-white/80"
                    : isDark
                      ? "text-[#766582]"
                      : "text-gray-500"
                }`}
              >
                {date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase()}
              </Text>
              <Text
                className={`mt-1 text-[24px] font-black leading-7 ${
                  isToday
                    ? "text-white"
                    : isDark
                      ? "text-[#c9b9d7]"
                      : "text-gray-900"
                }`}
              >
                {date.getDate()}
              </Text>
              <View
                className={`mt-2 h-1.5 w-1.5 rounded-full ${
                  hasEvent ? (isToday ? "bg-white" : "bg-[#9b5cff]") : ""
                }`}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
