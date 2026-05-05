import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

type FollowerUser = {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
};

export const useGetFollowers = (userId: string) => {
  return useQuery<FollowerUser[]>({
    queryKey: ["followers", userId],
    queryFn: async () => {
      const res = await apiClient.users[":id"].followers.$get({
        param: { id: userId },
      });

      if (!res.ok) throw new Error("Failed to fetch followers");

      return res.json();
    },
    enabled: !!userId,
  });
};
