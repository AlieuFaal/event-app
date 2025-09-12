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

export default function EventCard({ event, users }: { event: EventWithComments, users: User[] }) {
    
    function getEventCreatorName(event: Event) {

        const creator = users.find((user) => user.id === event.userId);

        return creator ? creator.name : "Unknown";
    }

    function getEventCreatorImage(event: Event) {

        const creator = users.find((user) => user.id === event.userId);
        return creator ? creator.image : DiscJockeyImage;
    }
    return (
        <Dialog>
            <DialogTrigger className="w-full">
                <Card className="bg-card text-card-foreground flex flex-col shadow-lg transition-all hover:scale-[1.025] border-2">
                    <CardContent className="flex flex-row space-x-16">
                        <img className="w-48 border-5 rounded-xl" src={DiscJockeyImage} alt="" />
                        <div className="flex flex-col justify-center">
                            <CardTitle className="text-5xl">{event.title}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-amber-50 text-xl mt-5">{event.description}</CardDescription>
                            <CardDescription className="text-gray-600 dark:text-amber-50 text-lg mt-5">{event.location}</CardDescription>
                        </div>
                    </CardContent>
                    <div className="justify-items-end-safe mx-5 " >
                        <CardDescription className="text-gray-600 dark:text-amber-50 text-lg">{event.startDate.toUTCString()}</CardDescription>
                        <div className="">
                            {<p className="text-gray-600 dark:text-amber-50">Created by: {getEventCreatorName(event)}</p>}
                            {/* <Avatar className="h-7 w-7">
                            <AvatarImage src={getEventCreatorImage(e) ?? undefined} alt="" />
                    </Avatar> */}
                        </div>
                    </div>
                </Card>
            </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] text-card-foreground bg-card">
                    <DialogHeader className="items-center space-y-2 mb-5">
                        <DialogTitle className="text-6xl">{event.title}</DialogTitle>
                        <DialogDescription className="text-xl">
                            {event.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-10 mb-5">
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">Location: {event.location}</Label>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">Date: {event.startDate.toUTCString()} - {event.endDate.toUTCString()}</Label>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">Created by: {getEventCreatorName(event)}</Label>
                        </div>
                    </div>
                    <CommentSection users={users} event={event}/>
                    {/* <CommentCard comment={comments ? comments[0] : {
                        id: "1",
                        eventId: event.id,
                        userId: users[0].id,
                        content: "This is a comment",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }} currentUser={users[0]} users={users} onChange={(change) => { console.log(change) }} onDelete={() => { console.log("delete") }} /> */}
                </DialogContent>
        </Dialog>
    )
}