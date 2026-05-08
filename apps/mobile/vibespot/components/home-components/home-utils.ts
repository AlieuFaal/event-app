import {
  PlaceholderImage1,
  PlaceholderImage2,
  PlaceholderImage3,
  PlaceholderImage4,
  PlaceholderImage5,
  PlaceholderImage6,
} from "@/assets";
import type { EventWithAttendance } from "@/types/event";
import { useRouter } from "expo-router";

const fallbackImages = [
  PlaceholderImage1,
  PlaceholderImage2,
  PlaceholderImage3,
  PlaceholderImage4,
  PlaceholderImage5,
  PlaceholderImage6,
];

const HERO_MESSAGE_ROTATION_MS = 1000 * 60 * 60 * 6;

const heroMessages = [
  { lead: "Find the night,", endMark: "." },
  { lead: "Catch the moment,", endMark: "." },
  { lead: "Pick your spot,", endMark: "." },
  { lead: "Find your vibe,", endMark: "." },
  { lead: "Step into the sound,", endMark: "." },
  { lead: "Tonight is yours,", endMark: "." },
  { lead: "Get to moving,", endMark: "." },
] as const;

export function getFallbackImage(eventId: string) {
  const imageIndex = eventId
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);
  return fallbackImages[imageIndex % fallbackImages.length];
}

export function getEventImageSource(event: EventWithAttendance) {
  return event.imageUrl ? { uri: event.imageUrl } : getFallbackImage(event.id);
}

export function getFirstName(userName?: string | null) {
  const trimmedName = userName?.trim();
  if (!trimmedName) return "there";
  return trimmedName.split(/\s+/)[0];
}

export function getHomeHeroMessage(now: Date) {
  const messageIndex =
    Math.floor(now.getTime() / HERO_MESSAGE_ROTATION_MS) % heroMessages.length;
  return heroMessages[messageIndex];
}

export function formatDateHeading(date: Date) {
  return date
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
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

export function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function getWeekDays(now: Date) {
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date;
  });
}

export function openEventDetails(
  router: ReturnType<typeof useRouter>,
  eventId: string,
) {
  router.push({
    pathname: "/(protected)/event-details/[id]",
    params: { id: eventId },
  });
}
