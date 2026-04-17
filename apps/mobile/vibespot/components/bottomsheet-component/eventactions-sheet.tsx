import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import type { Event } from "@vibespot/database/schema";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
	CalendarIcon,
	Edit,
	Flag,
	Heart,
	LucideTrash2,
	MapPin,
	ReceiptText,
	Share,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { useAddEventToCalendar } from "@/hooks/useAddEventToCalendar";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";
import { useFavoriteEvent } from "@/hooks/useFavoriteEvent";
import { authClient } from "@/lib/auth-client";

interface EventDetailsSheetProps {
	selectedEvent: Event | null;
	bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
	snapPoints: string[];
}

export function EventActionsSheet({
	selectedEvent,
	bottomSheetRef,
	snapPoints,
}: EventDetailsSheetProps) {
	const router = useRouter();
	const session = authClient.useSession();
	const { colorScheme } = useColorScheme();
	const handleDeleteEvent = useDeleteEvent(selectedEvent?.id);
	const handleAddEventToCalendar = useAddEventToCalendar(selectedEvent);
	const { handleSaveEvent, isFavorited } = useFavoriteEvent(selectedEvent?.id);

	const handleSheetChange = useCallback((index: number) => {
		console.log("handleSheetChange", index);
	}, []);

	const handleClosePress = useCallback(() => {
		bottomSheetRef.current?.close();
	}, [bottomSheetRef]);

	const handleViewDetails = useCallback(() => {
		if (selectedEvent) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			router.push(`/event-details/${selectedEvent.id}`);
			console.log("Navigating to details for event ID:", selectedEvent.id);
			bottomSheetRef.current?.close();
		}
	}, [bottomSheetRef, router, selectedEvent]);

	const _handleEditEvent = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("Edit Event pressed");
	}, []);

	const handleViewOnMap = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("View On Map pressed");
		router.push(`/(protected)/(tabs)/map?eventId=${selectedEvent?.id}`);
	}, [router, selectedEvent?.id]);

	const handleShareEvent = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("Share Event pressed");
	}, []);

	return (
		<BottomSheet
			ref={bottomSheetRef}
			onChange={handleSheetChange}
			index={-1}
			snapPoints={snapPoints}
			enablePanDownToClose={true}
			onClose={handleClosePress}
			backgroundStyle={{
				backgroundColor: colorScheme === "dark" ? "#111827" : "#ffffff",
			}}
			handleIndicatorStyle={{
				backgroundColor: colorScheme === "dark" ? "#6b7280" : "#d1d5db",
			}}
		>
			<BottomSheetView className="flex-1 bg-white dark:bg-gray-900">
				<View className="items-center">
					<Text className="text-lg font-semibold mt-1 text-gray-900 dark:text-white">
						Event Actions
					</Text>
				</View>

				<View className="">
					<Pressable
						className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200"
						onPress={handleViewDetails}
					>
						<ReceiptText size={24} className="text-gray-900 dark:text-white" />
						<Text className="text-center p-5 text-gray-900 dark:text-white">
							View Details
						</Text>
					</Pressable>

					<Pressable
						className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200"
						onPress={handleSaveEvent}
					>
						<Heart
							size={24}
							fill={isFavorited ? "#C51104" : "none"}
							className="text-gray-900 dark:text-white"
						/>
						<Text className="text-center p-5 text-gray-900 dark:text-white">
							Save Event
						</Text>
					</Pressable>

					<Pressable
						className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200"
						onPress={handleAddEventToCalendar}
					>
						<CalendarIcon size={24} className="text-gray-900 dark:text-white" />
						<Text className="text-center p-5 text-gray-900 dark:text-white">
							Add To Calendar
						</Text>
					</Pressable>

					<Pressable
						className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200"
						onPress={handleViewOnMap}
					>
						<MapPin size={24} className="text-gray-900 dark:text-white" />
						<Text className="text-center p-5 text-gray-900 dark:text-white">
							View On Map
						</Text>
					</Pressable>

					<Pressable
						className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200"
						onPress={handleShareEvent}
					>
						<Share size={24} className="text-gray-900 dark:text-white" />
						<Text className="text-center p-5 text-gray-900 dark:text-white">
							Share Event
						</Text>
					</Pressable>

					{selectedEvent?.userId === session.data?.user?.id && (
						<Pressable
							className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200"
							onPress={() =>
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
							}
						>
							<Edit size={24} className="text-gray-900 dark:text-white" />
							<Text className="text-center p-5 text-gray-900 dark:text-white">
								Edit Event
							</Text>
						</Pressable>
					)}

					{selectedEvent?.userId === session.data?.user?.id && (
						<Pressable
							className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200"
							onPress={() => {
								handleDeleteEvent();
								bottomSheetRef.current?.close();
							}}
						>
							<LucideTrash2 size={24} fillOpacity={80} />
							<Text className="text-center p-5 text-red-500 dark:text-red-400">
								Delete Event
							</Text>
						</Pressable>
					)}

					{selectedEvent?.userId !== session.data?.user?.id && (
						<Pressable
							className="flex-row border justify-center items-center bg-primary/70 rounded-sm w-11/12 mx-auto active:scale-110 mt-5 transition-all duration-200 mb-5"
							onPress={() =>
								Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
							}
						>
							<Flag size={24} fill={"red"} fillOpacity={80} />
							<Text className="text-center text-red-500 dark:text-red-400 p-5">
								Report Event
							</Text>
						</Pressable>
					)}
				</View>
			</BottomSheetView>
		</BottomSheet>
	);
}
