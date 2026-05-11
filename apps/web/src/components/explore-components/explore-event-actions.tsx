import { cn } from "@/lib/utils";
import { Check, Loader2, Star } from "lucide-react";
import type { ExploreEvent, ExploreEventAction } from "./types";

type FavoriteButtonProps = {
  event: ExploreEvent;
  onToggleFavorite: ExploreEventAction;
};

type RsvpButtonProps = {
  event: ExploreEvent;
  isPending?: boolean;
  onToggleAttendance: ExploreEventAction;
};

export function FavoriteButton({ event, onToggleFavorite }: FavoriteButtonProps) {
  return (
    <button
      aria-label={event.isStarred ? "Remove from favorites" : "Save event"}
      className="inline-flex size-9 items-center justify-center rounded-[8px] border border-white/10 bg-black/25 text-white/80 transition hover:border-[#bf73ff]/55 hover:text-white"
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onToggleFavorite(event);
      }}
      type="button"
    >
      <Star
        className={cn("size-4", event.isStarred && "fill-amber-300 text-amber-300")}
      />
    </button>
  );
}

export function RsvpButton({
  event,
  isPending,
  onToggleAttendance,
}: RsvpButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 min-w-24 items-center justify-center gap-2 rounded-[8px] border px-4 text-sm font-bold transition",
        event.isGoing
          ? "border-[#8f5cff]/70 bg-[#1b1430] text-[#d5c1ff]"
          : "border-[#8f5cff]/70 bg-transparent text-[#caa6ff] hover:bg-[#211936]",
      )}
      disabled={isPending}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onToggleAttendance(event);
      }}
      type="button"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : event.isGoing ? (
        <Check className="size-4" />
      ) : null}
      {event.isGoing ? "Going" : "RSVP"}
    </button>
  );
}
