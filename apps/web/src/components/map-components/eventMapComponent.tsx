import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getLocale } from '@/paraglide/runtime';
import { EventFeature, Marker } from './marker';
import { Event } from 'drizzle/db';
import { Spinner } from '../shadcn/ui/shadcn-io/spinner';
import { Button } from '../shadcn/ui/button';
import { MoonStar, Sun, Sunrise, Sunset } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

// Lazy load Mapbox component to avoid SSR issues
const Geocoder = lazy(() =>
  import('@mapbox/search-js-react').then((mod) => ({ default: mod.Geocoder }))
);

interface EventMapViewProps {
    events: Event[];
    accessToken: string;
}

export function EventMap({ events, accessToken }: EventMapViewProps) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [activeFeature, setActiveFeature] = useState<EventFeature | null>(null);

    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const eventId = useSearch({ from: '/(protected)/event-map', select: (s) => ({ id: s.id }) });
    const event = events.find(e => e.id === eventId.id);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = accessToken;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/standard',
            center: [11.9746, 57.7089],
            zoom: 12.5,
            config: {
                basemap: {
                    lightPreset: "day",
                    colorMotorways: "#2e89ff",
                    showPedestrianRoads: true,
                    show3dObjects: true,
                    theme: 'faded'
                }
            },
            pitch: 50,
            bearing: 8,
        });

        mapRef.current.on('load', () => {
            setMapLoaded(true);
        });

        mapRef.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

        mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true, showCompass: true }), 'top-right');

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

    useEffect(() => {
        if (!mapRef.current) return;
        if (!event?.latitude || !event?.longitude) return;

        if (!mapLoaded) {
            setActiveFeature({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(event?.latitude), parseFloat(event?.longitude)]
                },
                properties: { Event: event }
            });
            mapRef.current.flyTo({
                center: [parseFloat(event?.latitude), parseFloat(event?.longitude)] as [number, number],
                zoom: 17.5,
                duration: 4500,
                essential: true,
                animate: true,
            });
        }
    }, [event]);

    const handleMarkerClick = (feature: EventFeature) => {
        if (activeFeature?.properties.Event.id === feature.properties.Event.id) {
            setActiveFeature(null);
        } else {
            setActiveFeature(feature);
            mapRef.current?.flyTo({
                center: feature.geometry.coordinates as [number, number],
                zoom: 14.5,
                duration: 2000,
                essential: true,
                animate: true,
            });
        }
    }

    return (
        <div className="-mt-7">
            {!mapLoaded && (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-lg">
                        <Spinner className="text-primary" size={200} variant='ring' />
                    </div>
                </div>
            )}
            <div className="relative top-10 md:top-15 left-4 md:left-10 z-1 w-[calc(100%-2rem)] md:w-50 max-w-md">
                <Suspense fallback={<div className="h-12 bg-gray-100 rounded animate-pulse" />}>
                    <Geocoder
                        accessToken={accessToken}
                        placeholder={getLocale() === 'sv' ? 'Sök plats' : 'Search location'}
                        value={inputValue}
                        onChange={(value: any) => {
                            setInputValue(value);
                        }}
                        onRetrieve={(result: any) => {
                            if (mapRef.current && result.geometry?.coordinates) {
                                const coordinates = result.geometry.coordinates;
                                mapRef.current.flyTo({
                                    center: coordinates.slice() as [number, number],
                                    zoom: 14.5,
                                essential: true,
                                animate: true,
                            });
                        }
                    }}
                />
                </Suspense>
            </div>
            <div className="p-2 md:p-4 h-full relative">
                <div id="map-container" className="w-full h-[105vh] sm:h-[70vh] md:h-180 lg:h-125 xl:h-190 2xl:h-220" ref={mapContainerRef} />
                <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-fit">
                    {mapRef.current && (
                        <div className='flex flex-row gap-1.5 md:gap-2 bg-background/60 backdrop-blur-sm p-1.5 md:p-2 rounded-full shadow-lg'>
                            <div>
                                <Button size="icon" className='hover:scale-110 rounded-full h-8 w-8 md:h-10 md:w-10 cursor-pointer' onClick={() => {
                                    mapRef.current?.setConfig('basemap', {
                                        lightPreset: "dawn", colorMotorways: "#2e89ff",
                                        showPedestrianRoads: true,
                                        show3dObjects: true,
                                        theme: 'faded'
                                    })
                                }}>
                                    <Sunrise className="h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            </div>
                            <div>
                                <Button size="icon" className='hover:scale-110 rounded-full h-8 w-8 md:h-10 md:w-10 cursor-pointer' onClick={() => {
                                    mapRef.current?.setConfig('basemap', {
                                        lightPreset: "day", colorMotorways: "#2e89ff",
                                        showPedestrianRoads: true,
                                        show3dObjects: true,
                                        theme: 'faded'
                                    })
                                }}>
                                    <Sun className="h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            </div>
                            <div>
                                <Button size="icon" className='hover:scale-110 rounded-full h-8 w-8 md:h-10 md:w-10 cursor-pointer' onClick={() => {
                                    mapRef.current?.setConfig('basemap', {
                                        lightPreset: "dusk", colorMotorways: "#2e89ff",
                                        showPedestrianRoads: true,
                                        show3dObjects: true,
                                        theme: 'faded'
                                    })
                                }}>
                                    <Sunset className="h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            </div>
                            <div>
                                <Button size="icon" className='hover:scale-110 rounded-full h-8 w-8 md:h-10 md:w-10 cursor-pointer' onClick={() => {
                                    mapRef.current?.setConfig('basemap', {
                                        lightPreset: "night", colorMotorways: "#2e89ff",
                                        showPedestrianRoads: true,
                                        show3dObjects: true,
                                        theme: 'faded'
                                    })
                                }}>
                                    <MoonStar className="h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                {mapLoaded && events?.map((event) => (
                    <Marker
                        key={event.id}
                        map={mapRef.current}
                        events={events}
                        onClick={handleMarkerClick}
                        isActive={activeFeature?.properties.Event.id === event.id}
                        feature={{
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [parseFloat(event.latitude), parseFloat(event.longitude),]
                            },
                            properties: { Event: event }
                        }}
                    />
                ))}
            </div>
        </div>
    );
}