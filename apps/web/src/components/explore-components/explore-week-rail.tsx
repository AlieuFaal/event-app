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
        <h2 className="text-xl font-bold text-white">Your week</h2>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {selectedDate ? (
            <button
              className="text-sm font-semibold text-[#bf8cff] transition hover:text-white"
              onClick={() => onDateSelect(null)}
              type="button"
            >
              Clear day
            </button>
          ) : null}
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#d8c7ff] transition hover:text-white"
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
                "min-w-[132px] rounded-[8px] border border-white/10 bg-[#111420]/90 px-4 py-2.5 text-center transition hover:border-[#8f5cff]/55 hover:bg-[#17172a]",
                isSelected && "border-[#bf73ff] bg-[#18142b] shadow-[0_0_0_1px_rgba(191,115,255,0.25)]",
              )}
              key={day.toISOString()}
              onClick={() => onDateSelect(isSelected ? null : day)}
              type="button"
            >
              <p className="text-sm font-black text-white">
                {index === 0 || isToday
                  ? "Today"
                  : day.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <p className="text-xs text-[#a9a4ba]">
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
