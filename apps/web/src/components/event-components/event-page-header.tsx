import { MusicIcon, Search } from "lucide-react";
import { Input } from "../shadcn/ui/input";

interface EventPageHeaderProps {
	searchInput: string;
	onSearchChange: (value: string) => void;
	filterSlot?: React.ReactNode;
	resultsCount: number;
}

export default function EventPageHeader({
	searchInput,
	onSearchChange,
	filterSlot,
	resultsCount,
}: EventPageHeaderProps) {
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearchChange(e.target.value);
	};

	return (
		<section className="relative px-4 py-7 sm:px-8 sm:py-8 lg:px-[60px]">
			<div className="relative space-y-6 sm:space-y-7">
				<div className="space-y-3">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary text-xs uppercase tracking-[0.18em]">
						<MusicIcon size={18} />
						Curated nights
					</div>
					<div className="space-y-2">
						<h1 className="font-black text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
							Discover events that match your vibe
						</h1>
						<p className="max-w-3xl text-muted-foreground text-sm sm:text-base">
							A fresh lineup of experiences, artists and venues — filtered to
							what actually feels worth showing up for.
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
						{filterSlot}
						<span className="rounded-full border border-border/60 bg-background/70 px-3 py-2 text-muted-foreground text-xs">
							{resultsCount} results
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
