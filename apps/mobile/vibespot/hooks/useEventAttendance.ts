import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { queryClient } from "@/app/_layout";
import { apiClient } from "@/lib/api-client";

export function useEventAttendance(eventId: string | undefined) {
  const attendanceMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await apiClient.events[":eventId"].attendance.$post({
        param: { eventId },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body && "error" in body && typeof body.error === "string"
            ? body.error
            : "Failed to update attendance";
        throw new Error(message);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["eventAttendance", eventId] });
    },
    onError: (error) => {
      console.error("Error updating event attendance:", error);
    },
  });

  const toggleAttendance = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (eventId) {
      attendanceMutation.mutate(eventId);
    }
  }, [attendanceMutation, eventId]);

  return {
    toggleAttendance,
    isPending: attendanceMutation.isPending,
  };
}
