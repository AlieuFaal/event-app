import { useEffect, useRef } from "react"
import mapboxgl from 'mapbox-gl';
import { Event } from "drizzle/db";

export interface eventFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: { Event: Event }
}
export interface MarkerProps {
    feature: eventFeature;
    map: mapboxgl.Map | null;
}

export const Marker = ({ feature, map }: MarkerProps) => {
    const { geometry } = feature;

    // const contentRef = useRef(document.createElement('div'));
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {

        markerRef.current = new mapboxgl.Marker({
            color: 'purple',
            scale: 1.2
        })
            .setLngLat(geometry.coordinates)
            .addTo(map!)


        return () => {
            markerRef.current?.remove();
        }
    }, [])

    return (
        <>
            {/* {createPortal(
                <div className="">
                    <MapPin color="red" size={"large"} />
                </div>,
                contentRef.current
            )} */}
        </>
    )
}