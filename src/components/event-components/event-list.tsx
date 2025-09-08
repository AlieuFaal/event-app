import EventCards from "./event-cards";

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
            <EventCards events={events} users={users} />
        </div>
    )
}
