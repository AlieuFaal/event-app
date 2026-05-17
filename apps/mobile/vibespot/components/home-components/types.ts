import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import type { EventWithAttendance } from "@/types/event";

export type HomeContentProps = {
	events: EventWithAttendance[];
	onActionsPress: (event: EventWithAttendance) => void;
	onMomentumScrollBegin?: (
		event: NativeSyntheticEvent<NativeScrollEvent>,
	) => void;
	onMomentumScrollEnd?: (
		event: NativeSyntheticEvent<NativeScrollEvent>,
	) => void;
	onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
	onScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
	userName?: string | null;
};

export type HomeEventCardProps = {
	event: EventWithAttendance;
	isDark: boolean;
	now: Date;
	onActionsPress: (event: EventWithAttendance) => void;
};
