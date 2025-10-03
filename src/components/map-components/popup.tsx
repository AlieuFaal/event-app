import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import mapboxgl from 'mapbox-gl'
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/ui/card";
import { Label } from "../shadcn/ui/label";
import { format } from "date-fns";
import { formatTime } from "../calendar/helpers";
import { useCalendar } from "../calendar/contexts/calendar-context";
import { EventFeature } from "./marker";
import { m } from "@/paraglide/messages";

export interface PopupProps {
    activeFeature: EventFeature;
    map: mapboxgl.Map | null;
}

export const Popup = ({ map, activeFeature }: PopupProps) => {

    const startDate = activeFeature?.properties.Event.startDate;
    const { use24HourFormat, removeEvent } = useCalendar();

    const popupRef = useRef<mapboxgl.Popup | null>(null);

    const contentRef = useRef(document.createElement('div'));

    useEffect(() => {
        if (!map) return

        popupRef.current = new mapboxgl.Popup({
            closeOnClick: false,
            offset: 25,
            maxWidth: '400px',
            className: 'custom-popup'
        })

        return () => {
            popupRef.current?.remove()
        }
    }, [])

    useEffect(() => {
        if (!activeFeature) return

        popupRef.current?.setLngLat(activeFeature.geometry.coordinates)
            .setHTML(contentRef.current.outerHTML)
            .addTo(map!);
    }, [activeFeature])

    return (
        <>{
            createPortal(
                <div className="portal-content">
                    <div className="flex flex-col">
                        <Card className="w-55 min-w-fit h-fit">
                            <CardContent>
                                <CardHeader>
                                    <CardTitle className="relative text-lg right-6">
                                        {activeFeature?.properties.Event.title}
                                    </CardTitle>
                                </CardHeader>
                                <div className="items-center space-y-5">
                                    <div className="space-y-1">
                                        <Label>
                                            {m.form_venue_label()}
                                        </Label>
                                        <p>{activeFeature?.properties.Event.venue}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>
                                            {m.form_description_label()}
                                        </Label>
                                        <p>{activeFeature?.properties.Event.description}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>
                                            {m.start_date_label()}
                                        </Label>
                                        <p>
                                            {format(startDate, "EEEE dd MMMM")}
                                            <span className="mx-1">at</span>
                                            {formatTime(startDate, use24HourFormat)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>, contentRef.current
            )
        }</>
    )
}