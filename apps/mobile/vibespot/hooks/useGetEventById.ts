import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { EventWithAttendance } from "@/types/event";

export const useGetEventById = (id: string | undefined) => {
  const { isPending, error, data } = useQuery<EventWithAttendance, Error>({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await apiClient.events[":id"].$get({
        param: { id: id ?? "" },
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
        } as EventWithAttendance;
      } else {
        throw new Error("Failed to fetch event");
      }
    },
    enabled: !!id,
  });

  return { isPending, error, data };
};
