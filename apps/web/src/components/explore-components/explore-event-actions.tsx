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
      className="inline-flex size-9 items-center justify-center rounded-[8px] border border-[var(--explore-border)] bg-[var(--explore-card)] text-[var(--explore-text)] transition hover:border-[var(--explore-border-strong)] hover:text-[var(--explore-heading)]"
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
          ? "border-[var(--explore-border-strong)] bg-[var(--explore-purple-soft)] text-[var(--explore-purple-text)]"
          : "border-[var(--explore-border-strong)] bg-transparent text-[var(--explore-purple-text)] hover:bg-[var(--explore-purple-soft)]",
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
