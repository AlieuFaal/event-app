import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

type FollowingUser = {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
};

export const useGetFollowing = (userId: string) => {
  return useQuery<FollowingUser[]>({
    queryKey: ["following", userId],
    queryFn: async () => {
      const res = await apiClient.users[":id"].following.$get({
        param: { id: userId },
      });

      if (!res.ok) throw new Error("Failed to fetch following");

      return res.json();
    },
    enabled: !!userId,
  });
};
