import { useEffect, useRef } from "react"
import mapboxgl from 'mapbox-gl';
import { Event } from "drizzle/db";
import { createPortal } from "react-dom";
import { Popup } from "./popup";
import { PiMapPinFill } from "react-icons/pi";


export interface EventFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
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
    const { geometry, properties } = feature;
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
                    <PiMapPinFill className={`${isActive ? 'text-foreground' : 'text-primary'} size-5 hover:scale-130 transition-all ${isActive ? "animate-pulse" : ""}`} />

                    {isActive && map && feature && (
                        <Popup activeFeature={feature} map={map} events={events}/>
                    )}
                </div>,
                contentRef.current
            )}
        </>
    );
};