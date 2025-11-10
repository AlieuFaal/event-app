import { useQuery } from "@tanstack/react-query";
import { Event } from "../../../../packages/database/src/schema";
import { apiClient } from "@/lib/api-client";

export const useGetEventById = (id: string) => {
  const { isPending, error, data } = useQuery<Event, Error>({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await apiClient.events[":id"].$get({
        param: { id: id as string },
      });

      if (res.ok) {
        const data = await res.json();

        return {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          repeatEndDate: data.repeatEndDate
            ? new Date(data.repeatEndDate)
            : null,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        } as Event;
      } else {
        throw new Error("Failed to fetch event");
      }
    },
  });

  return { isPending, error, data };
};
