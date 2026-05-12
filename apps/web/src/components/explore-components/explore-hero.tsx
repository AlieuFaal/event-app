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
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--explore-border-strong)] bg-[var(--explore-purple-soft)] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--explore-purple-text)]">
          <Sparkles className="size-4" />
          Explore
        </div>
        <div className="space-y-3">
          <h1 className="max-w-[540px] text-[38px] font-black leading-[1.02] tracking-normal text-[var(--explore-heading)] sm:text-[44px] lg:text-[46px]">
            Discover events
            <br />
            that match your{" "}
            <span className="text-[var(--explore-purple)]">vibe</span>
          </h1>
          <p className="max-w-[520px] text-sm leading-6 text-[var(--explore-muted)]">
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
                "h-12 w-full rounded-[8px] border border-[var(--explore-border)] bg-[var(--explore-input)] pl-11 pr-4 text-sm text-[var(--explore-heading)] shadow-[var(--explore-shadow)] outline-none transition",
                "placeholder:text-[var(--explore-faint)] focus:border-[var(--explore-border-strong)] focus:ring-2 focus:ring-[#8f5cff]/20",
              )}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by title, address, venue or creator..."
              value={searchInput}
            />
          </label>

          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-[var(--explore-border-strong)] bg-[var(--explore-card)] px-5 text-sm font-semibold text-[var(--explore-purple-text)] transition hover:border-[#a980ff]/70 hover:bg-[var(--explore-purple-soft)]"
            onClick={onFilterClick}
            type="button"
          >
            <ListFilter className="size-4" />
            Filter
          </button>

          <div className="inline-flex h-12 items-center justify-center rounded-[8px] border border-[var(--explore-border)] bg-[var(--explore-card)] px-5 text-sm font-semibold text-[var(--explore-text)]">
            {resultsCount.toLocaleString()} results
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--explore-faint)]">
          <span>Popular searches:</span>
          {popularSearches.map((search) => (
            <button
              className="rounded-full border border-[var(--explore-border)] bg-[var(--explore-card)] px-3 py-1.5 text-[var(--explore-text)] transition hover:border-[var(--explore-border-strong)] hover:text-[var(--explore-heading)]"
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
