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
import CommentSection from "./event-comment-section";
import { Event, EventWithComments, User } from "drizzle/db";
import { Button } from "../shadcn/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import { addFavoriteEventFn, removeFavoriteEventFn } from "@/services/eventService";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { m } from "@/paraglide/messages";

export default function EventCard({ event, users }: { event: EventWithComments, users: User[] }) {
    const addFavoriteEvent = useServerFn(addFavoriteEventFn)
    const removeFavoriteEvent = useServerFn(removeFavoriteEventFn)
    const [dialogOpen, setDialogOpen] = useState(false);
    
    const [isStarred, setIsStarred] = useState(false);

    function getEventCreatorName(event: Event) {

        const creator = users.find((user) => user.id === event.userId);

        return creator ? creator.name : m.event_creator_unknown();
    }

    function getEventCreatorImage(event: Event) {

        const creator = users.find((user) => user.id === event.userId);
        return creator ? creator.image : DiscJockeyImage;
    }

    async function addOrRemoveFavorite() {
        if (!event.id) {
            console.error("Event ID is undefined");
            toast.error(m.toast_event_not_found());
            return;
        } // om event ID är undefined, skicka en toast som felmeddelar användaren
        console.log("Adding favorite for event ID:", event.id);
        if (!event.isStarred && event.id) { // om stjärnan inte är ifylld, försök att lägga till eventet som favorit, om det misslyckas, skicka en toast som felmeddelar användaren
            try {
                await addFavoriteEvent({
                    data: {
                        eventId: event.id,
                    }
                });
                setIsStarred(true);
                event.isStarred = true; // Uppdatera event objektet direkt
                toast.success(m.toast_favorite_added());
            } catch (error) {
                console.error("Failed to add event to favorites:", error);
                toast.error(m.toast_favorite_add_failed());
            }
        } else // annars om setIsStarred är True och event.id inte saknas, ta bort eventet från favoriter.
            if (event.isStarred && event.id) {
                try {
                    await removeFavoriteEvent({
                        data: {
                            id: event.id,
                        }
                    });
                    setIsStarred(false);
                    event.isStarred = false; // Uppdatera event objektet direkt
                    toast.success(m.toast_favorite_removed());
                } catch (error) {
                    console.error("Failed to remove event from favorites:", error);
                    toast.error(m.toast_favorite_remove_failed());
                } // försök att ta bort eventet från favoriter, om det misslyckas, skicka en toast som felmeddelar användaren
            }
    }


    return (
        <>
            <Card onClick={() => setDialogOpen(true)} className="bg-card text-card-foreground flex flex-col shadow-lg transition-all hover:scale-[1.025] border-2">
                <CardContent className="flex flex-row space-x-16">
                    <img className="w-48 border-5 rounded-xl" src={DiscJockeyImage} alt="" />
                    <div className="flex flex-col justify-center">
                        <CardTitle className="text-5xl">{event.title}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-amber-50 text-xl mt-5">{event.description}</CardDescription>
                        <CardDescription className="text-gray-600 dark:text-amber-50 text-lg mt-5">{event.address}</CardDescription>
                    </div>
                </CardContent>
                <Button
                    className="absolute top-3 right-3"
                    variant={"outline"}
                    size={"icon"}
                    onClick={(e) => {
                        addOrRemoveFavorite();
                        e.stopPropagation(); // Förhindra att dialogen öppnas när knappen klickas
                    }}
                >
                    <Star fill={event.isStarred ? "yellow" : "none"} color={event.isStarred ? "yellow" : "currentColor"} />
                </Button>
                <div className="justify-items-end-safe mx-5 " >
                    <CardDescription className="text-gray-600 dark:text-amber-50 text-lg">{event.startDate.toUTCString()}</CardDescription>
                    <div className="">
                        {<p className="text-gray-600 dark:text-amber-50">{m.event_created_by()} {getEventCreatorName(event)}</p>}
                        {/* <Avatar className="h-7 w-7">
                            <AvatarImage src={getEventCreatorImage(e) ?? undefined} alt="" />
                            </Avatar> */}
                    </div>
                </div>
            </Card>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[800px] text-card-foreground bg-card max-h-screen">
                    <DialogHeader className="items-center space-y-2 mb-5">
                        <DialogTitle className="text-6xl">{event.title}</DialogTitle>
                        <DialogDescription className="text-xl">
                            {event.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-10 mb-5">
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">{m.event_address_label()} {event.address}</Label>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">{m.event_date_label()} {event.startDate.toUTCString()} - {event.endDate.toUTCString()}</Label>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">{m.event_created_by()} {getEventCreatorName(event)}</Label>
                        </div>
                    </div>
                    <CommentSection users={users} event={event} />
                </DialogContent>
            </Dialog>
        </>

    )
}