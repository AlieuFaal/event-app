import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type PublicUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	phone: string | null;
	image: string | null;
	location: string | null;
	bio: string | null;
	createdAt: string;
	updatedAt: string;
	role: string;
	followersCount: number;
	followingCount: number;
	eventsCount: number;
	isFollowing: boolean;
};

export const useGetUserById = (id: string | undefined) => {
	return useQuery<PublicUser>({
		queryKey: ["user", id],
		queryFn: async () => {
			if (!id) {
				throw new Error("Missing user id");
			}

			const res = await apiClient.users[":id"].$get({
				param: { id },
			});

			if (!res.ok) {
				throw new Error("Failed to fetch user");
			}

			return res.json();
		},
		enabled: !!id,
	});
};
