import type { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { isEventActive } from "@/components/event-components/all-events-utils";
import { MapControlsOverlay } from "@/components/map-components/map-controls-overlay";
import { MapEventMarker } from "@/components/map-components/map-event-marker";
import {
	clampEventIndex,
	DEFAULT_MAP_REGION,
	FOCUSED_REGION_DELTA,
	getDirectionsUrls,
	groupEventsByCoordinates,
	type MapCoordinates,
	type MapEventGroup,
	NOW_REFRESH_INTERVAL_MS,
} from "@/components/map-components/map-utils";
import { SelectedMapEventSheet } from "@/components/map-components/selected-map-event-sheet";
import { useGetEvent } from "@/hooks/useGetEvent";
import { useTabBarVisibility } from "@/lib/tab-bar-visibility";

function LoadingState() {
	return (
		<SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#8b5cf6" />
				<Text className="text-gray-600 dark:text-gray-300">
					Loading events...
				</Text>
			</View>
		</SafeAreaView>
	);
}

function MessageState({
	children,
	isError = false,
}: {
	children: ReactNode;
	isError?: boolean;
}) {
	return (
		<SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
			<View className="flex-1 items-center justify-center px-6">
				<Text
					className={`text-center ${
						isError
							? "text-red-500 dark:text-red-400"
							: "text-gray-600 dark:text-gray-300"
					}`}
				>
					{children}
				</Text>
			</View>
		</SafeAreaView>
	);
}

export default function Map() {
	const { isPending, error, data } = useGetEvent();
	const mapRef = useRef<MapView>(null);
	const bottomSheetRef = useRef<BottomSheetMethods | null>(null);
	const { eventId } = useLocalSearchParams<{ eventId?: string }>();
	const isDark = useColorScheme() === "dark";
	const { setTabBarHidden } = useTabBarVisibility();
	const [now, setNow] = useState(() => new Date());
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const [selectedEventIndex, setSelectedEventIndex] = useState(0);
	const [hasLocationPermission, setHasLocationPermission] = useState(false);
	const [userCoordinates, setUserCoordinates] = useState<MapCoordinates | null>(
		null,
	);
	const [isLocatingUser, setIsLocatingUser] = useState(false);

	const activeEvents = useMemo(
		() => data?.filter((event) => isEventActive(event, now)) ?? [],
		[data, now],
	);
	const eventGroups = useMemo(
		() => groupEventsByCoordinates(activeEvents),
		[activeEvents],
	);
	const selectedGroup =
		eventGroups.find((group) => group.id === selectedGroupId) ?? null;
	const selectedEvent =
		selectedGroup?.events[clampEventIndex(selectedEventIndex, selectedGroup)] ??
		null;
	const selectedCoordinates = selectedGroup
		? { latitude: selectedGroup.latitude, longitude: selectedGroup.longitude }
		: null;

	const zoomToLocation = useCallback((coordinates: MapCoordinates) => {
		mapRef.current?.animateToRegion(
			{
				...coordinates,
				latitudeDelta: FOCUSED_REGION_DELTA,
				longitudeDelta: FOCUSED_REGION_DELTA,
			},
			700,
		);
	}, []);

	const resetSelectionState = useCallback(() => {
		setSelectedGroupId(null);
		setSelectedEventIndex(0);
		setTabBarHidden(false);
	}, [setTabBarHidden]);

	const closeSelectedGroup = useCallback(() => {
		resetSelectionState();
		bottomSheetRef.current?.close();
	}, [resetSelectionState]);

	const openGroup = useCallback(
		(group: MapEventGroup, eventIndex = 0) => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setSelectedGroupId(group.id);
			setSelectedEventIndex(clampEventIndex(eventIndex, group));
			zoomToLocation({ latitude: group.latitude, longitude: group.longitude });
			bottomSheetRef.current?.expand();
		},
		[zoomToLocation],
	);

	const handleMapPress = useCallback(() => {
		if (!selectedGroupId) return;

		closeSelectedGroup();
	}, [closeSelectedGroup, selectedGroupId]);

	const centerOnUser = useCallback(async () => {
		Haptics.selectionAsync();

		if (!hasLocationPermission) {
			Alert.alert(
				"Location unavailable",
				"Allow location access in settings to show your position on the map.",
			);
			return;
		}

		if (userCoordinates) {
			zoomToLocation(userCoordinates);
			return;
		}

		setIsLocatingUser(true);
		try {
			const position = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});
			const coordinates = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};
			setUserCoordinates(coordinates);
			zoomToLocation(coordinates);
		} catch {
			Alert.alert(
				"Location unavailable",
				"We could not find your current position. Try again in a moment.",
			);
		} finally {
			setIsLocatingUser(false);
		}
	}, [hasLocationPermission, userCoordinates, zoomToLocation]);

	const handleViewDetails = useCallback(() => {
		if (!selectedEvent) return;

		const selectedEventId = selectedEvent.id;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		closeSelectedGroup();
		router.push({
			pathname: "/(protected)/event-details/[id]",
			params: { id: selectedEventId },
		});
	}, [closeSelectedGroup, selectedEvent]);

	const handleOpenDirections = useCallback(async () => {
		if (!selectedEvent || !selectedCoordinates) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		const { primaryUrl, fallbackUrl } = getDirectionsUrls(
			selectedEvent,
			selectedCoordinates,
		);
		const canOpenPrimaryUrl = await Linking.canOpenURL(primaryUrl);
		await Linking.openURL(canOpenPrimaryUrl ? primaryUrl : fallbackUrl);
	}, [selectedCoordinates, selectedEvent]);

	const handlePreviousEvent = useCallback(() => {
		Haptics.selectionAsync();
		setSelectedEventIndex((currentIndex) => Math.max(0, currentIndex - 1));
	}, []);

	const handleNextEvent = useCallback(() => {
		if (!selectedGroup) return;

		Haptics.selectionAsync();
		setSelectedEventIndex((currentIndex) =>
			Math.min(selectedGroup.events.length - 1, currentIndex + 1),
		);
	}, [selectedGroup]);

	const handleSheetChange = useCallback(
		(index: number) => {
			setTabBarHidden(index >= 0);
		},
		[setTabBarHidden],
	);

	const handleSheetClose = useCallback(() => {
		resetSelectionState();
	}, [resetSelectionState]);

	useFocusEffect(
		useCallback(() => {
			return () => {
				closeSelectedGroup();
			};
		}, [closeSelectedGroup]),
	);

	useEffect(() => {
		let isMounted = true;

		async function requestLocationPermission() {
			const permission = await Location.requestForegroundPermissionsAsync();
			if (!isMounted) return;

			if (permission.status !== Location.PermissionStatus.GRANTED) {
				setHasLocationPermission(false);
				return;
			}

			setHasLocationPermission(true);

			try {
				const position = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				});
				if (!isMounted) return;

				setUserCoordinates({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			} catch {
				if (isMounted) setUserCoordinates(null);
			}
		}

		requestLocationPermission();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		const searchedGroup = eventGroups.find((group) =>
			group.events.some((event) => event.id === eventId),
		);
		if (!searchedGroup) return;

		const searchedEventIndex = searchedGroup.events.findIndex(
			(event) => event.id === eventId,
		);
		openGroup(searchedGroup, searchedEventIndex);
	}, [eventGroups, eventId, openGroup]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setNow(new Date());
		}, NOW_REFRESH_INTERVAL_MS);

		return () => {
			clearInterval(intervalId);
			setTabBarHidden(false);
		};
	}, [setTabBarHidden]);

	useEffect(() => {
		if (selectedGroup) {
			setSelectedEventIndex((currentIndex) =>
				clampEventIndex(currentIndex, selectedGroup),
			);
			setTabBarHidden(true);
			return;
		}

		bottomSheetRef.current?.close();
		setTabBarHidden(false);
	}, [selectedGroup, setTabBarHidden]);

	if (isPending) return <LoadingState />;
	if (error) {
		return (
			<MessageState isError>
				Error fetching events: {(error as Error).message}
			</MessageState>
		);
	}
	if (!data) return <MessageState>No events available.</MessageState>;

	return (
		<View className="flex-1 bg-transparent">
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={DEFAULT_MAP_REGION}
				showsUserLocation={hasLocationPermission}
				showsMyLocationButton={false}
				onPress={handleMapPress}
			>
				{eventGroups.map((group) => (
					<MapEventMarker
						key={group.id}
						group={group}
						isSelected={selectedGroupId === group.id}
						onPress={openGroup}
					/>
				))}
			</MapView>

			<MapControlsOverlay
				isDark={isDark}
				isLocatingUser={isLocatingUser}
				showEmptyState={eventGroups.length === 0}
				onLocateUser={centerOnUser}
			/>

			<SelectedMapEventSheet
				bottomSheetRef={bottomSheetRef}
				isDark={isDark}
				selectedEvent={selectedEvent}
				selectedEventIndex={selectedEventIndex}
				selectedGroup={selectedGroup}
				onChange={handleSheetChange}
				onClose={handleSheetClose}
				onNextEvent={handleNextEvent}
				onOpenDirections={handleOpenDirections}
				onPreviousEvent={handlePreviousEvent}
				onViewDetails={handleViewDetails}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	map: {
		...StyleSheet.absoluteFillObject,
	},
});
