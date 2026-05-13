import { Search, Star } from "lucide-react";
import { Input } from "../shadcn/ui/input";

interface EventPageHeaderProps {
	searchInput: string;
	onSearchChange: (value: string) => void;
	resultsCount: number;
}

export default function FavoriteEventPageHeader({
	searchInput,
	onSearchChange,
	resultsCount,
}: EventPageHeaderProps) {
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearchChange(e.target.value);
	};

	return (
		<section className="relative overflow-hidden rounded-b-[2rem] px-1 py-4 sm:px-12">
			<div className="pointer-events-none absolute inset-x-8 -top-8 h-52 rounded-full bg-primary/20 blur-3xl dark:bg-primary/30" />

			<div className="relative space-y-6 sm:space-y-7">
				<div className="space-y-3">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary text-xs uppercase tracking-[0.18em]">
						<Star size={18} />
						Personal picks
					</div>
					<div className="space-y-2">
						<h1 className="font-black text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
							Your favorite events!
						</h1>
						<p className="max-w-3xl text-muted-foreground text-sm sm:text-base">
							Your personal lineup of experiences, artists and venues all in one
							place.
						</p>
					</div>
				</div>

				<div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-11 rounded-xl border-border/60 bg-background/80 pl-9 shadow-sm"
							placeholder="Search by title, address, venue or creator..."
							value={searchInput}
							onChange={handleSearch}
						/>
					</div>

					<div className="flex items-center gap-2">
						<span className="rounded-full border border-border/60 bg-background/70 px-3 py-2 text-muted-foreground text-xs">
							{resultsCount} results
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
