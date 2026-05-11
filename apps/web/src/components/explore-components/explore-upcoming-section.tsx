import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formatDateBadge,
  formatDateLine,
  formatTimeRange,
  getAttendeeLabel,
  getEventImage,
  getGenreAccent,
  getLocationLabel,
} from "./explore-utils";
import { FavoriteButton, RsvpButton } from "./explore-event-actions";
import type { ExploreEvent, ExploreEventAction } from "./types";

type ExploreUpcomingSectionProps = {
  events: ExploreEvent[];
  attendancePendingEventId: string | null;
  onOpenEvent: ExploreEventAction;
  onToggleAttendance: ExploreEventAction;
  onToggleFavorite: ExploreEventAction;
};

export function ExploreUpcomingSection({
  events,
  attendancePendingEventId,
  onOpenEvent,
  onToggleAttendance,
  onToggleFavorite,
}: ExploreUpcomingSectionProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselCycleCount = Math.min(events.length, 5);
  const canCycleEvents = events.length > 3 && carouselCycleCount > 1;
  const visibleEvents = useMemo(() => {
    if (events.length === 0) return [];

    return Array.from(
      { length: Math.min(3, events.length) },
      (_, index) => events[(carouselIndex + index) % events.length],
    );
  }, [carouselIndex, events]);

  useEffect(() => {
    setCarouselIndex(0);
  }, [events.length]);

  const showPreviousEvents = () => {
    setCarouselIndex((currentIndex) =>
      currentIndex === 0 ? carouselCycleCount - 1 : currentIndex - 1,
    );
  };

  const showNextEvents = () => {
    setCarouselIndex((currentIndex) => (currentIndex + 1) % carouselCycleCount);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[var(--explore-heading)]">Upcoming events</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--explore-purple-text)]">
            {canCycleEvents
              ? `${carouselIndex + 1} of ${carouselCycleCount}`
              : `${events.length} shown`}
          </span>
          {canCycleEvents ? (
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Previous upcoming events"
                className="inline-flex size-8 items-center justify-center rounded-[8px] border border-[var(--explore-border)] bg-[var(--explore-card)] text-[var(--explore-purple-text)] transition hover:border-[var(--explore-border-strong)] hover:bg-[var(--explore-purple-soft)]"
                onClick={showPreviousEvents}
                type="button"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                aria-label="Next upcoming events"
                className="inline-flex size-8 items-center justify-center rounded-[8px] border border-[var(--explore-border)] bg-[var(--explore-card)] text-[var(--explore-purple-text)] transition hover:border-[var(--explore-border-strong)] hover:bg-[var(--explore-purple-soft)]"
                onClick={showNextEvents}
                type="button"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-h-[238px] overflow-hidden rounded-[10px] border border-[var(--explore-border)] bg-[var(--explore-card-strong)] shadow-[var(--explore-shadow)]">
        {events.length > 0 ? (
          visibleEvents.map((event) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            const dateBadge = formatDateBadge(startDate);
            const accent = getGenreAccent(event.genre);

            return (
              <article
                className="group grid min-h-[79px] w-full cursor-pointer grid-cols-[54px_86px_minmax(0,1fr)] items-center gap-3 border-b border-[var(--explore-border)] p-3 text-left transition last:border-b-0 hover:bg-[var(--explore-purple-soft)] sm:grid-cols-[56px_92px_minmax(0,1fr)_auto]"
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
                <div className="rounded-[8px] border border-[var(--explore-border)] bg-[var(--explore-purple-soft)] px-2 py-2 text-center">
                  <p className="text-[11px] font-black text-[var(--explore-muted)]">{dateBadge.day}</p>
                  <p className="text-lg font-black text-[var(--explore-heading)]">{dateBadge.date}</p>
                </div>

                <img
                  alt={`${event.title} cover`}
                  className="h-16 w-full rounded-[8px] object-cover"
                  src={getEventImage(event)}
                />

                <div className="min-w-0 space-y-1.5">
                  <h3 className="truncate text-base font-black text-[var(--explore-heading)]">
                    {event.title}
                  </h3>
                  <p className="truncate text-sm text-[var(--explore-muted)]">
                    {getLocationLabel(event)} · {formatDateLine(startDate)} ·{" "}
                    {formatTimeRange(startDate, endDate)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-[7px] px-2.5 py-1 text-xs font-bold ${accent.bg} ${accent.text}`}>
                      {event.genre ?? "Event"}
                    </span>
                  </div>
                </div>

                <div className="col-span-3 flex items-center justify-between gap-3 sm:col-span-1 sm:justify-end">
                  <span className="inline-flex items-center gap-1.5 text-sm text-[var(--explore-text)]">
                    <Users className="size-4 text-[#a98cff]" />
                    {getAttendeeLabel(event.attendeeCount)}
                  </span>
                  <RsvpButton
                    event={event}
                    isPending={attendancePendingEventId === event.id}
                    onToggleAttendance={onToggleAttendance}
                  />
                  <FavoriteButton event={event} onToggleFavorite={onToggleFavorite} />
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-6">
            <p className="text-lg font-black text-[var(--explore-heading)]">No upcoming events found</p>
            <p className="mt-2 text-sm text-[var(--explore-muted)]">
              Try clearing search, day, or genre filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
