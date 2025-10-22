import { PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6 } from "../../assets";
import { Card, CardContent, CardDescription, CardTitle } from "../shadcn/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/ui/dialog"
import { Label } from "../shadcn/ui/label";
import { EventWithComments, User } from "drizzle/db";
import { Button } from "../shadcn/ui/button";
import { Star } from "lucide-react";
import CommentSection from "../event-components/event-comment-section";
import { toast } from "sonner";
import { addFavoriteEventFn, removeFavoriteEventFn } from "@/services/eventService";
import { useRouter } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";
import React from "react";

export default function FavoriteEventCard({ favoriteEvent, users }: { favoriteEvent: EventWithComments, users: User[] }) {
    const router = useRouter()
    const [dialogOpen, setDialogOpen] = React.useState(false);

    function getEventCreatorName(favoriteEvent: EventWithComments) {

        const creator = users.find((user) => user.id === favoriteEvent.userId);

        return creator ? creator.name : m.event_creator_unknown();
    }

    function getEventCreatorImage(favoriteEvent: EventWithComments) {

        const creator = users.find((user) => user.id === favoriteEvent.userId);
        return creator ? creator.image : PlaceholderImage1;
    }

    async function addOrRemoveFavorite() {
        if (!favoriteEvent.id) {
            console.error("favoriteEvent ID is undefined");
            toast.error(m.toast_event_not_found());
            return;
        } // om favoriteEvent ID är undefined, skicka en toast som felmeddelar användaren
        console.log("Adding favorite for favoriteEvent ID:", favoriteEvent.id);
        if (!favoriteEvent.isStarred && favoriteEvent.id) { // om stjärnan inte är ifylld, försök att lägga till favoriteEventet som favorit, om det misslyckas, skicka en toast som felmeddelar användaren
            try {
                await addFavoriteEventFn({
                    data: {
                        eventId: favoriteEvent.id,
                    }
                });
                // setIsStarred(true);
                favoriteEvent.isStarred = true; // Uppdatera favoriteEvent
                toast.success(m.toast_favorite_added());

            } catch (error) {
                console.error("Failed to add favoriteEvent to favorites:", error);
                toast.error(m.toast_favorite_add_failed());
            }
        } else // annars om IsStarred är True och favoriteEvent.id inte saknas, ta bort favoriteEventet från favoriter.
            if (favoriteEvent.isStarred && favoriteEvent.id) {
                try {
                    await removeFavoriteEventFn({
                        data: {
                            id: favoriteEvent.id,
                        }
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
    
    function randomImage() {
        const images = [PlaceholderImage1, PlaceholderImage2, PlaceholderImage3, PlaceholderImage4, PlaceholderImage5, PlaceholderImage6];
        return images[Math.floor(Math.random() * images.length)];
    }

    return (
        <>
            <Card onClick={() => setDialogOpen(true)} className="bg-card/60 text-card-foreground flex flex-col shadow-lg transition-all hover:scale-[1.025] hover:shadow-2xl cursor-pointer relative">
                <CardContent className="flex flex-row space-x-16">
                    <div>
                        <img className="relative top-10 w-50 rounded-xl shadow-2xl" src={randomImage()} alt="" /> {/* Mock för tillfället */}
                    </div>
                    <div className="flex flex-col justify-center bg-muted/70 p-5 rounded-2xl shadow-lg w-160 relative">
                        <CardTitle className="text-3xl">{favoriteEvent.title}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-amber-50 text-xl mt-5">{favoriteEvent.description}</CardDescription>
                        <CardDescription className="text-gray-600 dark:text-amber-50 text-lg mt-5">{favoriteEvent.address}</CardDescription>
                    </div>
                </CardContent>
                <Button
                    className="absolute top-3 right-3"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={(e) => {
                        addOrRemoveFavorite();
                        e.stopPropagation(); // Förhindra att dialogen öppnas när knappen klickas
                    }}
                >
                    <Star fill={favoriteEvent.isStarred ? "yellow" : "none"} color={favoriteEvent.isStarred ? "yellow" : "currentColor"} />
                </Button>
                <div className="flex justify-end">
                    <div className="justify-items-end-safe mx-15 bg-muted/70 rounded-xl shadow-lg w-fit p-3" >
                        <CardDescription className="text-gray-600 dark:text-amber-50 text-lg">{favoriteEvent.startDate.toUTCString()}</CardDescription>
                        <div className="">
                            {<p className="text-gray-600 dark:text-amber-50">{m.event_created_by()} {getEventCreatorName(favoriteEvent)}</p>}
                            {/* <Avatar className="h-7 w-7">
                            <AvatarImage src={getEventCreatorImage(e) ?? undefined} alt="" />
                            </Avatar> */}
                        </div>
                    </div>
                </div>
            </Card>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[800px] text-card-foreground bg-card max-h-screen">
                    <DialogHeader className="items-center space-y-2 mb-5">
                        <DialogTitle className="text-6xl">{favoriteEvent.title}</DialogTitle>
                        <DialogDescription className="text-xl">
                            {favoriteEvent.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-10 mb-5">
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">{m.event_address_label()} {favoriteEvent.address}</Label>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">{m.event_date_label()} {favoriteEvent.startDate.toUTCString()} - {favoriteEvent.endDate.toUTCString()}</Label>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">{m.event_created_by()} {getEventCreatorName(favoriteEvent)}</Label>
                        </div>
                    </div>
                    <CommentSection users={users} event={favoriteEvent} />
                </DialogContent>
            </Dialog>
        </>
    )
}