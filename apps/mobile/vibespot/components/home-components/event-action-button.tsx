import type { EventWithAttendance } from "@/types/event";
import { MoreVertical } from "lucide-react-native";
import type { GestureResponderEvent } from "react-native";
import { Pressable } from "react-native";

type EventActionButtonProps = {
  event: EventWithAttendance;
  isDark: boolean;
  onActionsPress: (event: EventWithAttendance) => void;
};

export function EventActionButton({
  event,
  isDark,
  onActionsPress,
}: EventActionButtonProps) {
  const handlePress = (pressEvent: GestureResponderEvent) => {
    pressEvent.stopPropagation();
    onActionsPress(event);
  };

  return (
    <Pressable
      accessibilityLabel="Open event actions"
      accessibilityRole="button"
      className={`h-10 w-10 items-center justify-center rounded-full active:opacity-80 ${
        isDark ? "bg-[#0e0716]/70" : "bg-white/90"
      }`}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      onPress={handlePress}
    >
      <MoreVertical color={isDark ? "#f8f1ff" : "#33233f"} size={18} />
    </Pressable>
  );
}
