import { useEffect, useState } from "react";
import { useColorScheme, useWindowDimensions, View } from "react-native";
import Animated from "react-native-reanimated";
import {
	isEventLive,
	isWithinThisWeek,
} from "@/components/event-components/all-events-utils";
import { GenresSection } from "./genres-section";
import { HomeHero } from "./home-hero";
import { HomeStatsRow } from "./home-stats-row";
import { getFirstName, isSameDay } from "./home-utils";
import { LiveEventsSection } from "./live-events-section";
import { TodaySummaryCard } from "./today-summary-card";
import type { HomeContentProps } from "./types";
import { UpcomingEventsSection } from "./upcoming-events-section";
import { WeekRail } from "./week-rail";

const AnimatedScrollView = Animated.ScrollView;

export function HomeContent({
	events,
	onActionsPress,
	onMomentumScrollBegin,
	onMomentumScrollEnd,
	onScroll,
	onScrollEnd,
	userName,
}: HomeContentProps) {
	const isDark = useColorScheme() === "dark";
	const { width } = useWindowDimensions();
	const [now, setNow] = useState(() => new Date());
	const firstName = getFirstName(userName);
	const cardWidth = Math.min(width - 40, 420);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setNow(new Date());
		}, 60000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const sortedEvents = [...events].sort(
		(eventA, eventB) =>
			new Date(eventA.startDate).getTime() -
			new Date(eventB.startDate).getTime(),
	);
	const liveEvents = sortedEvents.filter((event) => isEventLive(event, now));
	const upcomingEvents = sortedEvents.filter(
		(event) => new Date(event.startDate) > now,
	);
	const activeEvents = sortedEvents.filter(
		(event) => new Date(event.endDate) >= now,
	);
	const thisWeekCount = sortedEvents.filter((event) =>
		isWithinThisWeek(new Date(event.startDate), now),
	).length;
	const todayCount = activeEvents.filter((event) =>
		isSameDay(new Date(event.startDate), now),
	).length;
	const goingCount = events.filter((event) => event.isGoing).length;
	const genreFilters = Array.from(
		new Set(activeEvents.map((event) => event.genre)),
	)
		.sort((genreA, genreB) => genreA.localeCompare(genreB))
		.slice(0, 8);

	return (
		<AnimatedScrollView
			contentContainerStyle={{ gap: 32, paddingTop: 10 }}
			contentInsetAdjustmentBehavior="automatic"
			onMomentumScrollBegin={onMomentumScrollBegin}
			onMomentumScrollEnd={onMomentumScrollEnd}
			onScroll={onScroll}
			onScrollEndDrag={onScrollEnd}
			scrollEventThrottle={16}
			showsVerticalScrollIndicator={false}
		>
			<View className="gap-5 px-5">
				<HomeHero firstName={firstName} isDark={isDark} now={now} />
				<HomeStatsRow
					goingCount={goingCount}
					isDark={isDark}
					liveCount={liveEvents.length}
					thisWeekCount={thisWeekCount}
				/>
			</View>

			<WeekRail
				eventDates={activeEvents.map((event) => new Date(event.startDate))}
				isDark={isDark}
				now={now}
			/>

			<LiveEventsSection
				cardWidth={cardWidth}
				isDark={isDark}
				liveEvents={liveEvents}
				now={now}
				onActionsPress={onActionsPress}
				upcomingEvents={upcomingEvents}
			/>
			<UpcomingEventsSection
				isDark={isDark}
				now={now}
				onActionsPress={onActionsPress}
				upcomingEvents={upcomingEvents}
			/>
			<GenresSection genres={genreFilters} isDark={isDark} />
			<TodaySummaryCard todayCount={todayCount} />
		</AnimatedScrollView>
	);
}
