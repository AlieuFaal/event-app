import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import mapboxgl from 'mapbox-gl'
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/ui/card";
import { Label } from "../shadcn/ui/label";
import { format } from "date-fns";
import { formatTime } from "../calendar/helpers";
import { useCalendar } from "../calendar/contexts/calendar-context";
import { EventFeature } from "./marker";
import { m } from "@/paraglide/messages";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../shadcn/ui/button";
import { Event } from "drizzle/db";

export interface PopupProps {
    activeFeature: EventFeature;
    map: mapboxgl.Map | null;
    events: Event[];
    onClick?: () => void;
}

export const Popup = ({ map, activeFeature, events }: PopupProps) => {

    const { use24HourFormat } = useCalendar();

    const popupRef = useRef<mapboxgl.Popup | null>(null);

    const contentRef = useRef(document.createElement('div'));

    // Get all events at the same location
    const sameLocationEvents = events.filter(event =>
        event.address === activeFeature.properties.Event.address &&
        event.id !== activeFeature.properties.Event.id
    );
    sameLocationEvents.unshift(activeFeature.properties.Event);

    // Track which event we're currently displaying
    const [index, setIndex] = useState(0);

    // Get the current event being displayed
    const currentEvent = sameLocationEvents[index];

    const showPreviousEvent = (e: React.MouseEvent) => {
        // Prevent event propagation to avoid closing the popup
        e.stopPropagation();

        if (index === 0) {
            // Optional: wrap around to last event
            // setIndex(sameLocationEvents.length - 1);
            return;
        }
        setIndex(index - 1);
    }

    const showNextEvent = (e: React.MouseEvent) => {
        // Prevent event propagation to avoid closing the popup
        e.stopPropagation();

        if (index === sameLocationEvents.length - 1) {
            // Optional: wrap around to first event
            // setIndex(0);
            return;
        }
        setIndex(index + 1);
    }

    useEffect(() => {
        if (!map) return

        popupRef.current = new mapboxgl.Popup({
            offset: 25,
            maxWidth: '400px',
            className: 'custom-popup',
            closeOnClick: false,
            closeButton: false,
            closeOnMove: false,
        })
            .setLngLat(activeFeature.geometry.coordinates)
            .setDOMContent(contentRef.current)
            .addTo(map);

        return () => {
            popupRef.current?.remove()
        }
    }, [map]);

    return (
        <>{
            createPortal(
                <div className="portal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col">
                        <Card className="w-55 min-w-fit h-fit">
                            <CardContent>
                                <CardHeader>
                                    <CardTitle className="relative text-lg right-6">
                                        {currentEvent?.title}
                                    </CardTitle>
                                </CardHeader>
                                <div className="items-center space-y-5">
                                    <div className="space-y-1">
                                        <Label>
                                            {m.form_venue_label()}
                                        </Label>
                                        <p>{currentEvent?.venue}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>
                                            {m.form_address_label()}
                                        </Label>
                                        <p>{currentEvent?.address}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>
                                            {m.form_description_label()}
                                        </Label>
                                        <p>{currentEvent?.description}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>
                                            {m.start_date_label()}
                                        </Label>
                                        <p>
                                            {currentEvent?.startDate && format(currentEvent.startDate, "EEEE dd MMMM")}
                                            <span className="mx-1">at</span>
                                            {currentEvent?.startDate && formatTime(currentEvent.startDate, use24HourFormat)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-around mt-3">
                                    <Button
                                        type="button"
                                        disabled={index === 0}
                                        className="bg-transparent shadow-none border-none hover:bg-muted hover:scale-120 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={showPreviousEvent}
                                    >
                                        <ArrowLeft className="text-black dark:text-white" />
                                    </Button>

                                    <div className="flex flex-row justify-center mt-3">
                                        <p>{index + 1} of {sameLocationEvents.length}</p>
                                    </div>

                                    <Button
                                        type="button"
                                        disabled={index === sameLocationEvents.length - 1}
                                        className="bg-transparent shadow-none border-none hover:bg-muted hover:scale-120 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={showNextEvent}
                                    >
                                        <ArrowRight className="text-black dark:text-white" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>, contentRef.current
            )
        }</>
    )
}