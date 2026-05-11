import { AddEditEventDialog } from "@/components/calendar/dialogs/add-edit-event-dialog";
import CommentSection from "@/components/event-components/event-comment-section";
import { Button } from "@/components/shadcn/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/ui/dialog";
import { cn } from "@/lib/utils";
import type { User } from "@vibespot/database/schema";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  PencilLine,
  Star,
  Theater,
  User2,
  Users,
  X,
} from "lucide-react";
import {
  formatDateLine,
  formatTimeRange,
  getAttendeeLabel,
  getCreatorName,
  getEventImage,
  getGenreAccent,
  getGoogleMapsHref,
  getLocationLabel,
} from "./explore-utils";
import { RsvpButton } from "./explore-event-actions";
import type { ExploreEvent, ExploreEventAction } from "./types";

type ExploreEventDialogProps = {
  attendancePendingEventId: string | null;
  currentUser: User | null;
  event: ExploreEvent | null;
  open: boolean;
  users: User[];
  onOpenChange: (open: boolean) => void;
  onProfileOpen: (userId: string) => void;
  onToggleAttendance: ExploreEventAction;
  onToggleFavorite: ExploreEventAction;
};

export function ExploreEventDialog({
  attendancePendingEventId,
  currentUser,
  event,
  open,
  users,
  onOpenChange,
  onProfileOpen,
  onToggleAttendance,
  onToggleFavorite,
}: ExploreEventDialogProps) {
  if (!event) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const accent = getGenreAccent(event.genre);
  const canEditEvent = Boolean(
    currentUser &&
      (currentUser.id === event.userId ||
        String(currentUser.role).toLowerCase() === "admin"),
  );
  const creatorUserId = event.userId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="dark max-h-[90vh] overflow-hidden border-white/10 bg-[#111420] p-0 text-white sm:max-w-[920px]"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>

        <div className="relative min-h-[260px] overflow-hidden border-b border-white/10">
          <img
            alt={`${event.title} cover`}
            className="absolute inset-0 size-full object-cover"
            src={getEventImage(event)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070813]/95 via-[#070813]/78 to-[#070813]/30" />
          <div className="relative z-10 flex min-h-[260px] flex-col justify-between p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <span className={`rounded-[7px] px-3 py-1.5 text-xs font-black ${accent.bg} ${accent.text}`}>
                {event.genre ?? "Event"}
              </span>

              <div className="flex items-center gap-2">
                {canEditEvent ? (
                  <AddEditEventDialog event={event}>
                    <Button
                      className="h-9 rounded-[8px] border border-white/15 bg-black/25 px-3 text-xs font-bold text-white hover:bg-white/10"
                      size="sm"
                      variant="ghost"
                    >
                      <PencilLine className="size-3.5" />
                      Edit
                    </Button>
                  </AddEditEventDialog>
                ) : null}
                <button
                  aria-label={event.isStarred ? "Remove from favorites" : "Save event"}
                  className="inline-flex size-9 items-center justify-center rounded-[8px] border border-white/15 bg-black/25 text-white transition hover:bg-white/10"
                  onClick={() => onToggleFavorite(event)}
                  type="button"
                >
                  <Star
                    className={cn(
                      "size-4",
                      event.isStarred && "fill-amber-300 text-amber-300",
                    )}
                  />
                </button>
                <DialogClose asChild>
                  <button
                    aria-label="Close event details"
                    className="inline-flex size-9 items-center justify-center rounded-[8px] border border-white/15 bg-black/25 text-white transition hover:bg-white/10"
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                </DialogClose>
              </div>
            </div>

            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9d87cf]">
                Event details
              </p>
              <h2 className="text-4xl font-black leading-tight tracking-normal text-white sm:text-5xl">
                {event.title}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-[#d7d2e1]">
                {event.description || "No description available."}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <RsvpButton
                  event={event}
                  isPending={attendancePendingEventId === event.id}
                  onToggleAttendance={onToggleAttendance}
                />
                <a
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-white/15 bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/15"
                  href={getGoogleMapsHref(event)}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight className="size-4" />
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(90vh-260px)] overflow-y-auto px-5 py-5 sm:px-7">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <InfoRow
                icon={<CalendarDays className="size-4" />}
                label="Date"
                value={formatDateLine(startDate)}
              />
              <InfoRow
                icon={<Clock3 className="size-4" />}
                label="Time"
                value={formatTimeRange(startDate, endDate)}
              />
              <InfoRow
                icon={<MapPin className="size-4" />}
                label="Address"
                value={event.address}
              />
              {event.venue ? (
                <InfoRow
                  icon={<Theater className="size-4" />}
                  label="Venue"
                  value={getLocationLabel(event)}
                />
              ) : null}
              <InfoRow
                action={
                  creatorUserId ? (
                  <button
                    className="text-xs font-bold text-[#bf8cff] transition hover:text-white"
                    onClick={() => onProfileOpen(creatorUserId)}
                    type="button"
                  >
                    Go to profile
                  </button>
                  ) : undefined
                }
                icon={<User2 className="size-4" />}
                label="Creator"
                value={getCreatorName(event, users)}
              />
              <InfoRow
                icon={<Users className="size-4" />}
                label="RSVPs"
                value={getAttendeeLabel(event.attendeeCount)}
              />
            </div>

            <div className="rounded-[10px] border border-white/10 bg-black/15 p-4">
              <CommentSection
                currentUser={currentUser}
                event={event}
                users={users}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  action,
  icon,
  label,
  value,
}: {
  action?: ReactNode;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-white/10 bg-black/15 p-4">
      <div className="mt-0.5 rounded-[8px] bg-[#8f5cff]/15 p-2 text-[#c4a7ff]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#807b91]">
            {label}
          </p>
          {action}
        </div>
        <p className="mt-1 break-words text-sm font-semibold text-[#e9e4f2]">
          {value}
        </p>
      </div>
    </div>
  );
}
