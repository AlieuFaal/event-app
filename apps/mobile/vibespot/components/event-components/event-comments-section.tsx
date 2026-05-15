import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { SendHorizontal } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import type { EventComment } from "@/types/event";

type EventCommentsSectionProps = {
	comments: EventComment[];
	eventId: string;
};

function getInitials(name: string) {
	return name
		.split(" ")
		.map((namePart) => namePart[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function formatCommentDate(date: Date) {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export function EventCommentsSection({
	comments,
	eventId,
}: EventCommentsSectionProps) {
	const { colorScheme } = useColorScheme();
	const router = useRouter();
	const [content, setContent] = useState("");
	const isDark = colorScheme === "dark";
	const trimmedContent = content.trim();
	const sortedComments = useMemo(
		() =>
			[...comments].sort(
				(commentA, commentB) =>
					commentA.createdAt.getTime() - commentB.createdAt.getTime(),
			),
		[comments],
	);

	const commentMutation = useMutation({
		mutationFn: async (value: string) => {
			const res = await apiClient.events[":eventId"].comments.$post({
				param: { eventId },
				json: { content: value },
			});

			if (!res.ok) {
				const body = await res.json().catch(() => null);
				const message =
					body && "error" in body && typeof body.error === "string"
						? body.error
						: "Failed to post comment";
				throw new Error(message);
			}

			return res.json();
		},
		onSuccess: () => {
			setContent("");
			queryClient.invalidateQueries({ queryKey: ["event", eventId] });
		},
		onError: (error) => {
			Alert.alert("Comment failed", error.message);
		},
	});

	const handleSubmit = () => {
		if (!trimmedContent || commentMutation.isPending) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		commentMutation.mutate(trimmedContent);
	};

	const openUserProfile = (userId: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push({
			pathname: "/users/[id]",
			params: { id: userId },
		});
	};

	return (
		<View className="mt-8 border-gray-200 border-t pt-6 dark:border-gray-800">
			<View className="mb-4 flex-row items-center justify-between">
				<Text className="font-bold text-gray-900 text-xl dark:text-white">
					Comments
				</Text>
				<View className="rounded-full bg-purple-100 px-3 py-1 dark:bg-purple-900/30">
					<Text className="font-semibold text-purple-700 text-xs dark:text-purple-300">
						{comments.length}
					</Text>
				</View>
			</View>

			<View className="mb-5 flex-row items-end gap-3">
				<TextInput
					className="min-h-[48px] flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					editable={!commentMutation.isPending}
					multiline
					onChangeText={setContent}
					placeholder="Add a comment"
					placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
					value={content}
				/>
				<Button
					className={`h-12 w-12 rounded-full p-0 ${!trimmedContent ? "opacity-50" : ""}`}
					disabled={!trimmedContent || commentMutation.isPending}
					onPress={handleSubmit}
				>
					<SendHorizontal size={18} color="#ffffff" />
				</Button>
			</View>

			{sortedComments.length === 0 ? (
				<View className="rounded-2xl border border-gray-200 border-dashed bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
					<Text className="text-center font-medium text-gray-500 text-sm dark:text-gray-400">
						No comments yet.
					</Text>
				</View>
			) : (
				<View className="gap-3">
					{sortedComments.map((comment) => (
						<View
							className="flex-row gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/70"
							key={comment.id}
						>
							<Avatar
								alt={`${comment.user.name} profile image`}
								className="size-10"
							>
								<AvatarImage
									source={{ uri: comment.user.image ?? undefined }}
								/>
								<AvatarFallback className="bg-purple-600">
									<Text className="font-bold text-white text-xs">
										{getInitials(comment.user.name)}
									</Text>
								</AvatarFallback>
							</Avatar>

							<View className="min-w-0 flex-1">
								<View className="mb-1 flex-row items-center justify-between gap-3">
									<Pressable
										className="min-w-0 flex-1 active:opacity-70"
										onPress={() => openUserProfile(comment.user.id)}
									>
										<Text
											className="font-semibold text-gray-900 text-sm dark:text-white"
											numberOfLines={1}
										>
											{comment.user.name}
										</Text>
									</Pressable>
									<Text className="text-gray-500 text-xs dark:text-gray-400">
										{formatCommentDate(comment.createdAt)}
									</Text>
								</View>
								<Text className="text-gray-700 text-sm leading-5 dark:text-gray-300">
									{comment.content}
								</Text>
							</View>
						</View>
					))}
				</View>
			)}
		</View>
	);
}
