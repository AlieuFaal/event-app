import type { Event } from "@vibespot/database/schema";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { CalendarDays, MapPin, MoreVertical } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";

// ─── Color map ────────────────────────────────────────────────────────────────
// Maps the 6 EventColor values to hex so we can drive the left accent bar
// and the genre pill background.

const EVENT_COLOR_MAP: Record<string, string> = {
  Blue: "#3b82f6",
  Green: "#22c55e",
  Red: "#ef4444",
  Yellow: "#eab308",
  Purple: "#a855f7",
  Orange: "#f97316",
};

const EVENT_COLOR_BG_MAP: Record<string, string> = {
  Blue: "#eff6ff",
  Green: "#f0fdf4",
  Red: "#fef2f2",
  Yellow: "#fefce8",
  Purple: "#faf5ff",
  Orange: "#fff7ed",
};

const EVENT_COLOR_BG_DARK_MAP: Record<string, string> = {
  Blue: "#1e3a5f",
  Green: "#14532d",
  Red: "#7f1d1d",
  Yellow: "#713f12",
  Purple: "#3b0764",
  Orange: "#431407",
};

const DEFAULT_COLOR = "#8b5cf6";
const DEFAULT_BG = "#faf5ff";
const DEFAULT_BG_DARK = "#3b0764";

function getAccentColor(color: string): string {
  return EVENT_COLOR_MAP[color] ?? DEFAULT_COLOR;
}

function getGenreBg(color: string, isDark: boolean): string {
  if (isDark) return EVENT_COLOR_BG_DARK_MAP[color] ?? DEFAULT_BG_DARK;
  return EVENT_COLOR_BG_MAP[color] ?? DEFAULT_BG;
}

// ─── Date formatting ──────────────────────────────────────────────────────────

function formatEventDate(start: Date, end: Date): string {
  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateStr} · ${startTime} – ${endTime}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

type UserEventCardProps = {
  event: Event;
  isPast: boolean;
  isDark: boolean;
  onDelete: (eventId: string) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function UserEventCard({
  event,
  isPast,
  isDark,
  onDelete,
}: UserEventCardProps) {
  const router = useRouter();
  const accentColor = getAccentColor(event.color);
  const genreBg = getGenreBg(event.color, isDark);

  const handleOptionsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(event.title, undefined, [
      {
        text: "View Details",
        onPress: () =>
          router.push({
            pathname: "/(protected)/event-details/[id]",
            params: { id: event.id },
          }),
      },
      {
        text: "Edit Event",
        onPress: () =>
          Alert.alert(
            "Coming Soon",
            "Event editing will be available in a future update.",
            [{ text: "OK" }],
          ),
      },
      {
        text: "Delete Event",
        style: "destructive",
        onPress: () => onDelete(event.id),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(protected)/event-details/[id]",
      params: { id: event.id },
    });
  };

  return (
    <Pressable
      onPress={handleCardPress}
      className="active:opacity-80"
      style={{ marginHorizontal: 16, marginBottom: 10 }}
    >
      <View
        className="bg-gray-300/20 dark:bg-accent-foreground"
        style={{
          borderRadius: 16,
          flexDirection: "row",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: isDark ? "#1f2937" : "#e5e7eb",
          // Subtle shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.07,
          shadowRadius: 8,
          elevation: 3,
          opacity: isPast ? 0.75 : 1,
        }}
      >
        {/* Card body */}
        <View style={{ flex: 1, padding: 14 }}>
          {/* Top row: title + options button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: "700",
                color: isDark ? "#f9fafb" : "#111827",
                marginRight: 8,
                lineHeight: 20,
              }}
              numberOfLines={2}
            >
              {event.title}
            </Text>

            <Pressable
              onPress={handleOptionsPress}
              hitSlop={8}
              style={{ padding: 2 }}
            >
              <MoreVertical
                size={18}
                color={isDark ? "#6b7280" : "#9ca3af"}
                strokeWidth={2.2}
              />
            </Pressable>
          </View>

          {/* Date / time */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <CalendarDays
              size={13}
              color={accentColor}
              strokeWidth={2}
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: isDark ? "#9ca3af" : "#6b7280",
                flex: 1,
              }}
              numberOfLines={1}
            >
              {formatEventDate(
                new Date(event.startDate),
                new Date(event.endDate),
              )}
            </Text>
          </View>

          {/* Address */}
          {event.venue || event.address ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <MapPin
                size={13}
                color={accentColor}
                strokeWidth={2}
                style={{ marginRight: 5 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: isDark ? "#9ca3af" : "#6b7280",
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {event.venue ?? event.address}
              </Text>
            </View>
          ) : null}

          {/* Bottom row: genre chip + past badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {/* Genre chip */}
            <View
              style={{
                backgroundColor: genreBg,
                borderRadius: 999,
                paddingHorizontal: 9,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: accentColor,
                }}
              >
                {event.genre}
              </Text>
            </View>

            {/* Past badge */}
            {isPast && (
              <View
                style={{
                  backgroundColor: isDark ? "#374151" : "#f3f4f6",
                  borderRadius: 999,
                  paddingHorizontal: 9,
                  paddingVertical: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: isDark ? "#9ca3af" : "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Past
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
