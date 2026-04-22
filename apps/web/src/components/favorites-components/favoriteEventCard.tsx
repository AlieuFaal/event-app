import {
  PlaceholderImage1,
  PlaceholderImage2,
  PlaceholderImage3,
  PlaceholderImage4,
  PlaceholderImage5,
  PlaceholderImage6,
} from "../../assets";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../shadcn/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/ui/dialog";
import { EventWithComments, User } from "@vibespot/database/schema";
import { Button } from "../shadcn/ui/button";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  PencilLine,
  Star,
  Theater,
  User2,
  X,
} from "lucide-react";
import CommentSection from "../event-components/event-comment-section";
import { toast } from "sonner";
import {
  addFavoriteEventFn,
  removeFavoriteEventFn,
} from "@/services/eventService";
import { useRouter } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";
import React from "react";
import { AddEditEventDialog } from "../calendar/dialogs/add-edit-event-dialog";
import { getEventAccent } from "../event-components/event-accent";

export default function FavoriteEventCard({
  favoriteEvent,
  users,
  currentUser,
}: {
  favoriteEvent: EventWithComments;
  users: User[];
  currentUser?: User | null;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const venueLabel = favoriteEvent.venue?.trim();
  const canEditEvent = Boolean(
    currentUser &&
      (currentUser.id === favoriteEvent.userId ||
        String(currentUser.role).toLowerCase() === "admin"),
  );
  const dateLabel = favoriteEvent.startDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const cardDateLabel = favoriteEvent.startDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const timeRangeLabel = `${favoriteEvent.startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${favoriteEvent.endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  const heroRings = [320, 274, 230, 188, 150, 116];
  const accent = getEventAccent(favoriteEvent.color);
  const placeholderImages = [
    PlaceholderImage1,
    PlaceholderImage2,
    PlaceholderImage3,
    PlaceholderImage4,
    PlaceholderImage5,
    PlaceholderImage6,
  ];

  function getEventCreatorName(favoriteEvent: EventWithComments) {
    const creator = users.find((user) => user.id === favoriteEvent.userId);

    return creator ? creator.name : m.event_creator_unknown();
  }

  async function addOrRemoveFavorite() {
    if (!favoriteEvent.id) {
      console.error("favoriteEvent ID is undefined");
      toast.error(m.toast_event_not_found());
      return;
    } // om favoriteEvent ID är undefined, skicka en toast som felmeddelar användaren
    console.log("Adding favorite for favoriteEvent ID:", favoriteEvent.id);
    if (!favoriteEvent.isStarred && favoriteEvent.id) {
      // om stjärnan inte är ifylld, försök att lägga till favoriteEventet som favorit, om det misslyckas, skicka en toast som felmeddelar användaren
      try {
        await addFavoriteEventFn({
          data: {
            eventId: favoriteEvent.id,
          },
        });
        // setIsStarred(true);
        favoriteEvent.isStarred = true; // Uppdatera favoriteEvent
        toast.success(m.toast_favorite_added());
      } catch (error) {
        console.error("Failed to add favoriteEvent to favorites:", error);
        toast.error(m.toast_favorite_add_failed());
      }
    } else if (favoriteEvent.isStarred && favoriteEvent.id) {
      // annars om IsStarred är True och favoriteEvent.id inte saknas, ta bort favoriteEventet från favoriter.
      try {
        await removeFavoriteEventFn({
          data: {
            id: favoriteEvent.id,
          },
        });
        // setIsStarred(false);
        favoriteEvent.isStarred = false; // Uppdatera favoriteEvent
        toast.success(m.toast_favorite_removed());
      } catch (error) {
        console.error("Failed to remove favoriteEvent from favorites:", error);
        toast.error(m.toast_favorite_remove_failed());
      } // försök att ta bort favoriteEventet från favoriter, om det misslyckas, skicka en toast som felmeddelar användaren
    }
    await router.invalidate(); // Invalidera routern för att uppdatera datan
  }

  function getDeterministicImage(seed: string | undefined) {
    if (!seed) {
      return placeholderImages[0];
    }

    const hash = Array.from(seed).reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);

    return placeholderImages[Math.abs(hash) % placeholderImages.length];
  }

  function handleFlyTo(favoriteEvent: EventWithComments) {
    router.navigate({ to: "/event-map", search: { id: favoriteEvent.id } });
  }

  function handleGoToProfile(favoriteEvent: EventWithComments) {
    router.navigate({ to: `/user/${favoriteEvent.userId}` });
  }

  return (
    <>
      <Card
        onClick={() => setDialogOpen(true)}
        className="group relative cursor-pointer overflow-hidden border-border/60 bg-card/80 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block">
              <img
                className="h-24 w-30 rounded-xl object-cover shadow-md"
                src={getDeterministicImage(favoriteEvent.id)}
                alt={`${favoriteEvent.title} cover`}
              />
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-2xl leading-tight tracking-tight">
                    {favoriteEvent.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                    {favoriteEvent.description}
                  </CardDescription>
                </div>

                <Button
                  className="shrink-0 rounded-full hover:cursor-pointer"
                  variant={"ghost"}
                  size={"icon"}
                  onClick={(e) => {
                    addOrRemoveFavorite();
                    e.stopPropagation();
                  }}
                >
                  <Star
                    fill={favoriteEvent.isStarred ? "yellow" : "none"}
                    color={favoriteEvent.isStarred ? "yellow" : "currentColor"}
                  />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={{
                    borderColor: accent.borderSoft,
                    backgroundColor: accent.bgSoft,
                  }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: accent.accent }}
                  />
                  {favoriteEvent.genre}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/35 px-2.5 py-1 text-xs text-muted-foreground">
                  <CalendarDays
                    className="size-3.5"
                    style={{ color: accent.accent }}
                  />
                  {cardDateLabel}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/35 px-2.5 py-1 text-xs text-muted-foreground">
                  <User2
                    className="size-3.5"
                    style={{ color: accent.accent }}
                  />
                  {getEventCreatorName(favoriteEvent)}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/35 px-2.5 py-1 text-xs text-muted-foreground">
                  <MapPin
                    className="size-3.5"
                    style={{ color: accent.accent }}
                  />
                  <span className="max-w-[200px] truncate">
                    {favoriteEvent.address}
                  </span>
                </span>

                {venueLabel ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/35 px-2.5 py-1 text-xs text-muted-foreground">
                    <Theater
                      className="size-3.5"
                      style={{ color: accent.accent }}
                    />
                    <span className="max-w-[200px] truncate">{venueLabel}</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[88vh] overflow-hidden border-border/60 bg-card p-0 text-card-foreground sm:max-w-[860px]"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{favoriteEvent.title}</DialogTitle>
            <DialogDescription>{favoriteEvent.description}</DialogDescription>
          </DialogHeader>

          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#09081a] via-[#11112c] to-[#0a0916] px-6 pb-6 pt-5 sm:px-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#09081a] via-[#09081a]/90 to-transparent" />
            <div className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 opacity-75">
              <div className="relative size-[360px]">
                {heroRings.map((size, index) => (
                  <div
                    key={size}
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-300/30 ${index === 2 ? "animate-pulse" : ""}`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      opacity: 0.5 - index * 0.06,
                    }}
                  />
                ))}
                <div
                  className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    backgroundColor: accent.accent,
                    boxShadow: `0 0 24px ${accent.glow}`,
                  }}
                />
              </div>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider"
                  style={{
                    borderColor: accent.borderSoft,
                    backgroundColor: accent.bgSoft,
                    color: accent.textStrong,
                  }}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: accent.accent }}
                  />
                  {favoriteEvent.genre}
                </span>

                <div className="flex items-center gap-2">
                  {canEditEvent ? (
                    <AddEditEventDialog event={favoriteEvent}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-full border border-white/15 bg-white/5 px-3 text-xs text-white/85 hover:text-white/85 hover:bg-white/10 hover:cursor-pointer"
                      >
                        <PencilLine className="size-3.5" />
                        {m.edit_event_button()}
                      </Button>
                    </AddEditEventDialog>
                  ) : null}

                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full border border-white/15 bg-white/5 text-white/85 hover:text-white/85 hover:bg-white/10 hover:cursor-pointer"
                    >
                      <X className="size-4" />
                    </Button>
                  </DialogClose>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-200/65">
                  Upcoming event
                </p>
                <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {favoriteEvent.title}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-200/80 sm:text-base">
                  {favoriteEvent.description}
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[calc(88vh-290px)] space-y-6 overflow-y-auto px-6 pb-6 pt-5 sm:px-8">
            <div className="divide-y divide-border/60">
              <div className="flex items-start gap-3 py-4">
                <div
                  className="mt-0.5 rounded-md border p-2"
                  style={{
                    borderColor: accent.borderMuted,
                    backgroundColor: accent.bgMuted,
                  }}
                >
                  <CalendarDays
                    className="size-4"
                    style={{ color: accent.accent }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {m.event_date_label()}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {dateLabel}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3
                      className="size-3.5"
                      style={{ color: accent.accent }}
                    />
                    {timeRangeLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <div
                  className="mt-0.5 rounded-md border p-2"
                  style={{
                    borderColor: accent.borderMuted,
                    backgroundColor: accent.bgMuted,
                  }}
                >
                  <MapPin className="size-4" style={{ color: accent.accent }} />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {m.event_address_label()}
                  </p>
                  <p className="text-sm text-foreground">
                    {favoriteEvent.address}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFlyTo(favoriteEvent)}
                  className="mt-0.5 rounded-full border text-foreground transition-transform hover:scale-110 hover:cursor-pointer dark:text-white"
                  style={{
                    borderColor: accent.borderSoft,
                    backgroundColor: accent.bgSoft,
                  }}
                >
                  <ArrowUpRight className="size-4" />
                  Fly to
                </Button>
              </div>

              {venueLabel ? (
                <div className="flex items-start gap-3 py-4">
                  <div
                    className="mt-0.5 rounded-md border p-2"
                    style={{
                      borderColor: accent.borderMuted,
                      backgroundColor: accent.bgMuted,
                    }}
                  >
                    <Theater
                      className="size-4"
                      style={{ color: accent.accent }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {m.form_venue_label()}
                    </p>
                    <p className="text-sm text-foreground">{venueLabel}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex items-start gap-3 py-4">
                <div
                  className="mt-0.5 rounded-md border p-2"
                  style={{
                    borderColor: accent.borderMuted,
                    backgroundColor: accent.bgMuted,
                  }}
                >
                  <User2 className="size-4" style={{ color: accent.accent }} />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {m.event_created_by()}
                  </p>
                  <p className="text-sm text-foreground">
                    {getEventCreatorName(favoriteEvent)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGoToProfile(favoriteEvent)}
                  className="mt-0.5 rounded-full border text-foreground transition-transform hover:scale-110 hover:cursor-pointer dark:text-white"
                  style={{
                    borderColor: accent.borderSoft,
                    backgroundColor: accent.bgSoft,
                  }}
                >
                  <ArrowUpRight className="size-4" />
                  Go To Profile
                </Button>
              </div>
            </div>

            <div className="rounded-sm border border-border/60 bg-background/40 p-4 sm:p-5">
              <CommentSection
                users={users}
                event={favoriteEvent}
                currentUser={currentUser ?? null}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
