import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
	CalendarIcon,
	Check,
	ChevronRight,
	Edit,
	Flag,
	Heart,
	LucideTrash2,
	MapPin,
	ReceiptText,
	Share,
	UsersRound,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useCallback } from "react";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { getLocationLabel } from "@/components/event-components/all-events-utils";
import { useAddEventToCalendar } from "@/hooks/useAddEventToCalendar";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { useEventAttendance } from "@/hooks/useEventAttendance";
import { useFavoriteEvent } from "@/hooks/useFavoriteEvent";
import { authClient } from "@/lib/auth-client";
import { useTabBarVisibility } from "@/lib/tab-bar-visibility";
import type { EventWithAttendance } from "@/types/event";

interface EventDetailsSheetProps {
	selectedEvent: EventWithAttendance | null;
	bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
}

interface ActionRowProps {
	icon: ReactNode;
	label: string;
	onPress: () => void;
	disabled?: boolean;
	destructive?: boolean;
	rightLabel?: string;
	rightIcon?: ReactNode;
}

function formatEventDate(event: EventWithAttendance | null) {
	if (!event) return "";

	return new Date(event.startDate).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}

function formatAttendeeCount(count: number | undefined) {
	return count === 1 ? "1 going" : `${count ?? 0} going`;
}

function ActionRow({
	icon,
	label,
	onPress,
	disabled = false,
	destructive = false,
	rightLabel,
	rightIcon,
}: ActionRowProps) {
	return (
		<Pressable
			disabled={disabled}
			onPress={onPress}
			className={`h-[48px] flex-row items-center rounded-2xl px-1 active:opacity-70 ${disabled ? "opacity-40" : ""}`}
		>
			<View className="h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
				{icon}
			</View>
			<Text
				className={`ml-3 flex-1 text-[15px] font-semibold ${destructive ? "text-red-500 dark:text-red-400" : "text-gray-900 dark:text-[#f3eef8]"}`}
				numberOfLines={1}
			>
				{label}
			</Text>
			{rightLabel ? (
				<Text className="mr-2 text-[13px] text-gray-500 dark:text-[#91819f]">
					{rightLabel}
				</Text>
			) : null}
			{rightIcon}
		</Pressable>
	);
}

export function EventActionsSheet({
	selectedEvent,
	bottomSheetRef,
}: EventDetailsSheetProps) {
	const router = useRouter();
	const session = authClient.useSession();
	const { colorScheme } = useColorScheme();
	const { setTabBarHidden } = useTabBarVisibility();
	const isDark = colorScheme === "dark";
	const handleDeleteEvent = useDeleteEvent(selectedEvent?.id);
	const handleAddEventToCalendar = useAddEventToCalendar(selectedEvent);
	const { handleSaveEvent, isFavorited } = useFavoriteEvent(selectedEvent?.id);
	const { toggleAttendance, isPending: isAttendancePending } =
		useEventAttendance(selectedEvent?.id);
	const isOwner = selectedEvent?.userId === session.data?.user?.id;
	const isPastEvent = selectedEvent
		? new Date(selectedEvent.endDate) < new Date()
		: false;
	const mutedIconColor = isDark ? "#a092ad" : "#6b7280";
	const primaryIconColor = "#ffffff";
	const dangerColor = isDark ? "#f87171" : "#ef4444";
	const attendeeLabel = formatAttendeeCount(selectedEvent?.attendeeCount);
	const subtitle = selectedEvent
		? `${formatEventDate(selectedEvent)} · ${getLocationLabel(selectedEvent)}`
		: "Choose an action";

	const closeSheet = useCallback(() => {
		bottomSheetRef.current?.close();
	}, [bottomSheetRef]);

	const handleSheetChange = useCallback(
		(index: number) => {
			if (index >= 0) {
				setTabBarHidden(true);
			}
		},
		[setTabBarHidden],
	);

	const handleSheetClose = useCallback(() => {
		setTabBarHidden(false);
	}, [setTabBarHidden]);

	const handleViewDetails = useCallback(() => {
		if (selectedEvent) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			router.push(`/event-details/${selectedEvent.id}`);
			closeSheet();
		}
	}, [closeSheet, router, selectedEvent]);

	const handleSavePress = useCallback(() => {
		handleSaveEvent();
		closeSheet();
	}, [closeSheet, handleSaveEvent]);

	const handleAttendancePress = useCallback(() => {
		toggleAttendance();
		closeSheet();
	}, [closeSheet, toggleAttendance]);

	const handleAddToCalendarPress = useCallback(async () => {
		await handleAddEventToCalendar();
		closeSheet();
	}, [closeSheet, handleAddEventToCalendar]);

	const handleViewOnMap = useCallback(() => {
		if (!selectedEvent) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push(`/(protected)/(tabs)/map?eventId=${selectedEvent.id}`);
		closeSheet();
	}, [closeSheet, router, selectedEvent]);

	const handleShareEvent = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("Share Event pressed");
		closeSheet();
	}, [closeSheet]);

	const handleEditEvent = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("Edit Event pressed");
		closeSheet();
	}, [closeSheet]);

	const handleDeletePress = useCallback(() => {
		handleDeleteEvent();
		closeSheet();
	}, [closeSheet, handleDeleteEvent]);

	const handleReportPress = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("Report Event pressed");
		closeSheet();
	}, [closeSheet]);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={-1}
			onChange={handleSheetChange}
			onClose={handleSheetClose}
			enableDynamicSizing={true}
			enablePanDownToClose={true}
			maxDynamicContentSize={520}
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
				<View className="pb-4 pt-1">
					<Text
						className="text-[20px] font-bold text-gray-950 dark:text-[#f8f4ff]"
						numberOfLines={1}
					>
						{selectedEvent?.title ?? "Event Actions"}
					</Text>
					<Text
						className="mt-1 text-[13px] text-gray-500 dark:text-[#9687a4]"
						numberOfLines={1}
					>
						{subtitle}
					</Text>
				</View>

				<Pressable
					className={`mb-3 min-h-[56px] flex-row items-center rounded-2xl border border-violet-200 bg-violet-50 px-3 active:opacity-80 dark:border-[#4c2f75] dark:bg-[#1d1430] ${isPastEvent ? "opacity-50" : ""}`}
					disabled={isPastEvent || isAttendancePending}
					onPress={handleAttendancePress}
				>
					<View className="h-8 w-8 items-center justify-center rounded-full bg-violet-500">
						{selectedEvent?.isGoing ? (
							<Check size={18} color={primaryIconColor} strokeWidth={2.6} />
						) : (
							<UsersRound size={17} color={primaryIconColor} strokeWidth={2.4} />
						)}
					</View>
					<Text
						className="ml-3 flex-1 text-[15px] font-bold text-gray-950 dark:text-[#f3eef8]"
						numberOfLines={1}
					>
						{isPastEvent
							? "Event ended"
							: selectedEvent?.isGoing
								? "Going"
								: "Go"}
					</Text>
					<Text className="text-[13px] font-medium text-gray-500 dark:text-[#91819f]">
						{attendeeLabel}
					</Text>
				</Pressable>

				<View className="mb-2 h-px bg-gray-200 dark:bg-[#253044]" />

				<ActionRow
					icon={<ReceiptText size={18} color={mutedIconColor} />}
					label="View details"
					onPress={handleViewDetails}
					rightIcon={<ChevronRight size={18} color={mutedIconColor} />}
				/>
				<ActionRow
					icon={
						<Heart
							size={18}
							color={isFavorited ? "#ef4444" : mutedIconColor}
							fill={isFavorited ? "#ef4444" : "none"}
						/>
					}
					label={isFavorited ? "Saved" : "Save event"}
					onPress={handleSavePress}
				/>
				<ActionRow
					icon={<CalendarIcon size={18} color={mutedIconColor} />}
					label="Add to calendar"
					onPress={handleAddToCalendarPress}
				/>
				<ActionRow
					icon={<MapPin size={18} color={mutedIconColor} />}
					label="View on map"
					onPress={handleViewOnMap}
				/>
				<ActionRow
					icon={<Share size={18} color={mutedIconColor} />}
					label="Share"
					onPress={handleShareEvent}
				/>

				<View className="my-2 h-px bg-gray-200 dark:bg-[#253044]" />

				{isOwner ? (
					<>
						<ActionRow
							icon={<Edit size={18} color={mutedIconColor} />}
							label="Edit event"
							onPress={handleEditEvent}
						/>
						<ActionRow
							icon={<LucideTrash2 size={18} color={dangerColor} />}
							label="Delete event"
							onPress={handleDeletePress}
							destructive
						/>
					</>
				) : (
					<ActionRow
						icon={<Flag size={18} color={dangerColor} />}
						label="Report event"
						onPress={handleReportPress}
						destructive
					/>
				)}
			</BottomSheetView>
		</BottomSheet>
	);
}
