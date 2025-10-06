import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getLocale } from '@/paraglide/runtime';
import { EventFeature, Marker } from './marker';
import { Event } from 'drizzle/db';
import { Spinner } from '../shadcn/ui/shadcn-io/spinner';
import { Button } from '../shadcn/ui/button';
import { MoonStar, Sun, Sunrise, Sunset } from 'lucide-react';

// Dynamic import wrapper for Geocoder (client-side only)
function GeocoderWrapper({ accessToken, onRetrieve, placeholder, value, onChange, proximity }: any) {
    const [Geocoder, setGeocoder] = useState<any>(null);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('@mapbox/search-js-react').then(module => {
                setGeocoder(() => module.Geocoder);
            });
        }
    }, []);
    
    if (!Geocoder) {
        return <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="w-full px-4 py-2 border rounded" />;
    }
    
    return (
        <Geocoder
            accessToken={accessToken}
            onRetrieve={onRetrieve}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            proximity={proximity}
        />
    );
}

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

        // mapRef.current.dragRotate.enable();
        // mapRef.current.touchZoomRotate.enableRotation();
        // mapRef.current.touchPitch.enable();

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

    const handleMarkerClick = (feature: EventFeature) => {
        // Toggle popup if clicking the same marker
        if (activeFeature?.properties.Event.id === feature.properties.Event.id) {
            setActiveFeature(null);
        } else {
            setActiveFeature(feature);
        }
    }

    return (
        <div className="relative h-screen w-full min-h-50">
            {!mapLoaded && (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-lg">
                        <Spinner className="text-primary" size={200} variant='ring' />
                    </div>
                </div>
            )}
            <div className="absolute top-15 left-15 z-10 w-60">
                <GeocoderWrapper
                    accessToken={accessToken}
                    placeholder={getLocale() === 'sv' ? 'Sök plats' : 'Search location'}
                    value={inputValue}
                    proximity="ip"
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
            </div>
            <div className="absolute bottom-110 left-10 z-10">
                {mapRef.current && (
                    <div className='flex flex-col gap-2 bg-background/60 p-2 rounded-lg shadow-lg'>
                        <div>
                            <Button className='hover:scale-110' onClick={() => {
                                mapRef.current?.setConfig('basemap', {
                                    lightPreset: "dawn", colorMotorways: "#2e89ff",
                                    showPedestrianRoads: true,
                                    show3dObjects: true,
                                    theme: 'faded'
                                })
                            }}>
                                <Sunrise />
                            </Button>
                        </div>
                        <div>
                            <Button className='hover:scale-110' onClick={() => {
                                mapRef.current?.setConfig('basemap', {
                                    lightPreset: "day", colorMotorways: "#2e89ff",
                                    showPedestrianRoads: true,
                                    show3dObjects: true,
                                    theme: 'faded'
                                })
                            }}>
                                <Sun />
                            </Button>
                        </div>
                        <div>
                            <Button className='hover:scale-110' onClick={() => {
                                mapRef.current?.setConfig('basemap', {
                                    lightPreset: "dusk", colorMotorways: "#2e89ff",
                                    showPedestrianRoads: true,
                                    show3dObjects: true,
                                    theme: 'faded'
                                })
                            }}>
                                <Sunset />
                            </Button>
                        </div>
                        <div>
                            <Button className='hover:scale-110' onClick={() => {
                                mapRef.current?.setConfig('basemap', {
                                    lightPreset: "night", colorMotorways: "#2e89ff",
                                    showPedestrianRoads: true,
                                    show3dObjects: true,
                                    theme: 'faded'
                                })
                            }}>
                                <MoonStar />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-8 h-full">
                <div id="map-container" className="absolute w-full h-220" ref={mapContainerRef} />
                {mapLoaded && events?.map((event) => (
                    <Marker
                        key={event.id}
                        map={mapRef.current}
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