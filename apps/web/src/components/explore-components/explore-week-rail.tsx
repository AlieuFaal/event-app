import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import type { ExploreEvent } from "./types";
import { getRollingWeek, isSameDay } from "./explore-utils";

type ExploreWeekRailProps = {
  events: ExploreEvent[];
  now: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
};

export function ExploreWeekRail({
  events,
  now,
  selectedDate,
  onDateSelect,
}: ExploreWeekRailProps) {
  const days = getRollingWeek(now);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[var(--explore-heading)]">Your week</h2>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {selectedDate ? (
            <button
              className="text-sm font-semibold text-[var(--explore-purple-text)] transition hover:text-[var(--explore-heading)]"
              onClick={() => onDateSelect(null)}
              type="button"
            >
              Clear day
            </button>
          ) : null}
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--explore-purple-text)] transition hover:text-[var(--explore-heading)]"
            to="/event-calendar"
          >
            View full calendar
            <CalendarDays className="size-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(7,minmax(132px,1fr))] gap-1 overflow-x-auto pb-1">
        {days.map((day, index) => {
          const eventCount = events.filter((event) =>
            isSameDay(new Date(event.startDate), day),
          ).length;
          const isToday = isSameDay(day, now);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

          return (
            <button
              className={cn(
                "min-w-[132px] rounded-[8px] border border-[var(--explore-border)] bg-[var(--explore-card)] px-4 py-2.5 text-center transition hover:border-[var(--explore-border-strong)] hover:bg-[var(--explore-card-strong)]",
                isSelected && "border-[var(--explore-border-strong)] bg-[var(--explore-purple-soft)] shadow-[0_0_0_1px_rgba(191,115,255,0.25)]",
              )}
              key={day.toISOString()}
              onClick={() => onDateSelect(isSelected ? null : day)}
              type="button"
            >
              <p className="text-sm font-black text-[var(--explore-heading)]">
                {index === 0 || isToday
                  ? "Today"
                  : day.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <p className="text-xs text-[var(--explore-muted)]">
                {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p
                className={cn(
                  "mt-1.5 text-xs font-semibold",
                  eventCount > 0 ? "text-[#bf73ff]" : "text-[#747087]",
                )}
              >
                {eventCount === 1 ? "1 event" : `${eventCount} events`}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
