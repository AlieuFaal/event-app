import { MapPin as MapPinIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import { getLocationLabel } from "@/components/event-components/all-events-utils";
import type { MapEventGroup } from "@/components/map-components/map-utils";

type MapEventMarkerProps = {
	group: MapEventGroup;
	isSelected: boolean;
	onPress: (group: MapEventGroup) => void;
};

export function MapEventMarker({
	group,
	isSelected,
	onPress,
}: MapEventMarkerProps) {
	const primaryEvent = group.events[0];
	if (!primaryEvent) return null;

	const eventCount = group.events.length;

	return (
		<Marker
			key={group.id}
			title={eventCount === 1 ? primaryEvent.title : `${eventCount} events here`}
			description={getLocationLabel(primaryEvent)}
			anchor={{ x: 0.5, y: 0.5 }}
			coordinate={{
				latitude: group.latitude,
				longitude: group.longitude,
			}}
			onPress={() => onPress(group)}
			stopPropagation={true}
		>
			<View collapsable={false} style={styles.markerTouchTarget}>
				<View
					style={[
						styles.markerBubble,
						isSelected ? styles.selectedMarkerBubble : null,
					]}
				>
					<MapPinIcon color="#ffffff" size={22} strokeWidth={2.6} />
				</View>
				{eventCount > 1 ? (
					<View style={styles.markerCountBadge}>
						<Text style={styles.markerCountText}>{eventCount}</Text>
					</View>
				) : null}
			</View>
		</Marker>
	);
}

const styles = StyleSheet.create({
	markerBubble: {
		alignItems: "center",
		backgroundColor: "#8b5cf6",
		borderColor: "#ffffff",
		borderRadius: 19,
		borderWidth: 2,
		height: 38,
		justifyContent: "center",
		width: 38,
	},
	markerCountBadge: {
		alignItems: "center",
		backgroundColor: "#111827",
		borderColor: "#ffffff",
		borderRadius: 11,
		borderWidth: 2,
		justifyContent: "center",
		minHeight: 22,
		minWidth: 22,
		paddingHorizontal: 4,
		position: "absolute",
		right: 0,
		top: 4,
	},
	markerCountText: {
		color: "#ffffff",
		fontSize: 11,
		fontWeight: "800",
		lineHeight: 14,
	},
	markerTouchTarget: {
		alignItems: "center",
		height: 54,
		justifyContent: "center",
		width: 54,
	},
	selectedMarkerBubble: {
		backgroundColor: "#5b21b6",
		transform: [{ scale: 1.1 }],
	},
});
