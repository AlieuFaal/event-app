import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Event } from "../../../../packages/database/src/schema";

export const useEvent = () => {
  const { isPending, error, data } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await apiClient.events.$get();

      if (res.ok) {
        const data = await res.json();

        const events = data.map((event) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          repeatEndDate: event.repeatEndDate
            ? new Date(event.repeatEndDate)
            : null,
          createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
        })) as Event[];

        return events;
      } else {
        throw new Error("Failed to fetch events");
      }
    },
  });
  return { isPending, error, data };
};
