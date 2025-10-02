import { DiscJockeyImage } from "../../assets";
import { Card, CardContent, CardDescription, CardTitle } from "../shadcn/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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

export default function FavoriteEventCard({ favoriteEvent, users }: { favoriteEvent: EventWithComments, users: User[] }) {
    const router = useRouter()

    function getEventCreatorName(favoriteEvent: EventWithComments) {

        const creator = users.find((user) => user.id === favoriteEvent.userId);

        return creator ? creator.name : m.event_creator_unknown();
    }

    function getEventCreatorImage(favoriteEvent: EventWithComments) {

        const creator = users.find((user) => user.id === favoriteEvent.userId);
        return creator ? creator.image : DiscJockeyImage;
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
    return (
        <Dialog>
            <DialogTrigger className="w-full">
                <Card className="bg-card text-card-foreground flex flex-col shadow-lg transition-all hover:scale-[1.025] border-2">
                    <CardContent className="flex flex-row space-x-16">
                        <img className="w-48 border-5 rounded-xl" src={DiscJockeyImage} alt="" />
                        <div className="flex flex-col justify-center">
                            <CardTitle className="text-5xl">{favoriteEvent.title}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-amber-50 text-xl mt-5">{favoriteEvent.description}</CardDescription>
                            <CardDescription className="text-gray-600 dark:text-amber-50 text-lg mt-5">{favoriteEvent.address}</CardDescription>
                        </div>
                    </CardContent>
                    <div className="absolute top-3 right-3">
                        <Button
                            className=""
                            variant={"outline"}
                            size={"icon"}
                            onClick={(e) => {
                                addOrRemoveFavorite();
                                e.stopPropagation(); // Förhindra att dialogen öppnas när knappen klickas
                            }}
                        >
                            <Star fill={favoriteEvent.isStarred ? "yellow" : "none"} color={favoriteEvent.isStarred ? "yellow" : "currentColor"} />
                        </Button>
                    </div>
                    <div className="justify-items-end-safe mx-5 " >
                        <CardDescription className="text-gray-600 dark:text-amber-50 text-lg">{favoriteEvent.startDate.toUTCString()}</CardDescription>
                        <div className="">
                            {<p className="text-gray-600 dark:text-amber-50">{m.event_created_by()} {getEventCreatorName(favoriteEvent)}</p>}
                            {/* <Avatar className="h-7 w-7">
                            <AvatarImage src={getfavoriteEventCreatorImage(e) ?? undefined} alt="" />
                            </Avatar> */}
                        </div>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] text-card-foreground bg-card max-h-screen">
                <DialogHeader className="items-center space-y-2 mb-5">
                    <DialogTitle className="text-6xl">{favoriteEvent.title}</DialogTitle>
                    <DialogDescription className="text-xl">
                        {favoriteEvent.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-10 mb-5">
                    <div className="grid gap-3">
                        <Label htmlFor="username-1" className="text-xl">Location: {favoriteEvent.address}</Label>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="username-1" className="text-xl">Date: {favoriteEvent.startDate.toUTCString()} - {favoriteEvent.endDate.toUTCString()}</Label>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="username-1" className="text-xl">Created by: {getEventCreatorName(favoriteEvent)}</Label>
                    </div>
                </div>
                <CommentSection users={users} event={favoriteEvent} />
            </DialogContent>
        </Dialog>
    )
}