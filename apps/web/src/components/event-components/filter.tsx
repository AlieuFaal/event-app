import { CheckIcon, Filter, RefreshCcw } from "lucide-react";
import type { TGenres } from "@/components/calendar/types";
import { Separator } from "@radix-ui/react-select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcn/ui/dropdown-menu";
import { Toggle } from "@/components/shadcn/ui/toggle";
import { useState } from "react";
import { EventWithComments } from "drizzle/db";

interface EventFilterProps {
    events: EventWithComments[];
    onFilterChange: (filteredEvents: EventWithComments[]) => void;
}

export default function EventFilter({ events, onFilterChange }: EventFilterProps) {
    const [selectedGenres, setSelectedGenres] = useState<TGenres[]>([]);

    const genres: TGenres[] = [
        "Hip-Hop", "Rock", "Indie", "Pop", "Jazz", "Classical", "Electronic", "Country", "Reggae", "Blues", "Folk", "Metal", "R&B", "Soul", "Afrobeat", "Punk", "Disco", "Funk", "Gospel", "Techno", "House", "Trance", "Dubstep", "Ambient", "Alternative", "Grunge", "New Wave", "Synthpop", "Progressive Rock", "Hard Rock", "Soft Rock", "Acoustic", "Instrumental"
    ];

    const filterEventsBySelectedGenre = (genre: TGenres) => {
        const isGenreSelected = selectedGenres.includes(genre);
        const newGenres = isGenreSelected
            ? selectedGenres.filter((g) => g !== genre)
            : [...selectedGenres, genre];

        if (newGenres.length > 0) {
            const filtered = events.filter((event) => {
                const eventGenre = event.genre || "Indie";
                return newGenres.includes(eventGenre);
            });
            onFilterChange(filtered);
        } else {
            onFilterChange(events);
        }

        setSelectedGenres(newGenres);
    };

    const clearFilter = () => {
        onFilterChange(events);
        setSelectedGenres([]);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Toggle variant="outline" className="cursor-pointer w-fit hover:scale-110 shadow-lg">
                    <Filter className="h-4 w-4" />
                </Toggle>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] max-h-[400px] overflow-y-auto">
                {genres.map((genre, index) => (
                    <DropdownMenuItem
                        key={index}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            filterEventsBySelectedGenre(genre);
                        }}
                    >
                        <span className="capitalize flex justify-between items-center gap-2 w-full">
                            {genre}
                            <span>
                                {selectedGenres.includes(genre) && (
                                    <span className="text-blue-500">
                                        <CheckIcon className="size-4" />
                                    </span>
                                )}
                            </span>
                        </span>
                    </DropdownMenuItem>
                ))}
                <Separator className="my-2" />
                <DropdownMenuItem
                    disabled={selectedGenres.length === 0}
                    className="flex gap-2 cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        clearFilter();
                    }}
                >
                    <RefreshCcw className="size-3.5" />
                    Clear Filter
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
