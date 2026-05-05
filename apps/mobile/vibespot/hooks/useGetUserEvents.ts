import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@vibespot/database/schema";

export const useGetUserEvents = () => {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  return useQuery<Event[]>({
    queryKey: ["userEvents", userId],
    queryFn: async () => {
      const res = await apiClient.events.my.$get();

      if (!res.ok) throw new Error("Failed to fetch your events");

      const data = await res.json();
      return data.map((event) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        repeatEndDate: event.repeatEndDate
          ? new Date(event.repeatEndDate)
          : null,
        createdAt: event.createdAt ? new Date(event.createdAt) : undefined,
      })) as Event[];
    },
    enabled: !!userId,
  });
};
