import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Alert } from "react-native";
import { queryClient } from "@/lib/query-client";
import { apiClient } from "@/lib/api-client";

export const useDeleteEvent = (eventId: string | undefined) => {
	const deleteEvent = useMutation({
		mutationFn: async (eventId: string) => {
			const res = await apiClient.events[":id"].$delete({
				param: { id: eventId },
			});
			if (!res.ok) throw new Error("Failed to delete event");
		},
		onSuccess: () => {
			console.log("Event deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.invalidateQueries({ queryKey: ["userEvents"] });
			Alert.alert("Event Deleted", "The event has been deleted successfully.");
		},
		onError: (error) => {
			console.error("Error deleting event:", error);
			Alert.alert(
				"Delete Failed",
				"Something went wrong while deleting your event. Please try again.",
			);
		},
	});

	const handleDeleteEvent = useCallback(() => {
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("Delete Event pressed");

		if (!eventId) return;

		Alert.alert(
			"Delete Event",
			"This will permanently remove this event. This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Continue",
					style: "destructive",
					onPress: () => {
						Alert.alert(
							"Delete forever?",
							"Please confirm one more time. This event will be permanently deleted.",
							[
								{ text: "Keep Event", style: "cancel" },
								{
									text: "Delete Forever",
									style: "destructive",
									onPress: () => deleteEvent.mutate(eventId),
								},
							],
						);
					},
				},
			],
		);
	}, [eventId, deleteEvent]);

	return handleDeleteEvent;
};
