import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatEndsIn,
  formatStartsIn,
  formatTimeRange,
  getAttendeeLabel,
  getEventImage,
  getGenreAccent,
  getLocationLabel,
} from "./explore-utils";
import { FavoriteButton } from "./explore-event-actions";
import type { ExploreEvent, ExploreEventAction } from "./types";

type ExploreLiveSectionProps = {
  liveEvents: ExploreEvent[];
  nextEvent?: ExploreEvent;
  now: Date;
  onOpenEvent: ExploreEventAction;
  onToggleFavorite: ExploreEventAction;
};

export function ExploreLiveSection({
  liveEvents,
  nextEvent,
  now,
  onOpenEvent,
  onToggleFavorite,
}: ExploreLiveSectionProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredEvent = liveEvents[featuredIndex] ?? liveEvents[0];
  const hasMultipleLiveEvents = liveEvents.length > 1;

  useEffect(() => {
    setFeaturedIndex(0);
  }, [liveEvents.length]);

  const showPreviousEvent = () => {
    setFeaturedIndex((currentIndex) =>
      currentIndex === 0 ? liveEvents.length - 1 : currentIndex - 1,
    );
  };

  const showNextEvent = () => {
    setFeaturedIndex((currentIndex) => (currentIndex + 1) % liveEvents.length);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--explore-heading)]">
          <span className="size-2 rounded-full bg-[#f04e5f] shadow-[0_0_18px_rgba(240,78,95,0.8)]" />
          Happening now
        </h2>
        <span className="rounded-md bg-[#f04e5f]/15 px-2.5 py-1 text-xs font-black uppercase tracking-normal text-[#ff8b97]">
          Live
        </span>
      </div>

      {featuredEvent ? (
        <article
          className="group relative min-h-[238px] w-full cursor-pointer overflow-hidden rounded-[10px] border border-white/10 bg-[#121520] text-left shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
          onClick={() => onOpenEvent(featuredEvent)}
          onKeyDown={(keyboardEvent) => {
            if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
              keyboardEvent.preventDefault();
              onOpenEvent(featuredEvent);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <img
            alt={`${featuredEvent.title} cover`}
            className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]"
            src={getEventImage(featuredEvent)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070813]/95 via-[#070813]/70 to-[#070813]/15" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#070813] to-transparent" />

          <div className="relative flex min-h-[238px] flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#d83748]/90 px-2.5 py-1 text-xs font-black text-white">
                  <span className="size-1.5 rounded-full bg-white" />
                  LIVE
                </span>
                <span className="text-sm font-medium text-[#c9c4d7]">
                  {formatEndsIn(new Date(featuredEvent.endDate), now)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasMultipleLiveEvents ? (
                  <>
                    <button
                      aria-label="Previous live event"
                      className="inline-flex size-9 items-center justify-center rounded-[8px] border border-white/10 bg-black/25 text-white/80 transition hover:border-[#bf73ff]/55 hover:text-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        showPreviousEvent();
                      }}
                      type="button"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      aria-label="Next live event"
                      className="inline-flex size-9 items-center justify-center rounded-[8px] border border-white/10 bg-black/25 text-white/80 transition hover:border-[#bf73ff]/55 hover:text-white"
                      onClick={(event) => {
                        event.stopPropagation();
                        showNextEvent();
                      }}
                      type="button"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </>
                ) : null}
                <FavoriteButton event={featuredEvent} onToggleFavorite={onToggleFavorite} />
              </div>
            </div>

            <div className="max-w-xl space-y-3">
              <div>
                <h3 className="text-2xl font-black tracking-normal text-white sm:text-3xl">
                  {featuredEvent.title}
                </h3>
                <p className="mt-2 text-sm text-[#d3cede]">
                  {getLocationLabel(featuredEvent)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[#c4bfd1]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-[#a98cff]" />
                  {featuredEvent.address}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4 text-[#a98cff]" />
                  {getAttendeeLabel(featuredEvent.attendeeCount)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <GenrePill genre={featuredEvent.genre} />
                <span className="inline-flex items-center gap-1.5 rounded-[7px] bg-white/10 px-3 py-1.5 text-xs font-bold text-[#e7e0f6]">
                  <CalendarDays className="size-3.5" />
                  {formatTimeRange(
                    new Date(featuredEvent.startDate),
                    new Date(featuredEvent.endDate),
                  )}
                </span>
                <span className="rounded-[8px] bg-[#7c4dff] px-4 py-2 text-sm font-black text-white">
                  View event
                </span>
              </div>

              {hasMultipleLiveEvents ? (
                <div className="flex items-center gap-1.5">
                  {liveEvents.map((event, index) => (
                    <span
                      className={
                        index === featuredIndex
                          ? "h-1.5 w-5 rounded-full bg-[#bf73ff]"
                          : "size-1.5 rounded-full bg-white/25"
                      }
                      key={event.id}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </article>
      ) : (
        <div className="rounded-[10px] border border-[var(--explore-border)] bg-[var(--explore-card)] p-6 shadow-[var(--explore-shadow)]">
          <p className="text-xl font-black text-[var(--explore-heading)]">Nothing live right now</p>
          <p className="mt-2 text-sm text-[var(--explore-muted)]">
            {nextEvent
              ? `${nextEvent.title} is next up. ${formatStartsIn(new Date(nextEvent.startDate), now)}.`
              : "New events will show up here when they are live."}
          </p>
        </div>
      )}
    </section>
  );
}

function GenrePill({ genre }: { genre?: string | null }) {
  const accent = getGenreAccent(genre);

  return (
    <span className={`rounded-[7px] px-3 py-1.5 text-xs font-bold ${accent.bg} ${accent.text}`}>
      {genre ?? "Event"}
    </span>
  );
}
