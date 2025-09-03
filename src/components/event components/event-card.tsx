import { randomImage } from "../../assets";
import { Card, CardContent, CardDescription, CardTitle } from "../shadcn/ui/card";
import { User, Event } from "./event-list";

export default function EventCard({ event, users }: { event: Event, users: User[] }) {

    function getEventCreatorName(event: Event) {

        const creator = users.find((user) => user.id === event.userId);

        return creator ? creator.name : "Unknown";
    }

    function getEventCreatorImage(event: Event) {

        const creator = users.find((user) => user.id === event.userId);
        return creator ? creator.image : randomImage;
    }
    return (
        <Card className="bg-card text-card-foreground flex flex-col shadow-lg transition-all hover:scale-[1.025] border-2">
            <CardContent className="flex flex-row space-x-4">
                <img className="w-36 border-5 rounded-xl" src={randomImage} alt="" />
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
    )
}