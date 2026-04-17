export type LngLatCoordinates = [longitude: number, latitude: number];

interface CoordinateInput {
	latitude: string;
	longitude: string;
}

export const toMapboxLngLat = ({
	latitude,
	longitude,
}: CoordinateInput): LngLatCoordinates | null => {
	const parsedLatitude = Number.parseFloat(latitude);
	const parsedLongitude = Number.parseFloat(longitude);

	if (!Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)) {
		return null;
	}

	return [parsedLongitude, parsedLatitude];
};
