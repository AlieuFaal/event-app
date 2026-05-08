import type { Event, EventColor } from "@vibespot/database/schema";

export const EVENT_COLOR_MAP: Record<EventColor, string> = {
	Blue: "#3b82f6",
	Green: "#22c55e",
	Red: "#ef4444",
	Yellow: "#eab308",
	Purple: "#a855f7",
	Orange: "#f97316",
};

export const EVENT_COLOR_BG_MAP: Record<EventColor, string> = {
	Blue: "#eff6ff",
	Green: "#f0fdf4",
	Red: "#fef2f2",
	Yellow: "#fefce8",
	Purple: "#faf5ff",
	Orange: "#fff7ed",
};

export const EVENT_COLOR_BG_DARK_MAP: Record<EventColor, string> = {
	Blue: "#1e3a5f",
	Green: "#14532d",
	Red: "#7f1d1d",
	Yellow: "#713f12",
	Purple: "#3b0764",
	Orange: "#431407",
};

export function getAccentColor(color: EventColor): string {
	return EVENT_COLOR_MAP[color] ?? "#8b5cf6";
}

export function getGenreBg(color: EventColor, isDark: boolean): string {
	if (isDark) return EVENT_COLOR_BG_DARK_MAP[color] ?? "#3b0764";
	return EVENT_COLOR_BG_MAP[color] ?? "#faf5ff";
}

export function formatMonth(date: Date): string {
	return date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
}

export function formatDay(date: Date): string {
	return date.getDate().toString();
}

export function formatTimeRange(startDate: Date, endDate: Date): string {
	const start = startDate.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
	});
	const end = endDate.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
	});
	return `${start} - ${end}`;
}

export function isEventLive(
	event: { startDate: Date | string; endDate: Date | string },
	now: Date,
): boolean {
	const startDate = new Date(event.startDate);
	const endDate = new Date(event.endDate);
	return startDate <= now && endDate >= now;
}

export function isEventActive(
	event: { endDate: Date | string },
	now: Date,
): boolean {
	return new Date(event.endDate) >= now;
}

export function isWithinThisWeek(date: Date, now: Date): boolean {
	const startOfWeek = new Date(now);
	startOfWeek.setHours(0, 0, 0, 0);
	startOfWeek.setDate(now.getDate() - now.getDay());

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 7);
	return date >= startOfWeek && date < endOfWeek;
}

export function getErrorMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: "Something went wrong loading events.";
}

export function getLocationLabel(event: Pick<Event, "venue" | "address">): string {
	const venue = event.venue?.trim();
	return venue && venue.length > 0 ? venue : event.address;
}
