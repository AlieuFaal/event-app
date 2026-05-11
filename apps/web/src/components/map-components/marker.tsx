import { useEffect, useRef } from "react"
import mapboxgl from 'mapbox-gl';
import type { Event } from "@vibespot/database/schema";
import { createPortal } from "react-dom";
import { Popup } from "./popup";
import { PiMapPinFill } from "react-icons/pi";
import type { LngLatCoordinates } from "./coordinates";


export interface EventFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: LngLatCoordinates;
    };
    properties: { Event: Event }
}

export interface MarkerProps {
    feature: EventFeature;
    map: mapboxgl.Map | null;
    onClick: (feature: EventFeature) => void;
    isActive: boolean;
    events: Event[]
}

export const Marker = ({ feature, map, isActive, events, onClick }: MarkerProps) => {
    const { geometry } = feature;
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const contentRef = useRef(document.createElement('div'));

    useEffect(() => {
        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat(geometry.coordinates)
            .addTo(map!)
        return () => {
            markerRef.current?.remove();
        }
    }, [])

    return (
        <>
            {createPortal(
                <div onClick={() => onClick(feature)} >
                    <div className="relative cursor-pointer">
                        <PiMapPinFill className={`${isActive ? 'text-foreground' : 'text-primary'} size-6 hover:scale-130 transition-all ${isActive ? "animate-pulse" : ""}`} />
                        {events.length > 1 && (
                            <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-foreground px-1 text-[10px] font-bold leading-none text-background">
                                {events.length}
                            </span>
                        )}
                    </div>

                    {isActive && map && feature && (
                        <Popup activeFeature={feature} map={map} events={events}/>
                    )}
                </div>,
                contentRef.current
            )}
        </>
    );
};
