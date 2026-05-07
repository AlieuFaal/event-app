import type { Event } from "@vibespot/database";
import { useLocalSearchParams } from "expo-router";
import { MapPin as MapPinIcon } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetEvent } from "@/hooks/useGetEvent";

export default function Map() {
	const { isPending, error, data } = useGetEvent();
	const mapRef = useRef<MapView>(null);
	const { eventId } = useLocalSearchParams<{ eventId?: string }>();
	const searchedEvent = data?.find((e: Event) => e.id === eventId);

	const zoomToLocation = useCallback((lat: number, lng: number) => {
		mapRef.current?.animateToRegion(
			{
				latitude: lat,
				longitude: lng,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			},
			1000,
		);
	}, []);

	useEffect(() => {
		if (searchedEvent) {
			zoomToLocation(
				parseFloat(searchedEvent.latitude),
				parseFloat(searchedEvent.longitude),
			);
		}
	}, [searchedEvent, zoomToLocation]);

	if (isPending) {
		return (
			<SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" color="fuchsia" />
					<Text className="text-gray-600 dark:text-gray-300">
						Loading events...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!data) {
		return (
			<SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
				<View className="flex-1 justify-center items-center">
					<Text className="text-gray-600 dark:text-gray-300">
						No events available.
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
				<View className="flex-1 justify-center items-center">
					<Text className="text-red-500 dark:text-red-400">
						Error fetching events: {(error as Error).message}
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<View className="flex-1 w-full h-64 mx-auto border rounded-2xl shadow overflow-hidden -mt-3">
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={{
					latitude: 57.7089,
					longitude: 11.9746,
					latitudeDelta: 0.3,
					longitudeDelta: 0.3,
				}}
			>
				{data?.map((event: Event) => (
					<Marker
						key={event.id}
						title={event.title}
						description={event.startDate.toUTCString()}
						titleVisibility="adaptive"
						anchor={{ x: 0.5, y: 0.5 }}
						coordinate={{
							latitude: parseFloat(event.latitude),
							longitude: parseFloat(event.longitude),
						}}
						onPress={() =>
							zoomToLocation(
								parseFloat(event.latitude),
								parseFloat(event.longitude),
							)
						}
						stopPropagation={true}
						tracksViewChanges={false}
					>
						<View collapsable={false} style={styles.markerTouchTarget}>
							<View style={styles.markerBubble}>
								<MapPinIcon color="#ffffff" size={22} strokeWidth={2.6} />
							</View>
						</View>
					</Marker>
				))}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	map: {
		width: "100%",
		height: "100%",
	},
	markerTouchTarget: {
		alignItems: "center",
		height: 48,
		justifyContent: "center",
		width: 48,
	},
	markerBubble: {
		alignItems: "center",
		backgroundColor: "#8b5cf6",
		borderColor: "#ffffff",
		borderRadius: 18,
		borderWidth: 2,
		height: 36,
		justifyContent: "center",
		width: 36,
	},
});
