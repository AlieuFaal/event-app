import { Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGenreAccent } from "./explore-utils";

type ExploreGenreSectionProps = {
	genres: Array<{ genre: string; count: number }>;
	selectedGenres: string[];
	onGenreToggle: (genre: string) => void;
	onClearGenres: () => void;
};

export function ExploreGenreSection({
	genres,
	selectedGenres,
	onGenreToggle,
	onClearGenres,
}: ExploreGenreSectionProps) {
	return (
		<section className="space-y-4" id="explore-genres">
			<div className="flex items-center justify-between gap-4">
				<h2 className="font-bold text-[var(--explore-heading)] text-xl">
					Browse by genre
				</h2>
				{selectedGenres.length > 0 ? (
					<button
						className="font-semibold text-[var(--explore-purple-text)] text-sm transition hover:text-[var(--explore-heading)]"
						onClick={onClearGenres}
						type="button"
					>
						Clear genres
					</button>
				) : null}
			</div>

			<div className="flex flex-wrap gap-3">
				{genres.map(({ genre, count }) => {
					const accent = getGenreAccent(genre);
					const isSelected = selectedGenres.includes(genre);

					return (
						<button
							className={cn(
								"inline-flex h-12 items-center gap-3 rounded-[8px] border border-[var(--explore-border)] bg-[var(--explore-card)] px-4 font-semibold text-[var(--explore-text)] text-sm transition hover:border-[var(--explore-border-strong)] hover:bg-[var(--explore-purple-soft)]",
								isSelected &&
									"border-[var(--explore-border-strong)] bg-[var(--explore-purple-soft)] text-[var(--explore-heading)]",
							)}
							key={genre}
							onClick={() => onGenreToggle(genre)}
							type="button"
						>
							<span
								className={`inline-flex size-7 items-center justify-center rounded-[7px] ${accent.bg} ${accent.text}`}
							>
								<Music2 className="size-4" />
							</span>
							{genre}
							<span className="text-[var(--explore-faint)] text-xs">
								{count}
							</span>
						</button>
					);
				})}
			</div>
		</section>
	);
}
