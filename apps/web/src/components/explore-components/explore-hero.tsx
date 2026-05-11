import { cn } from "@/lib/utils";
import { ListFilter, Search, Sparkles } from "lucide-react";

type ExploreHeroProps = {
  searchInput: string;
  resultsCount: number;
  onFilterClick: () => void;
  onSearchChange: (value: string) => void;
};

const popularSearches = ["Tonight", "Live music", "House", "Techno", "Hip-hop"];

export function ExploreHero({
  searchInput,
  resultsCount,
  onFilterClick,
  onSearchChange,
}: ExploreHeroProps) {
  return (
    <section className="grid gap-8 pt-7 lg:grid-cols-[minmax(390px,520px)_minmax(0,1fr)] lg:items-end lg:pt-8">
      <div className="space-y-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#8f5cff]/35 bg-[#8f5cff]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#c9adff]">
          <Sparkles className="size-4" />
          Explore
        </div>
        <div className="space-y-3">
          <h1 className="max-w-[540px] text-[38px] font-black leading-[1.02] tracking-normal text-white sm:text-[44px] lg:text-[46px]">
            Discover events
            <br />
            that match your{" "}
            <span className="text-[#bb73ff]">vibe</span>
          </h1>
          <p className="max-w-[520px] text-sm leading-6 text-[#b9b5c8]">
            A fresh lineup of experiences, artists and venues, filtered to what
            actually feels worth showing up for.
          </p>
        </div>
      </div>

      <div className="space-y-4 lg:pb-2">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search events</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8d89a5]" />
            <input
              className={cn(
                "h-12 w-full rounded-[8px] border border-white/10 bg-[#111420]/90 pl-11 pr-4 text-sm text-white shadow-[0_12px_44px_rgba(0,0,0,0.2)] outline-none transition",
                "placeholder:text-[#8d89a5] focus:border-[#8f5cff]/60 focus:ring-2 focus:ring-[#8f5cff]/20",
              )}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by title, address, venue or creator..."
              value={searchInput}
            />
          </label>

          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[#7f56d9]/45 bg-[#17182a] px-5 text-sm font-semibold text-[#d6c4ff] transition hover:border-[#a980ff]/70 hover:bg-[#201b34]"
            onClick={onFilterClick}
            type="button"
          >
            <ListFilter className="size-4" />
            Filter
          </button>

          <div className="inline-flex h-12 items-center justify-center rounded-[8px] border border-white/10 bg-[#17182a] px-5 text-sm font-semibold text-[#d0ccdc]">
            {resultsCount.toLocaleString()} results
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8d89a5]">
          <span>Popular searches:</span>
          {popularSearches.map((search) => (
            <button
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[#d1cde0] transition hover:border-[#8f5cff]/45 hover:text-white"
              key={search}
              onClick={() => onSearchChange(search)}
              type="button"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
