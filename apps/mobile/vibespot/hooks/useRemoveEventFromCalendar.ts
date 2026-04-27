import { useCallback } from "react";
import { Alert } from "react-native";
import * as Calendar from "expo-calendar";
import * as Haptics from "expo-haptics";
import { EventForCalendar } from "./useAddEventToCalendar";

export async function removeEventFromCalendar(
  event: EventForCalendar,
): Promise<void> {
  if (!event?.title || !event?.startDate || !event?.endDate) return;

  const defaultCalendar = await Calendar.getDefaultCalendarAsync();

  // Search a broad window: 1 day before/after to account for timezone drift
  const searchStart = new Date(event.startDate);
  searchStart.setDate(searchStart.getDate() - 1);
  const searchEnd = new Date(event.endDate);
  searchEnd.setDate(searchEnd.getDate() + 1);

  const allEvents = await Calendar.getEventsAsync(
    [defaultCalendar.id],
    searchStart,
    searchEnd,
  );

  const eventToDelete = allEvents.find(
    (existingEvent) =>
      existingEvent.title === event.title &&
      new Date(existingEvent.startDate).toDateString() ===
        new Date(event.startDate!).toDateString(),
  );

  if (!eventToDelete) {
    Alert.alert(
      "Not Found",
      "Could not find this event in your calendar. It may have already been removed.",
    );
    return;
  }

  await Calendar.deleteEventAsync(eventToDelete.id);
}

export function useRemoveEventFromCalendar(event: EventForCalendar) {
  const [status, requestCalendarPermission] = Calendar.useCalendarPermissions();

  const handleEventPermissions = useCallback(async (): Promise<boolean> => {
    if (status?.granted === true) return true;

    const result = await requestCalendarPermission();
    if (result.granted !== true) {
      Alert.alert(
        "Permission Required",
        "Calendar permission is required to manage events. Allow calendar access in your device settings.",
      );
      return false;
    }

    return true;
  }, [status?.granted, requestCalendarPermission]);

  const handleRemoveEventFromCalendar = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log("Remove from calendar pressed");

    const hasPermission = await handleEventPermissions();
    if (!hasPermission) return;

    try {
      await removeEventFromCalendar(event);
      Alert.alert("Removed", "The event has been removed from your calendar.");
    } catch (error) {
      console.error("Error removing calendar event:", error);
      Alert.alert(
        "Error",
        "Failed to remove event from calendar. Please try again.",
      );
    }
  }, [handleEventPermissions, event]);

  return handleRemoveEventFromCalendar;
}
