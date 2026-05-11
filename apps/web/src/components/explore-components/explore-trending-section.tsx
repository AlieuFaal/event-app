import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import {
  getAttendeeLabel,
  getEventImage,
  getGenreAccent,
  getLocationLabel,
} from "./explore-utils";
import { FavoriteButton } from "./explore-event-actions";
import type { ExploreEvent, ExploreEventAction } from "./types";

type ExploreTrendingSectionProps = {
  events: ExploreEvent[];
  onOpenEvent: ExploreEventAction;
  onToggleFavorite: ExploreEventAction;
};

export function ExploreTrendingSection({
  events,
  onOpenEvent,
  onToggleFavorite,
}: ExploreTrendingSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-white">What others are going to</h2>
          <span className="text-sm text-[#8d89a5]">Trending by attendee count</span>
        </div>
        <span className="text-sm font-semibold text-[#bf8cff]">
          {events.length > 0 ? "Top picks" : "No trending events"}
        </span>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {events.slice(0, 5).map((event, index) => {
            const accent = getGenreAccent(event.genre);

            return (
              <article
                className={cn(
                  "group relative min-h-[188px] cursor-pointer overflow-hidden rounded-[10px] border border-white/10 bg-[#121520] text-left shadow-[0_18px_60px_rgba(0,0,0,0.2)]",
                  index === 0 && "border-[#8f5cff]/55 shadow-[0_22px_70px_rgba(124,77,255,0.16)]",
                )}
                key={event.id}
                onClick={() => onOpenEvent(event)}
                onKeyDown={(keyboardEvent) => {
                  if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                    keyboardEvent.preventDefault();
                    onOpenEvent(event);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <img
                  alt={`${event.title} cover`}
                  className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  src={getEventImage(event)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060711] via-[#060711]/64 to-[#060711]/10" />
                <div className="relative flex min-h-[188px] flex-col justify-between p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-[7px] bg-black/55 px-2.5 py-1 text-xs font-black text-white">
                      {getAttendeeLabel(event.attendeeCount)}
                    </span>
                    <FavoriteButton event={event} onToggleFavorite={onToggleFavorite} />
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div>
                      <h3 className="truncate text-xl font-black text-white">
                        {event.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#c5c0cf]">
                        <MapPin className="size-3 text-[#a98cff]" />
                        {getLocationLabel(event)}
                      </p>
                    </div>
                    <span className={`inline-flex rounded-[7px] px-2.5 py-1 text-xs font-bold ${accent.bg} ${accent.text}`}>
                      {event.genre ?? "Event"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[10px] border border-white/10 bg-[#121520] p-6">
          <p className="text-lg font-black text-white">No events match your filters</p>
          <p className="mt-2 text-sm text-[#a9a4ba]">
            Trending events will appear here once events have RSVPs.
          </p>
        </div>
      )}
    </section>
  );
}
