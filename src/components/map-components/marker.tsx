import { useEffect, useRef, useState } from "react"
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
}

export const Marker = ({ feature, map, isActive, onClick }: MarkerProps) => {
    const { geometry, properties } = feature;
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const contentRef = useRef(document.createElement('div'));
    const [isActiveState, setIsActive] = useState(false);

    useEffect(() => {
        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat(geometry.coordinates)
            .addTo(map!)
        // .setPopup(new mapboxgl.Popup({ offset: 25 })
        // .setText(feature.properties.Event.title))
        // .on('click', () => {
        //     onClick(feature);
        //     setIsActive(true);
        // });

        return () => {
            markerRef.current?.remove();
        }
    }, [])


    // return null
    return (
        <>
            {createPortal(
                <div
                    onClick={() => onClick(feature)}
                // style={{
                //     display: "inline-block",
                //     padding: "2px 4px",
                //     borderRadius: "50px",
                //     boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                //     textAlign: "center",
                // }}
                >
                    <PiMapPinFill className={`${isActive ? 'text-foreground' : 'text-primary'} size-8 hover:scale-130 transition-all ${isActive ? "animate-pulse" : ""}`} />
                    
                    {isActive && map && feature && (
                        <Popup activeFeature={feature} map={map} />
                    )
                    }
                </div>,
                contentRef.current
            )}
        </>
    );
};