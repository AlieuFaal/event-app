import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/ui/dialog"
import EventCards from "./event-cards";
import { Label } from "../shadcn/ui/label";

export type Event = {
    title: string;
    description: string | null;
    location: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    userId: string | null;
}

export type User = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: "user" | "artist" | "admin";
}


export default function EventList({ events, users }: { events: Event[], users: User[] }) {
    return (
        <div className="flex flex-col border-2 rounded-2xl shadow-2xl bg-card text-card-foreground p-4">
            <div className="">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-6xl mb-5 mt-5">
                        Events
                    </h1>
                </div>
            </div>
            <Dialog>
                <DialogTrigger>
                    <EventCards events={events} users={users} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] text-card-foreground bg-card">
                    <DialogHeader className="items-center">
                        <DialogTitle className="text-6xl">Event.Title</DialogTitle>
                        <DialogDescription className="text-xl">
                            Event.description
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-10 mb-5">
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">Location:</Label>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">Date:</Label>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1" className="text-xl">Created by:</Label>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
