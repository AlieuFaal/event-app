import { CheckIcon, Filter, RefreshCcw } from "lucide-react";
import { useState } from "react";
import type { TGenres } from "@/components/calendar/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { Toggle } from "@/components/shadcn/ui/toggle";

interface EventFilterProps<TEvent extends { genre: TGenres | null }> {
	events: TEvent[];
	onFilterChange: (filteredEvents: TEvent[]) => void;
}

export default function EventFilter<TEvent extends { genre: TGenres | null }>({
	events,
	onFilterChange,
}: EventFilterProps<TEvent>) {
	const [selectedGenres, setSelectedGenres] = useState<TGenres[]>([]);

	const genres: TGenres[] = [
		"Hip-Hop",
		"Rock",
		"Indie",
		"Pop",
		"Jazz",
		"Classical",
		"Electronic",
		"Country",
		"Reggae",
		"Blues",
		"Folk",
		"Metal",
		"R&B",
		"Soul",
		"Afrobeat",
		"Punk",
		"Disco",
		"Funk",
		"Gospel",
		"Techno",
		"House",
		"Trance",
		"Dubstep",
		"Ambient",
		"Alternative",
		"Grunge",
		"New Wave",
		"Synthpop",
		"Progressive Rock",
		"Hard Rock",
		"Soft Rock",
		"Acoustic",
		"Instrumental",
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
				<Toggle
					variant="outline"
					className="h-10 gap-2 rounded-xl border-border/60 bg-background/80 px-3 shadow-sm transition hover:bg-accent"
				>
					<Filter className="h-4 w-4" />
					<span className="font-medium text-xs uppercase tracking-wider">
						Filter
					</span>
					{selectedGenres.length > 0 ? (
						<span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-semibold text-[10px] text-primary">
							{selectedGenres.length}
						</span>
					) : null}
				</Toggle>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="max-h-[420px] w-[230px] overflow-y-auto rounded-xl border-border/60 p-1"
			>
				{genres.map((genre, index) => (
					<DropdownMenuItem
						key={index}
						className="flex cursor-pointer items-center gap-2"
						onClick={(e) => {
							e.preventDefault();
							filterEventsBySelectedGenre(genre);
						}}
					>
						<span className="flex w-full items-center justify-between gap-2 capitalize">
							{genre}
							<span>
								{selectedGenres.includes(genre) && (
									<span className="text-primary">
										<CheckIcon className="size-4" />
									</span>
								)}
							</span>
						</span>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={selectedGenres.length === 0}
					className="flex cursor-pointer gap-2"
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
