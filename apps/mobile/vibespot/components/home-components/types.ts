import type { EventWithAttendance } from "@/types/event";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export type HomeContentProps = {
  events: EventWithAttendance[];
  onActionsPress: (event: EventWithAttendance) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  userName?: string | null;
};

export type HomeEventCardProps = {
  event: EventWithAttendance;
  isDark: boolean;
  now: Date;
  onActionsPress: (event: EventWithAttendance) => void;
};
