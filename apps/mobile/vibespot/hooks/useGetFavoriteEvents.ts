import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export function useGetFavoriteEvents() {
  const session = authClient.useSession();

  const { data, isPending, error } = useQuery({
    queryKey: ["favoriteEvents", session.data?.user?.id],
    queryFn: async () => {
      if (!session.data?.user?.id) return null;

      const res = await apiClient.events.favorites[":userid"].$get({
        param: { userid: session.data.user.id },
      });

      if (res.ok) {
        const events = await res.json();
        return events;
      }
      return null;
    },
    enabled: !!session.data?.user?.id,
  });

  return { data, isPending, error };
}
