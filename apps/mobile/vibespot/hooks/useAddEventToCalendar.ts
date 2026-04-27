import { useCallback } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as Calendar from "expo-calendar";
import { useQuery } from "@tanstack/react-query";

export type EventForCalendar = {
  id: string;
  title?: string | null;
  description?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  address?: string | null;
  createdAt?: Date | string | null;
} | null;

export async function isEventAddedToCalendar(
  event: EventForCalendar,
): Promise<boolean> {
  if (!event?.title || !event?.startDate || !event?.endDate) return false;

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

  return allEvents.some(
    (existingEvent) =>
      existingEvent.title === event.title &&
      new Date(existingEvent.startDate).toDateString() ===
        new Date(event.startDate!).toDateString(),
  );
}

/**
 * Reactive hook that returns whether the given event has already been added
 * to the device calendar. Only runs when calendar permission has been granted.
 */
export function useIsEventAddedToCalendar(event: EventForCalendar) {
  const [status] = Calendar.useCalendarPermissions();

  return useQuery({
    queryKey: ["isEventInCalendar", event?.id],
    queryFn: () => isEventAddedToCalendar(event),
    // Don't even attempt this if we don't have permission or an event to check
    enabled: !!event?.id && status?.granted === true,
  });
}

export function useAddEventToCalendar(selectedEvent: EventForCalendar) {
  const [status, requestCalendarPermission] = Calendar.useCalendarPermissions();

  const handleEventPermissions = useCallback(async () => {
    if (status?.granted !== true) {
      const newPermissionRequest = await requestCalendarPermission();
      if (newPermissionRequest.granted !== true) {
        console.log("Calendar permission not granted");
        Alert.alert(
          "Permission Required",
          "Calendar permission is required to add events to your calendar. Allow calendar access in your device settings.",
        );
        return false;
      }
    }
    console.log("Calendar permission granted");
    return true;
  }, [status?.granted, requestCalendarPermission]);

  const handleCalendarEventCreation = useCallback(async () => {
    try {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      if (defaultCalendar) {
        const eventDetails = {
          title: selectedEvent?.title || "Vibespot Event",
          notes: selectedEvent?.description || "",
          startDate: selectedEvent?.startDate
            ? new Date(selectedEvent.startDate)
            : new Date(),
          endDate: selectedEvent?.endDate
            ? new Date(selectedEvent.endDate)
            : new Date(new Date().getTime() + 60 * 60 * 1000),
          timeZone: defaultCalendar.timeZone,
          location: selectedEvent?.address || "",
          creationDate: selectedEvent?.createdAt
            ? new Date(selectedEvent.createdAt)
            : new Date(),
        };

        const eventId = await Calendar.createEventAsync(
          defaultCalendar.id,
          eventDetails,
        );
        console.log("Calendar event created with ID:", eventId);
        Alert.alert(
          "Event Added!",
          "The event has been added to your calendar.",
        );
      }
    } catch (error) {
      console.error("Error creating calendar event:", error);
      Alert.alert(
        "Error",
        "Failed to add event to calendar. Please try again.",
      );
    }
  }, [selectedEvent]);

  const handleAddEventToCalendar = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log("Add To Calendar pressed");

    const hasPermission = await handleEventPermissions();
    if (hasPermission) {
      await handleCalendarEventCreation();
    }
  }, [handleEventPermissions, handleCalendarEventCreation]);

  return handleAddEventToCalendar;
}
