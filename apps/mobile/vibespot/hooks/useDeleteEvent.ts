import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Alert } from "react-native";
import { queryClient } from "@/app/_layout";
import { apiClient } from "@/lib/api-client";

export const useDeleteEvent = (eventId: string | undefined) => {
	const deleteEvent = useMutation({
		mutationFn: async (eventId: string) => {
			return apiClient.events[":id"].$delete({ param: { id: eventId } });
		},
		onSuccess: () => {
			console.log("Event deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
		onError: (error) => {
			console.error("Error deleting event:", error);
		},
	});

	const handleDeleteEvent = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("Delete Event pressed");

		if (eventId) {
			deleteEvent.mutate(eventId);
			Alert.alert("Event Deleted", "The event has been deleted successfully.");
		}
	}, [eventId, deleteEvent]);

	return handleDeleteEvent;
};
