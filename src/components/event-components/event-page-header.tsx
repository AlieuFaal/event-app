import { Input } from "../shadcn/ui/input";
import { Separator } from "../shadcn/ui/separator";

interface EventPageHeaderProps {
    searchInput: string;
    onSearchChange: (value: string) => void;
}

export default function EventPageHeader({ searchInput, onSearchChange }: EventPageHeaderProps) {
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
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
                <Separator className="bg-primary rounded-lg"></Separator>
                <Input 
                    className="border-0 h-25" 
                    placeholder="SEARCH FOR EVENTS..." 
                    value={searchInput} 
                    onChange={handleSearch}
                />
                <Separator className="bg-primary rounded-lg"></Separator>
            </div>
        </>
    )
}