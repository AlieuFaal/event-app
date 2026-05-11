import { cn } from "@/lib/utils";
import { Music2 } from "lucide-react";
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
        <h2 className="text-xl font-bold text-white">Browse by genre</h2>
        {selectedGenres.length > 0 ? (
          <button
            className="text-sm font-semibold text-[#bf8cff] transition hover:text-white"
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
                "inline-flex h-12 items-center gap-3 rounded-[8px] border border-white/10 bg-[#141722] px-4 text-sm font-semibold text-[#d8d4e6] transition hover:border-[#8f5cff]/50 hover:bg-[#19182a]",
                isSelected && "border-[#9b6fff] bg-[#211936] text-white",
              )}
              key={genre}
              onClick={() => onGenreToggle(genre)}
              type="button"
            >
              <span className={`inline-flex size-7 items-center justify-center rounded-[7px] ${accent.bg} ${accent.text}`}>
                <Music2 className="size-4" />
              </span>
              {genre}
              <span className="text-xs text-[#88839c]">{count}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
