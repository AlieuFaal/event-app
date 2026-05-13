import type { Event } from "@vibespot/database/schema";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PiMapPinFill } from "react-icons/pi";
import type { LngLatCoordinates } from "./coordinates";
import { Popup } from "./popup";

export interface EventFeature {
	type: "Feature";
	geometry: {
		type: "Point";
		coordinates: LngLatCoordinates;
	};
	properties: { Event: Event };
}

export interface MarkerProps {
	feature: EventFeature;
	map: mapboxgl.Map | null;
	onClick: (feature: EventFeature) => void;
	isActive: boolean;
	events: Event[];
}

export const Marker = ({
	feature,
	map,
	isActive,
	events,
	onClick,
}: MarkerProps) => {
	const { geometry } = feature;
	const markerRef = useRef<mapboxgl.Marker | null>(null);
	const contentRef = useRef(document.createElement("div"));

	useEffect(() => {
		if (!map) {
			return;
		}
		markerRef.current = new mapboxgl.Marker(contentRef.current)
			.setLngLat(geometry.coordinates)
			.addTo(map);
		return () => {
			markerRef.current?.remove();
		};
	}, [map, geometry.coordinates]);

	return (
		<>
			{createPortal(
				<div>
					<button
						type="button"
						className="relative cursor-pointer"
						onClick={() => onClick(feature)}
						aria-label={`View events at ${feature.properties.Event.venue}`}
					>
						<PiMapPinFill
							className={`${isActive ? "text-foreground" : "text-primary"} size-6 transition-all hover:scale-130 ${isActive ? "animate-pulse" : ""}`}
						/>
						{events.length > 1 && (
							<span className="absolute -top-2 -right-2 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-foreground px-1 font-bold text-[10px] text-background leading-none">
								{events.length}
							</span>
						)}
					</button>

					{isActive && map && feature && (
						<Popup activeFeature={feature} map={map} events={events} />
					)}
				</div>,
				contentRef.current,
			)}
		</>
	);
};
