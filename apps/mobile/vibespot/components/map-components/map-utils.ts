import { Platform } from "react-native";
import { getLocationLabel } from "@/components/event-components/all-events-utils";
import type { EventWithAttendance } from "@/types/event";

export const NOW_REFRESH_INTERVAL_MS = 60_000;
export const FOCUSED_REGION_DELTA = 0.01;
export const DEFAULT_MAP_REGION = {
	latitude: 57.7089,
	longitude: 11.9746,
	latitudeDelta: 0.3,
	longitudeDelta: 0.3,
};

export type MapCoordinates = {
	latitude: number;
	longitude: number;
};

export type MapEventGroup = MapCoordinates & {
	id: string;
	events: EventWithAttendance[];
};

export function parseEventCoordinates(
	event: Pick<EventWithAttendance, "latitude" | "longitude">,
): MapCoordinates | null {
	const latitude = Number.parseFloat(event.latitude);
	const longitude = Number.parseFloat(event.longitude);

	if (
		!Number.isFinite(latitude) ||
		!Number.isFinite(longitude) ||
		Math.abs(latitude) > 90 ||
		Math.abs(longitude) > 180
	) {
		return null;
	}

	return { latitude, longitude };
}

export function getCoordinateGroupKey({ latitude, longitude }: MapCoordinates) {
	return `${latitude.toFixed(5)}:${longitude.toFixed(5)}`;
}

export function groupEventsByCoordinates(
	events: EventWithAttendance[],
): MapEventGroup[] {
	const groupsByKey = new globalThis.Map<string, MapEventGroup>();

	for (const event of events) {
		const coordinates = parseEventCoordinates(event);
		if (!coordinates) continue;

		const groupId = getCoordinateGroupKey(coordinates);
		const existingGroup = groupsByKey.get(groupId);

		if (existingGroup) {
			existingGroup.events.push(event);
			continue;
		}

		groupsByKey.set(groupId, {
			id: groupId,
			...coordinates,
			events: [event],
		});
	}

	return Array.from(groupsByKey.values()).map((group) => ({
		...group,
		events: [...group.events].sort(
			(a, b) =>
				new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
		),
	}));
}

export function clampEventIndex(index: number, group: MapEventGroup | null) {
	if (!group) return 0;
	return Math.min(Math.max(index, 0), group.events.length - 1);
}

export function formatEventDate(date: Date | string) {
	return new Date(date).toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});
}

export function formatAttendeeCount(count: number) {
	return count === 1 ? "1 going" : `${count} going`;
}

export function getDirectionsUrls(
	event: EventWithAttendance,
	coordinates: MapCoordinates,
) {
	const label = encodeURIComponent(`${event.title} ${getLocationLabel(event)}`);
	const destination = `${coordinates.latitude},${coordinates.longitude}`;
	const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;

	if (Platform.OS === "ios") {
		return {
			primaryUrl: `http://maps.apple.com/?daddr=${destination}&q=${label}`,
			fallbackUrl,
		};
	}

	return {
		primaryUrl: `geo:0,0?q=${destination}(${label})`,
		fallbackUrl,
	};
}
