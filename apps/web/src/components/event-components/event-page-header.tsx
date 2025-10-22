import { Input } from "../shadcn/ui/input";

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
            <div className="flex flex-col min-w-md">
                <div className="flex flex-row justify-start items-center m-10 bg-primary space-x-20 p-15 rounded-lg shadow-2xl font-mono">
                    <h1 className="text-7xl text-secondary font-bold">
                        ALL EVENTS
                    </h1>
                    <h2 className="text-lg text-secondary font-mono not-sm:hidden">GOOD THINGS HAPPEN WHEN HAPPY PEOPLE GET TOGETHER...</h2>
                </div>
                <div className="mx-10">
                    {/* <Separator className="bg-primary rounded-lg"></Separator> */}
                    <Input
                        className="border-1 h-20 shadow-md"
                        placeholder="SEARCH FOR EVENTS..."
                        value={searchInput}
                        onChange={handleSearch}
                        style={{ fontSize: '1.2rem', marginTop: '1rem', marginBottom: '1rem', borderRadius: '1.0rem', }}
                    />
                    {/* <Separator className="bg-primary rounded-lg"></Separator> */}
                </div>
            </div>
        </>
    )
}