import {
	PlaceholderImage1,
	PlaceholderImage2,
	PlaceholderImage3,
	PlaceholderImage4,
	PlaceholderImage5,
  PlaceholderImage6,
  PlaceholderImage7,
  PlaceholderImage8,
} from "@/assets";
import type { ExploreEvent, ExploreUser } from "./types";

const fallbackImages = [
	PlaceholderImage1,
	PlaceholderImage2,
	PlaceholderImage3,
	PlaceholderImage4,
	PlaceholderImage5,
  PlaceholderImage6,
  PlaceholderImage7,
  PlaceholderImage8,
];

const genreAccentByName: Record<
	string,
	{ bg: string; text: string; dot: string }
> = {
	Electronic: {
		bg: "bg-cyan-500/15",
		text: "text-cyan-200",
		dot: "bg-cyan-400",
	},
	House: { bg: "bg-blue-500/15", text: "text-blue-200", dot: "bg-blue-400" },
	Techno: { bg: "bg-sky-500/15", text: "text-sky-200", dot: "bg-sky-400" },
	"Hip-Hop": {
		bg: "bg-pink-500/15",
		text: "text-pink-200",
		dot: "bg-pink-400",
	},
	Indie: { bg: "bg-amber-500/15", text: "text-amber-200", dot: "bg-amber-400" },
	Jazz: {
		bg: "bg-yellow-500/15",
		text: "text-yellow-200",
		dot: "bg-yellow-400",
	},
	"R&B": { bg: "bg-rose-500/15", text: "text-rose-200", dot: "bg-rose-400" },
	Pop: {
		bg: "bg-fuchsia-500/15",
		text: "text-fuchsia-200",
		dot: "bg-fuchsia-400",
	},
	Rock: { bg: "bg-red-500/15", text: "text-red-200", dot: "bg-red-400" },
	Afrobeat: {
		bg: "bg-emerald-500/15",
		text: "text-emerald-200",
		dot: "bg-emerald-400",
	},
	Ambient: { bg: "bg-teal-500/15", text: "text-teal-200", dot: "bg-teal-400" },
};

export function getGenreAccent(genre?: string | null) {
	if (!genre)
		return {
			bg: "bg-violet-500/15",
			text: "text-violet-200",
			dot: "bg-violet-400",
		};
	return (
		genreAccentByName[genre] ?? {
			bg: "bg-violet-500/15",
			text: "text-violet-200",
			dot: "bg-violet-400",
		}
	);
}

export function getEventImage(event: ExploreEvent) {
	if (event.imageUrl) return event.imageUrl;

	const imageIndex = event.id
		.split("")
		.reduce((total, character) => total + character.charCodeAt(0), 0);

	return fallbackImages[imageIndex % fallbackImages.length];
}

export function getEventCreator(event: ExploreEvent, users: ExploreUser[]) {
	return users.find((user) => user.id === event.userId);
}

export function getCreatorName(event: ExploreEvent, users: ExploreUser[]) {
	return getEventCreator(event, users)?.name ?? "Unknown creator";
}

export function getLocationLabel(
	event: Pick<ExploreEvent, "venue" | "address">,
) {
	const venue = event.venue?.trim();
	return venue && venue.length > 0 ? venue : event.address;
}

export function getGoogleMapsHref(event: ExploreEvent) {
	const latitude = event.latitude?.trim();
	const longitude = event.longitude?.trim();
	const query =
		latitude && longitude ? `${latitude},${longitude}` : event.address;
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function isSameDay(firstDate: Date, secondDate: Date) {
	return (
		firstDate.getFullYear() === secondDate.getFullYear() &&
		firstDate.getMonth() === secondDate.getMonth() &&
		firstDate.getDate() === secondDate.getDate()
	);
}

export function isEventLive(event: ExploreEvent, now: Date) {
	return new Date(event.startDate) <= now && new Date(event.endDate) >= now;
}

export function isWithinThisWeek(date: Date, now: Date) {
	const startOfWeek = new Date(now);
	startOfWeek.setHours(0, 0, 0, 0);
	startOfWeek.setDate(now.getDate() - now.getDay() + 1);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 7);

	return date >= startOfWeek && date < endOfWeek;
}

export function getRollingWeek(now: Date) {
	const today = new Date(now);
	today.setHours(0, 0, 0, 0);

	return Array.from({ length: 7 }, (_, index) => {
		const date = new Date(today);
		date.setDate(today.getDate() + index);
		return date;
	});
}

export function formatDateBadge(date: Date) {
	return {
		day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
		date: date.getDate().toString(),
	};
}

export function formatDateLine(date: Date) {
	return date.toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	});
}

export function formatTimeRange(startDate: Date, endDate: Date) {
	const formatOptions: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "2-digit",
	};

	return `${startDate.toLocaleTimeString("en-US", formatOptions)} - ${endDate.toLocaleTimeString("en-US", formatOptions)}`;
}

export function formatEndsIn(endDate: Date, now: Date) {
	const totalMinutes = Math.max(
		0,
		Math.round((endDate.getTime() - now.getTime()) / 60000),
	);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours <= 0) return `Ends in ${minutes}m`;
	return `Ends in ${hours}h ${minutes}m`;
}

export function formatStartsIn(startDate: Date, now: Date) {
	const totalMinutes = Math.max(
		0,
		Math.round((startDate.getTime() - now.getTime()) / 60000),
	);
	if (totalMinutes < 60) return `Starts in ${totalMinutes}m`;

	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	if (hours < 24) return `Starts in ${hours}h ${minutes}m`;

	const days = Math.floor(hours / 24);
	return `Starts in ${days}d`;
}

export function getAttendeeLabel(count: number) {
	return count === 1 ? "1 going" : `${count.toLocaleString()} going`;
}

export function getEventCountsByGenre(events: ExploreEvent[]) {
	const counts = new Map<string, number>();

	for (const event of events) {
		if (!event.genre) continue;
		counts.set(event.genre, (counts.get(event.genre) ?? 0) + 1);
	}

	return Array.from(counts.entries())
		.map(([genre, count]) => ({ genre, count }))
		.sort((a, b) => a.genre.localeCompare(b.genre));
}
