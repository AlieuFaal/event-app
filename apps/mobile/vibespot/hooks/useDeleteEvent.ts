import { queryClient } from "@/app/_layout";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export const useDeleteEvent = () => {
  return useMutation({
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
};
