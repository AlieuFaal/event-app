import type { Event } from "@vibespot/database/schema";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { m } from "@/paraglide/messages";
import { useCalendarOptional } from "../calendar/contexts/calendar-context";
import { formatTime } from "../calendar/helpers";
import { Button } from "../shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/ui/card";
import { Label } from "../shadcn/ui/label";
import type { EventFeature } from "./marker";

export interface PopupProps {
	activeFeature: EventFeature;
	map: mapboxgl.Map | null;
	events: Event[];
	onClick?: () => void;
}

export const Popup = ({ map, activeFeature, events }: PopupProps) => {
	const calendarContext = useCalendarOptional();
	const use24HourFormat = calendarContext?.use24HourFormat ?? true;

	const popupRef = useRef<mapboxgl.Popup | null>(null);

	const contentRef = useRef(document.createElement("div"));

	const sameLocationEvents =
		events.length > 0 ? events : [activeFeature.properties.Event];

	// Track which event we're currently displaying
	const [index, setIndex] = useState(() => {
		const activeEventIndex = sameLocationEvents.findIndex(
			(event) => event.id === activeFeature.properties.Event.id,
		);
		return Math.max(activeEventIndex, 0);
	});

	// Get the current event being displayed
	const currentEvent = sameLocationEvents[index];

	useEffect(() => {
		const activeEventIndex = sameLocationEvents.findIndex(
			(event) => event.id === activeFeature.properties.Event.id,
		);
		setIndex(Math.max(activeEventIndex, 0));
	}, [activeFeature.properties.Event.id, sameLocationEvents]);

	const showPreviousEvent = (e: React.MouseEvent) => {
		// Prevent event propagation to avoid closing the popup
		e.stopPropagation();

		if (index === 0) {
			// Optional: wrap around to last event
			// setIndex(sameLocationEvents.length - 1);
			return;
		}
		setIndex(index - 1);
	};

	const showNextEvent = (e: React.MouseEvent) => {
		// Prevent event propagation to avoid closing the popup
		e.stopPropagation();

		if (index === sameLocationEvents.length - 1) {
			// Optional: wrap around to first event
			// setIndex(0);
			return;
		}
		setIndex(index + 1);
	};

	useEffect(() => {
		if (!map) return;

		popupRef.current = new mapboxgl.Popup({
			offset: 25,
			maxWidth: "400px",
			className: "custom-popup",
			closeOnClick: false,
			closeButton: false,
			closeOnMove: false,
		})
			.setLngLat(activeFeature.geometry.coordinates)
			.setDOMContent(contentRef.current)
			.addTo(map);

		return () => {
			popupRef.current?.remove();
		};
	}, [map, activeFeature.geometry.coordinates]);

	return (
		<>
			{createPortal(
				<div className="portal-content">
					<div className="flex flex-col">
						<Card className="h-fit w-55 min-w-fit">
							<CardContent>
								<CardHeader>
									<CardTitle className="relative right-6 text-lg">
										{currentEvent?.title}
									</CardTitle>
								</CardHeader>
								<div className="items-center space-y-5">
									<div className="space-y-1">
										<Label>{m.form_venue_label()}</Label>
										<p>{currentEvent?.venue}</p>
									</div>
									<div className="space-y-1">
										<Label>{m.form_address_label()}</Label>
										<p>{currentEvent?.address}</p>
									</div>
									<div className="space-y-1">
										<Label>{m.form_description_label()}</Label>
										<p>{currentEvent?.description}</p>
									</div>
									<div className="space-y-1">
										<Label>{m.start_date_label()}</Label>
										<p>
											{currentEvent?.startDate &&
												format(currentEvent.startDate, "EEEE dd MMMM")}
											<span className="mx-1">at</span>
											{currentEvent?.startDate &&
												formatTime(currentEvent.startDate, use24HourFormat)}
										</p>
									</div>
								</div>
								<div className="mt-3 flex flex-row justify-around">
									<Button
										type="button"
										disabled={index === 0}
										className="border-none bg-transparent shadow-none hover:scale-120 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
										onClick={showPreviousEvent}
									>
										<ArrowLeft className="text-black dark:text-white" />
									</Button>

									<div className="mt-3 flex flex-row justify-center">
										<p>
											{index + 1} of {sameLocationEvents.length}
										</p>
									</div>

									<Button
										type="button"
										disabled={index === sameLocationEvents.length - 1}
										className="border-none bg-transparent shadow-none hover:scale-120 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
										onClick={showNextEvent}
									>
										<ArrowRight className="text-black dark:text-white" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>,
				contentRef.current,
			)}
		</>
	);
};
