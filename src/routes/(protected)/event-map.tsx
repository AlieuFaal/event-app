import { createFileRoute } from '@tanstack/react-router'
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import "../../styles.css"
import { Geocoder, useGeocodingCore } from '@mapbox/search-js-react';
import { getLocale, setLocale } from '@/paraglide/runtime';
import { Card, CardTitle } from '@/components/shadcn/ui/card';
import { map } from 'zod';

export const Route = createFileRoute('/(protected)/event-map')({
    component: RouteComponent,
})
const accessToken = import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN;

function RouteComponent() {
    const [mapLoaded, setMapLoaded] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const geocodingCore = useGeocodingCore({ accessToken: accessToken });

    const result = async () => await geocodingCore.suggest(inputValue, { limit: 5 });

    useEffect(() => {
        mapboxgl.accessToken = accessToken;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [11.9746, 57.7089], // starting position [lng, lat]
            zoom: 12.5, // starting zoom
            config: {
                basemap: { theme: 'faded' }
            },
        })

        mapRef.current.on('load', () => {
            setMapLoaded(true)
        })

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        mapRef.current.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true,
        }));

        return () => {
            mapRef.current?.remove();
        }
    }, []);

    return (
        <div>
            <div className="flex absolute top-0 left-0 right-0 bottom-0 h-full w-full">
                <div className='absolute top-30 left-10 z-1'>
                    <Geocoder
                        ref={mapContainerRef}
                        accessToken={accessToken}
                        mapboxgl={mapboxgl}
                        marker={{ color: 'purple', draggable: false }}
                        placeholder={getLocale() === "sv" ? "Sök plats" : "Search location"}
                        value={inputValue}
                        options={{
                            language: getLocale(),
                            proximity: {lng: 11.9746,lat: 57.7089,}
                        }}
                        onChange={(e) => {
                            setInputValue(e);
                            console.log(e);
                        }}
                        onRetrieve={(result) => {
                            if (mapRef.current && result.geometry.coordinates) {
                                const feature = result.geometry.coordinates;
                                mapRef.current.flyTo({
                                    center: feature.slice() as [number, number],
                                    zoom: 14,
                                    essential: true
                                });
                            }
                        }}
                        />
                </div>
            </div>
            <div className="p-8">
                <div id="map-container" className='w-full h-screen' ref={mapContainerRef} />
            </div>
        </div>
    )
}
