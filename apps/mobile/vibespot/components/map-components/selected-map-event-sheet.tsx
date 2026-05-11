import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	MapPin as MapPinIcon,
	Navigation,
	ReceiptText,
	UsersRound,
} from "lucide-react-native";
import type { RefObject } from "react";
import { Pressable, Text, View } from "react-native";
import {
	formatTimeRange,
	getLocationLabel,
} from "@/components/event-components/all-events-utils";
import {
	formatAttendeeCount,
	formatEventDate,
	type MapEventGroup,
} from "@/components/map-components/map-utils";
import type { EventWithAttendance } from "@/types/event";

type SelectedMapEventSheetProps = {
	bottomSheetRef: RefObject<BottomSheetMethods | null>;
	isDark: boolean;
	selectedEvent: EventWithAttendance | null;
	selectedEventIndex: number;
	selectedGroup: MapEventGroup | null;
	onChange: (index: number) => void;
	onClose: () => void;
	onNextEvent: () => void;
	onOpenDirections: () => void;
	onPreviousEvent: () => void;
	onViewDetails: () => void;
};

export function SelectedMapEventSheet({
	bottomSheetRef,
	isDark,
	selectedEvent,
	selectedEventIndex,
	selectedGroup,
	onChange,
	onClose,
	onNextEvent,
	onOpenDirections,
	onPreviousEvent,
	onViewDetails,
}: SelectedMapEventSheetProps) {
	const hasMultipleEvents = Boolean(selectedGroup && selectedGroup.events.length > 1);
	const isFirstEvent = selectedEventIndex === 0;
	const isLastEvent = selectedGroup
		? selectedEventIndex === selectedGroup.events.length - 1
		: true;

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={-1}
			enableDynamicSizing={true}
			enablePanDownToClose={true}
			maxDynamicContentSize={360}
			onChange={onChange}
			onClose={onClose}
			backgroundStyle={{
				backgroundColor: isDark ? "#101722" : "#ffffff",
				borderTopLeftRadius: 28,
				borderTopRightRadius: 28,
			}}
			handleIndicatorStyle={{
				width: 52,
				backgroundColor: isDark ? "#586273" : "#d1d5db",
			}}
		>
			<BottomSheetView className="px-5 pb-7">
				{selectedEvent && selectedGroup ? (
					<View>
						<View className="pb-4">
							<View className="flex-row items-start gap-3">
								<View className="h-11 w-11 items-center justify-center rounded-full bg-violet-500">
									<MapPinIcon size={22} color="#ffffff" strokeWidth={2.6} />
								</View>
								<View className="min-w-0 flex-1">
									<Text
										className="text-[20px] font-bold text-gray-950 dark:text-[#f8f4ff]"
										numberOfLines={2}
									>
										{selectedEvent.title}
									</Text>
									<Text
										className="mt-1 text-[13px] text-gray-500 dark:text-[#9687a4]"
										numberOfLines={1}
									>
										{getLocationLabel(selectedEvent)}
									</Text>
								</View>
							</View>
						</View>

						<View className="gap-2">
							<View className="flex-row items-center gap-2">
								<Calendar size={16} color={isDark ? "#a092ad" : "#6b7280"} />
								<Text className="flex-1 text-[14px] text-gray-700 dark:text-[#d4c7df]">
									{formatEventDate(selectedEvent.startDate)} at{" "}
									{formatTimeRange(
										new Date(selectedEvent.startDate),
										new Date(selectedEvent.endDate),
									)}
								</Text>
							</View>
							<View className="flex-row items-center gap-2">
								<UsersRound size={16} color={isDark ? "#a092ad" : "#6b7280"} />
								<Text className="flex-1 text-[14px] text-gray-700 dark:text-[#d4c7df]">
									{formatAttendeeCount(selectedEvent.attendeeCount)}
								</Text>
							</View>
						</View>

						{hasMultipleEvents ? (
							<View className="mt-4 flex-row items-center justify-between rounded-2xl bg-black/5 px-2 py-2 dark:bg-white/10">
								<Pressable
									accessibilityRole="button"
									accessibilityLabel="Show previous event at this location"
									disabled={isFirstEvent}
									onPress={onPreviousEvent}
									className={`h-10 w-10 items-center justify-center rounded-full active:opacity-70 ${
										isFirstEvent ? "opacity-40" : ""
									}`}
								>
									<ChevronLeft
										size={22}
										color={isDark ? "#f3eef8" : "#111827"}
									/>
								</Pressable>
								<Text className="text-[13px] font-semibold text-gray-600 dark:text-[#c7bad3]">
									{selectedEventIndex + 1} of {selectedGroup.events.length}
								</Text>
								<Pressable
									accessibilityRole="button"
									accessibilityLabel="Show next event at this location"
									disabled={isLastEvent}
									onPress={onNextEvent}
									className={`h-10 w-10 items-center justify-center rounded-full active:opacity-70 ${
										isLastEvent ? "opacity-40" : ""
									}`}
								>
									<ChevronRight
										size={22}
										color={isDark ? "#f3eef8" : "#111827"}
									/>
								</Pressable>
							</View>
						) : null}

						<View className="mt-4 flex-row gap-3">
							<Pressable
								accessibilityRole="button"
								accessibilityLabel="View event details"
								onPress={onViewDetails}
								className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-violet-500 px-3 active:opacity-80"
							>
								<ReceiptText size={18} color="#ffffff" />
								<Text className="text-[15px] font-bold text-white">
									View details
								</Text>
							</Pressable>
							<Pressable
								accessibilityRole="button"
								accessibilityLabel="Open directions"
								onPress={onOpenDirections}
								className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-violet-500 px-3 active:opacity-80 dark:bg-card-foreground"
							>
								<Navigation size={18} color="#8b5cf6" />
								<Text className="text-[15px] font-bold text-violet-600 dark:text-violet-400">
									Directions
								</Text>
							</Pressable>
						</View>
					</View>
				) : (
					<Text className="text-center text-gray-600 dark:text-gray-300">
						Choose an event on the map.
					</Text>
				)}
			</BottomSheetView>
		</BottomSheet>
	);
}
