import { Input } from "../shadcn/ui/input";

interface EventPageHeaderProps {
    searchInput: string;
    onSearchChange: (value: string) => void;
}

export default function FavEventPageHeader({ searchInput, onSearchChange }: EventPageHeaderProps) {

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    }

    return (
        <>
            <div className="flex flex-row justify-start items-center m-10 bg-primary space-x-20 p-20 rounded-lg shadow-2xl font-mono">
                <h1 className="text-7xl text-secondary font-bold">
                    FAVORITE EVENTS
                </h1>
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
        </>
    )
}