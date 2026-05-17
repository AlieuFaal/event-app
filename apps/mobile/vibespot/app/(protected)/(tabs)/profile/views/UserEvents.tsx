import { useMutation } from "@tanstack/react-query";
import type { Event } from "@vibespot/database/schema";
import { useRouter } from "expo-router";
import { CalendarDays, Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	RefreshControl,
	SectionList,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserEventCard } from "@/components/event-components/UserEventCard";
import { useGetUserEvents } from "@/hooks/useGetUserEvents";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";

// ─── Section header ────────────────────────────────────────────────────────────

type SectionHeaderProps = {
	title: string;
	count: number;
	isDark: boolean;
	accentColor: string;
};

function SectionHeader({
	title,
	count,
	isDark,
	accentColor,
}: SectionHeaderProps) {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				paddingHorizontal: 16,
				paddingTop: 20,
				paddingBottom: 10,
			}}
		>
			<View
				style={{
					width: 3,
					height: 16,
					borderRadius: 2,
					backgroundColor: accentColor,
					marginRight: 10,
				}}
			/>
			<Text
				style={{
					fontSize: 13,
					fontWeight: "700",
					letterSpacing: 0.8,
					textTransform: "uppercase",
					color: isDark ? "#e5e7eb" : "#374151",
					flex: 1,
				}}
			>
				{title}
			</Text>
			<View
				style={{
					backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
					borderRadius: 999,
					paddingHorizontal: 9,
					paddingVertical: 3,
				}}
			>
				<Text
					style={{
						fontSize: 12,
						fontWeight: "700",
						color: isDark ? "#9ca3af" : "#6b7280",
					}}
				>
					{count}
				</Text>
			</View>
		</View>
	);
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({
	isDark,
	onCreatePress,
}: {
	isDark: boolean;
	onCreatePress: () => void;
}) {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				paddingHorizontal: 32,
			}}
		>
			<View
				style={{
					width: 80,
					height: 80,
					borderRadius: 40,
					backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 20,
				}}
			>
				<CalendarDays
					size={36}
					color={isDark ? "#4b5563" : "#d1d5db"}
					strokeWidth={1.5}
				/>
			</View>

			<Text
				style={{
					fontSize: 18,
					fontWeight: "700",
					color: isDark ? "#f9fafb" : "#111827",
					marginBottom: 8,
					textAlign: "center",
				}}
			>
				No events yet
			</Text>

			<Text
				style={{
					fontSize: 14,
					color: isDark ? "#6b7280" : "#9ca3af",
					textAlign: "center",
					lineHeight: 20,
					marginBottom: 28,
				}}
			>
				Events you create will appear here. Tap the button below to get started.
			</Text>

			<Pressable
				onPress={onCreatePress}
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: 8,
					backgroundColor: "#8b5cf6",
					borderRadius: 12,
					paddingHorizontal: 20,
					paddingVertical: 12,
				}}
				className="active:opacity-80"
			>
				<Plus size={18} color="#ffffff" strokeWidth={2.5} />
				<Text style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
					Create an Event
				</Text>
			</Pressable>
		</View>
	);
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

type StatsBarProps = {
	upcoming: number;
	past: number;
	isDark: boolean;
};

function StatsBar({ upcoming, past, isDark }: StatsBarProps) {
	const total = upcoming + past;

	if (total === 0) return null;

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: 4,
				paddingHorizontal: 16,
				paddingTop: 4,
				paddingBottom: 2,
			}}
		>
			<Text
				style={{
					fontSize: 13,
					color: isDark ? "#6b7280" : "#9ca3af",
				}}
			>
				{total} {total === 1 ? "event" : "events"}
			</Text>

			{upcoming > 0 && past > 0 && (
				<>
					<Text style={{ fontSize: 13, color: isDark ? "#374151" : "#d1d5db" }}>
						·
					</Text>
					<Text style={{ fontSize: 13, color: "#8b5cf6", fontWeight: "600" }}>
						{upcoming} upcoming
					</Text>
					<Text style={{ fontSize: 13, color: isDark ? "#374151" : "#d1d5db" }}>
						·
					</Text>
					<Text style={{ fontSize: 13, color: isDark ? "#6b7280" : "#9ca3af" }}>
						{past} past
					</Text>
				</>
			)}

			{upcoming > 0 && past === 0 && (
				<>
					<Text style={{ fontSize: 13, color: isDark ? "#374151" : "#d1d5db" }}>
						·
					</Text>
					<Text style={{ fontSize: 13, color: "#8b5cf6", fontWeight: "600" }}>
						all upcoming
					</Text>
				</>
			)}

			{past > 0 && upcoming === 0 && (
				<>
					<Text style={{ fontSize: 13, color: isDark ? "#374151" : "#d1d5db" }}>
						·
					</Text>
					<Text style={{ fontSize: 13, color: isDark ? "#6b7280" : "#9ca3af" }}>
						all past
					</Text>
				</>
			)}
		</View>
	);
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type Section = {
	title: string;
	isPast: boolean;
	accentColor: string;
	data: Event[];
};

export default function UserEvents() {
	const router = useRouter();
	const {
		handleMomentumScrollBegin,
		handleMomentumScrollEnd,
		handleScroll,
		handleScrollEnd,
	} = useTabBarScrollVisibility();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const { data: session } = authClient.useSession();
	const canCreateEvents =
		session?.user.role === "artist" || session?.user.role === "admin";

	const [refreshing, setRefreshing] = useState(false);

	const { data: events, isPending, error, refetch } = useGetUserEvents();

	// ─── Delete mutation ───────────────────────────────────────────────────────
	// Intentionally NOT using the useDeleteEvent hook — that hook fires Alert
	// before the mutation resolves, showing success even on failure.

	const deleteMutation = useMutation({
		mutationFn: async (eventId: string) => {
			const res = await apiClient.events[":id"].$delete({
				param: { id: eventId },
			});
			if (!res.ok) throw new Error("Failed to delete event");
		},
		onSuccess: () => {
			// Invalidate both caches — the user's list and the global feed.
			queryClient.invalidateQueries({ queryKey: ["userEvents"] });
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
		onError: () => {
			Alert.alert(
				"Delete Failed",
				"Something went wrong while deleting your event. Please try again.",
				[{ text: "OK" }],
			);
		},
	});

	const handleDeleteRequest = useCallback(
		(eventId: string) => {
			Alert.alert(
				"Delete Event",
				"This will permanently remove this event. This action cannot be undone.",
				[
					{ text: "Cancel", style: "cancel" },
					{
						text: "Continue",
						style: "destructive",
						onPress: () => {
							Alert.alert(
								"Delete forever?",
								"Please confirm one more time. This event will be permanently deleted.",
								[
									{ text: "Keep Event", style: "cancel" },
									{
										text: "Delete Forever",
										style: "destructive",
										onPress: () => deleteMutation.mutate(eventId),
									},
								],
							);
						},
					},
				],
			);
		},
		[deleteMutation],
	);

	// ─── Refresh ───────────────────────────────────────────────────────────────

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	}, [refetch]);

	// ─── Section data ──────────────────────────────────────────────────────────

	const now = new Date();

	const upcoming: Event[] = events
		? events.filter((e) => new Date(e.endDate) >= now)
		: [];

	// Most recent past events first.
	const past: Event[] = events
		? events.filter((e) => new Date(e.endDate) < now).reverse()
		: [];

	const sections: Section[] = [
		...(upcoming.length > 0
			? [
					{
						title: "Upcoming",
						isPast: false,
						accentColor: "#8b5cf6",
						data: upcoming,
					},
				]
			: []),
		...(past.length > 0
			? [
					{
						title: "Past",
						isPast: true,
						accentColor: isDark ? "#4b5563" : "#9ca3af",
						data: past,
					},
				]
			: []),
	];

	// ─── Loading ───────────────────────────────────────────────────────────────

	if (isPending) {
		return (
			<SafeAreaView
				style={{ flex: 1 }}
				className="bg-transparent"
				edges={["top"]}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						paddingHorizontal: 16,
						paddingVertical: 14,
						borderBottomWidth: 1,
						borderBottomColor: isDark ? "#1f2937" : "#f3f4f6",
					}}
				>
					<Text
						style={{
							fontSize: 22,
							fontWeight: "800",
							color: isDark ? "#f9fafb" : "#111827",
							letterSpacing: -0.5,
						}}
					>
						My Events
					</Text>
				</View>
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
				>
					<ActivityIndicator size="large" color="#8b5cf6" />
					<Text
						style={{
							marginTop: 12,
							fontSize: 14,
							color: isDark ? "#6b7280" : "#9ca3af",
						}}
					>
						Loading your events...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	// ─── Error ─────────────────────────────────────────────────────────────────

	if (error) {
		return (
			<SafeAreaView
				style={{ flex: 1 }}
				className="bg-transparent"
				edges={["top"]}
			>
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						padding: 32,
					}}
				>
					<Text
						style={{
							fontSize: 15,
							color: "#ef4444",
							textAlign: "center",
							lineHeight: 22,
						}}
					>
						{(error as Error).message ??
							"Something went wrong loading your events."}
					</Text>
					<Pressable
						onPress={() => refetch()}
						style={{
							marginTop: 16,
							paddingHorizontal: 20,
							paddingVertical: 10,
							borderRadius: 10,
							backgroundColor: "#8b5cf6",
						}}
					>
						<Text style={{ color: "#ffffff", fontWeight: "700" }}>
							Try Again
						</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	}

	// ─── Render ────────────────────────────────────────────────────────────────

	return (
		<SafeAreaView
			style={{ flex: 1 }}
			className="bg-transparent"
			edges={["top"]}
		>
			{/* Header */}
			<View
				style={{
					paddingHorizontal: 16,
					paddingTop: 14,
					paddingBottom: 6,
					borderBottomWidth: 1,
					borderBottomColor: isDark ? "#1f2937" : "#f3f4f6",
				}}
			>
				<Text
					style={{
						fontSize: 22,
						fontWeight: "800",
						color: isDark ? "#f9fafb" : "#111827",
						letterSpacing: -0.5,
						marginBottom: 2,
					}}
				>
					My Events
				</Text>

				<StatsBar
					upcoming={upcoming.length}
					past={past.length}
					isDark={isDark}
				/>
			</View>

			{/* Empty state */}
			{sections.length === 0 ? (
				<EmptyState
					isDark={isDark}
					onCreatePress={() => {
						if (!canCreateEvents) {
							Alert.alert(
								"Artist mode required",
								"Switch to Artist mode in Settings to create events.",
							);
							return;
						}

						router.navigate("/(protected)/(tabs)/create-event");
					}}
				/>
			) : (
				<SectionList<Event, Section>
					sections={sections}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingTop: 4, paddingBottom: 32 }}
					showsVerticalScrollIndicator={false}
					onMomentumScrollBegin={handleMomentumScrollBegin}
					onMomentumScrollEnd={handleMomentumScrollEnd}
					onScroll={handleScroll}
					onScrollEndDrag={handleScrollEnd}
					scrollEventThrottle={16}
					stickySectionHeadersEnabled={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor="#8b5cf6"
							colors={["#8b5cf6"]}
						/>
					}
					renderSectionHeader={({ section }) => (
						<SectionHeader
							title={section.title}
							count={section.data.length}
							isDark={isDark}
							accentColor={section.accentColor}
						/>
					)}
					renderItem={({ item, section }) => (
						<UserEventCard
							event={item}
							isPast={section.isPast}
							isDark={isDark}
							onDelete={handleDeleteRequest}
						/>
					)}
					// Subtle separator between cards in the same section.
					ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
				/>
			)}
		</SafeAreaView>
	);
}
