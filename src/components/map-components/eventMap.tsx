import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Geocoder } from '@mapbox/search-js-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getLocale } from '@/paraglide/runtime';
import { Marker } from './marker';
import { Event } from 'drizzle/db';
import { Spinner } from '../shadcn/ui/shadcn-io/spinner';

interface EventMapViewProps {
    events: Event[];
    accessToken: string;
}

export function EventMap({ events, accessToken }: EventMapViewProps) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = accessToken;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [11.9746, 57.7089],
            zoom: 12.5,
            config: {
                basemap: { theme: 'faded' }
            },
        });

        mapRef.current.on('load', () => {
            setMapLoaded(true);
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        mapRef.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true,
            })
        );

        return () => {
            mapRef.current?.remove();
        };
    }, [accessToken]);

    return (
        <div className="relative h-screen w-full">
            <div className="absolute top-15 left-15 z-10">
                <Geocoder
                    accessToken={accessToken}
                    mapboxgl={mapboxgl}
                    marker={{ color: 'purple', draggable: false }}
                    placeholder={getLocale() === 'sv' ? 'Sök plats' : 'Search location'}
                    value={inputValue}
                    options={{
                        language: getLocale(),
                        proximity: 'ip'
                    }}
                    onChange={(value) => {
                        setInputValue(value);
                    }}
                    onRetrieve={(result) => {
                        if (mapRef.current && result.geometry?.coordinates) {
                            const coordinates = result.geometry.coordinates;
                            mapRef.current.flyTo({
                                center: coordinates.slice() as [number, number],
                                zoom: 14.5,
                                essential: true
                            });
                        }
                    }}
                />
            </div>
            {!mapLoaded && (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-lg">
                        <Spinner className="text-primary" size={200} variant='ring'/>
                    </div>
                </div>
            )}
            <div className="p-8 h-full">
                <div id="map-container" className="w-full h-full" ref={mapContainerRef} />
                {mapLoaded && events?.map((event) => (
                    <Marker
                        key={event.id}
                        feature={{
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [parseFloat(event.latitude), parseFloat(event.longitude),]
                            },
                            properties: { Event: event }
                        }}
                        map={mapRef.current}
                    />
                ))}
            </div>
        </div>
    );
}