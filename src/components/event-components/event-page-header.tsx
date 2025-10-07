import { Input } from "../shadcn/ui/input";
import { Separator } from "../shadcn/ui/separator";
import { EventWithComments, User } from "drizzle/db";

interface EventPageHeaderProps {
    events?: EventWithComments[];
    users: User[];
    searchInput?: string;
}

export default function EventPageHeader({ events, users, searchInput }: EventPageHeaderProps) {
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        searchInput = value;
    
        const filteredEvents = events?.filter((event) =>
            event.title.toLowerCase().includes(searchInput!) ||
            event.address.toLowerCase().includes(searchInput!) ||
            event.venue?.toLowerCase().includes(searchInput!) ||
            users.some((user) => user.id === event.userId && user.name.toLowerCase().includes(searchInput!))
        );
    
        console.log("Filtered Events:", filteredEvents);
    
        // You can set the filtered events to state or pass it to a parent component as needed.
    }
    

    return (
        <>
            <div className="flex flex-row justify-start items-center m-10 bg-primary space-x-20 p-30 rounded-2xl shadow-lg font-mono">
                <h1 className="text-6xl text-secondary font-bold">
                    ALL EVENTS
                </h1>
                <h2 className="text-lg text-secondary">GOOD THINGS HAPPEN WHEN HAPPY PEOPLE GET TOGETHER...</h2>
            </div>
            <div className="mx-12">
                <Separator className="bg-primary"></Separator>
                <Input className="border-0 h-25" placeholder={`SEARCH FOR EVENTS...`} value={searchInput} onChange={e => {handleSearch(e);}}/>
                <Separator className="bg-primary"></Separator>
            </div>
        </>
    )
}