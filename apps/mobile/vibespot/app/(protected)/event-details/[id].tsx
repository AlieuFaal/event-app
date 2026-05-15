import { useMutation, useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
	ArrowLeft,
	Calendar,
	Check,
	Clock,
	MapPinHouse,
	Star,
	UserRound,
	UsersRound,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Image,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	PlaceholderImage1,
	PlaceholderImage2,
	PlaceholderImage3,
	PlaceholderImage4,
	PlaceholderImage5,
	PlaceholderImage6,
} from "@/assets";
import { getLocationLabel } from "@/components/event-components/all-events-utils";
import { EventCommentsSection } from "@/components/event-components/event-comments-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	useAddEventToCalendar,
	useIsEventAddedToCalendar,
} from "@/hooks/useAddEventToCalendar";
import { useEventAttendance } from "@/hooks/useEventAttendance";
import { useGetEventById } from "@/hooks/useGetEventById";
import { useGetUserById } from "@/hooks/useGetUserById";
import { useRemoveEventFromCalendar } from "@/hooks/useRemoveEventFromCalendar";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";

type FavoriteEventResponse = {
	event: {
		id: string;
	};
};

const getInitials = (name: string | undefined) =>
	name
		?.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toLocaleUpperCase() || "VS";

export default function EventDetails() {
	const params = useLocalSearchParams();
	const eventId = typeof params.id === "string" ? params.id : params.id?.[0];
	const [refreshing, setRefreshing] = useState(false);
	const router = useRouter();
	const session = authClient.useSession();

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await queryClient.invalidateQueries();
		setRefreshing(false);
	}, []);

	const { isPending, error, data } = useGetEventById(eventId);
	const { data: creator } = useGetUserById(data?.userId ?? undefined);
	const { toggleAttendance, isPending: isAttendancePending } =
		useEventAttendance(eventId);

	const addToCalendar = useAddEventToCalendar(data ?? null);
	const removeFromCalendar = useRemoveEventFromCalendar(data ?? null);

	const { data: isInCalendar = false, refetch: refetchCalendarStatus } =
		useIsEventAddedToCalendar(data ?? null);

	const handleAddToCalendar = useCallback(async () => {
		await addToCalendar();
		refetchCalendarStatus();
	}, [addToCalendar, refetchCalendarStatus]);

	const handleRemoveFromCalendar = useCallback(async () => {
		await removeFromCalendar();
		refetchCalendarStatus();
	}, [removeFromCalendar, refetchCalendarStatus]);

	function randomImage() {
		const images = [
			PlaceholderImage1,
			PlaceholderImage2,
			PlaceholderImage3,
			PlaceholderImage4,
			PlaceholderImage5,
			PlaceholderImage6,
		];
		return images[Math.floor(Math.random() * images.length)];
	}

	const mutation = useMutation({
		mutationFn: async (eventId: string) => {
			return apiClient.events.favorites[":eventId"].$post({
				param: { eventId },
			});
		},
		onSuccess: () => {
			console.log("Event saved or deleted successfully");
			queryClient.invalidateQueries({
				queryKey: ["favoriteEvent", eventId, session.data?.user?.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["favoriteEvents", session.data?.user?.id],
			});
		},
	});

	const { data: isFavorited = false } = useQuery({
		queryKey: ["favoriteEvent", eventId, session.data?.user?.id],
		queryFn: async () => {
			if (!session.data?.user?.id) return false;

			const res = await apiClient.events.favorites[":userid"].$get({
				param: { userid: session.data.user.id },
			});

			if (res.ok) {
				const events = (await res.json()) as FavoriteEventResponse[];
				return events.some((item) => item.event.id === eventId);
			}
			return false;
		},
		enabled: !!eventId && !!session.data?.user?.id,
	});

	const handleSaveEvent = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		console.log("Save Event pressed");

		if (eventId) {
			mutation.mutate(eventId);
		}
	}, [eventId, mutation]);

	const goBack = () => {
		Haptics.impactAsync();
		router.back();
	};

	const openCreatorProfile = () => {
		if (!data?.userId) {
			return;
		}

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push({
			pathname: "/users/[id]",
			params: { id: data.userId },
		});
	};

	const isEventPassed = data ? new Date(data.endDate) < new Date() : false;
	const goingLabel =
		data?.attendeeCount === 1 ? "1 going" : `${data?.attendeeCount ?? 0} going`;
	const creatorSubtitle =
		creator?.bio ||
		(creator
			? `${creator.followersCount} ${
					creator.followersCount === 1 ? "follower" : "followers"
				}`
			: "Creator profile");

	if (isPending) {
		return (
			<SafeAreaView
				className="flex-1 bg-white dark:bg-gray-900"
				edges={["top"]}
			>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#8b5cf6" />
					<Text className="mt-4 text-gray-600 dark:text-gray-300">
						Loading events...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!data) {
		return (
			<SafeAreaView
				className="flex-1 bg-white dark:bg-gray-900"
				edges={["top"]}
			>
				<View className="flex-1 items-center justify-center">
					<Text className="text-gray-600 dark:text-gray-300">
						Event not found
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView
				className="flex-1 bg-white dark:bg-gray-900"
				edges={["top"]}
			>
				<View className="flex-1 items-center justify-center">
					<Text className="text-red-500 dark:text-red-400">
						Error loading event: {(error as Error).message}
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["top"]}>
			<View className="flex-row items-center border-gray-200 border-b bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
				<Button
					hitSlop={8}
					onPress={goBack}
					pressRetentionOffset={{ top: 16, right: 16, bottom: 16, left: 16 }}
					className="mr-3 h-12 w-12 bg-transparent p-0 active:opacity-50 dark:bg-transparent dark:active:opacity-50"
				>
					<ArrowLeft size={24} color="#8b5cf6" />
				</Button>
				<Text className="flex-1 font-semibold text-gray-900 text-xl dark:text-white">
					Event Details
				</Text>
				<Pressable onPress={handleSaveEvent} className="active:scale-105">
					<Star
						fill={isFavorited ? "#FFFF00" : "transparent"}
						stroke={isFavorited ? "#FFFF00" : "#8b5cf6"}
					/>
				</Pressable>
			</View>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<Image
					source={data.imageUrl ? { uri: data.imageUrl } : randomImage()}
					className="aspect-auto h-64 w-full"
					resizeMode="cover"
				/>

				<View className="bg-white p-6 dark:bg-gray-900">
					<Text className="mb-2 font-bold text-3xl text-gray-900 dark:text-white">
						{data.title}
					</Text>

					<View className="mb-4 self-start rounded-full bg-purple-100 px-3 py-1 dark:bg-purple-900/30">
						<Text className="font-medium text-purple-700 dark:text-purple-400">
							{data.genre}
						</Text>
					</View>

					<View className="mb-3 flex-row items-center">
						<Calendar size={20} color="#8b5cf6" />
						<Text className="ml-2 text-gray-700 dark:text-gray-300">
							{new Date(data.startDate).toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</Text>
					</View>

					<View className="mb-3 flex-row items-center">
						<Clock size={20} color="#8b5cf6" />
						<Text className="ml-2 text-gray-700 dark:text-gray-300">
							{new Date(data.startDate).toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							})}{" "}
							-{" "}
							{new Date(data.endDate).toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					</View>

					<View className="mb-3 flex-row items-center">
						<MapPinHouse size={20} color="#8b5cf6" />
						<Text className="ml-2 text-gray-700 dark:text-gray-300">
							{getLocationLabel(data)}
						</Text>
					</View>

					<View className="mb-5 flex-row items-center">
						<UsersRound size={20} color="#8b5cf6" />
						<Text className="ml-2 text-gray-700 dark:text-gray-300">
							{goingLabel}
						</Text>
					</View>

					<Text className="mb-2 font-semibold text-gray-900 text-lg dark:text-white">
						About This Event
					</Text>
					<Text className="mb-6 text-gray-700 leading-6 dark:text-gray-300">
						{data.description || "No description available."}
					</Text>

					{data.userId ? (
						<Pressable
							onPress={openCreatorProfile}
							className="mb-6 rounded-3xl border border-purple-100 bg-purple-50/70 p-4 active:opacity-80 dark:border-purple-500/20 dark:bg-purple-950/30"
						>
							<View className="flex-row items-center gap-3">
								<Avatar
									className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-purple-600"
									alt="Creator profile image"
								>
									<AvatarImage source={{ uri: creator?.image || undefined }} />
									<AvatarFallback className="bg-purple-600">
										<Text className="font-bold text-white">
											{getInitials(creator?.name)}
										</Text>
									</AvatarFallback>
								</Avatar>

								<View className="flex-1">
									<Text className="font-semibold text-purple-600 text-xs uppercase tracking-wide dark:text-purple-300">
										Creator
									</Text>
									<Text className="mt-1 font-semibold text-base text-gray-900 dark:text-white">
										{creator?.name ?? "View creator profile"}
									</Text>
									<Text className="mt-1 text-gray-600 text-sm dark:text-gray-300">
										{creatorSubtitle}
									</Text>
								</View>

								<View className="h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900">
									<UserRound size={18} color="#8b5cf6" />
								</View>
							</View>
						</Pressable>
					) : null}

					<Button
						className={`mt-2 h-fit p-4 ${data.isGoing ? "border border-purple-600 bg-transparent dark:bg-card-foreground" : ""}`}
						disabled={isEventPassed || isAttendancePending}
						onPress={toggleAttendance}
					>
						<Text
							className={`font-semibold ${data.isGoing ? "text-purple-600 dark:text-purple-400" : "text-white"}`}
						>
							{data.isGoing ? "Going" : "Go"}
						</Text>
					</Button>

					<View className="mt-4 flex-row gap-3">
						{isInCalendar ? (
							<Button
								className="h-fit flex-1 gap-2 border border-primary p-4 dark:bg-card-foreground"
								onPress={handleRemoveFromCalendar}
							>
								<Check size={16} color="white" />
								<Text className="font-semibold text-white dark:text-purple-400">
									Added
								</Text>
							</Button>
						) : (
							<Button
								className="h-fit flex-1 p-4"
								onPress={handleAddToCalendar}
								disabled={isEventPassed}
							>
								<Text className="font-semibold text-white">
									Add To Calendar
								</Text>
							</Button>
						)}
						<Button
							variant="outline"
							className="h-fit border-purple-600 px-6 py-4 dark:border-purple-500 dark:bg-card-foreground"
							disabled={isEventPassed}
						>
							<Text className="font-semibold text-purple-600 dark:text-purple-400">
								Share
							</Text>
						</Button>
					</View>

					<EventCommentsSection
						comments={data.comments ?? []}
						eventId={data.id}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
