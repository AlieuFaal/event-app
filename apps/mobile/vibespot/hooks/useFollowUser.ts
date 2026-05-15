import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";

type FollowAction = {
	userId: string;
	isFollowing: boolean;
};

export const useFollowUser = (userId: string | undefined) => {
	const followMutation = useMutation({
		mutationFn: async ({ userId, isFollowing }: FollowAction) => {
			const res = isFollowing
				? await apiClient.users[":id"].follow.$delete({
						param: { id: userId },
					})
				: await apiClient.users[":id"].follow.$post({
						param: { id: userId },
					});

			if (!res.ok) {
				const body = await res.json().catch(() => null);
				const message =
					body && "error" in body && typeof body.error === "string"
						? body.error
						: "Failed to update follow status";
				throw new Error(message);
			}

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user", userId] });
			queryClient.invalidateQueries({ queryKey: ["followers", userId] });
			queryClient.invalidateQueries({ queryKey: ["following"] });
		},
	});

	const toggleFollow = useCallback(
		(isFollowing: boolean) => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			if (userId) {
				followMutation.mutate({ userId, isFollowing });
			}
		},
		[followMutation, userId],
	);

	return {
		toggleFollow,
		isPending: followMutation.isPending,
		error: followMutation.error,
	};
};
