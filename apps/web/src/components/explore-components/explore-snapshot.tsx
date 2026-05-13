import { CalendarDays, Heart, Radio, Ticket } from "lucide-react";

type ExploreSnapshotProps = {
	goingCount: number;
	liveCount: number;
	savedCount: number;
	thisWeekCount: number;
};

export function ExploreSnapshot({
	goingCount,
	liveCount,
	savedCount,
	thisWeekCount,
}: ExploreSnapshotProps) {
	const stats = [
		{
			icon: Ticket,
			label: "Going",
			value: goingCount,
			hint: `${thisWeekCount} this week`,
			iconClass: "bg-violet-500/15 text-violet-300",
			hintClass: "text-violet-300",
		},
		{
			icon: Heart,
			label: "Saved",
			value: savedCount,
			hint: savedCount === 1 ? "1 saved event" : `${savedCount} saved events`,
			iconClass: "bg-pink-500/15 text-pink-300",
			hintClass: "text-pink-300",
		},
		{
			icon: Radio,
			label: "Live now",
			value: liveCount,
			hint: liveCount > 0 ? "Happening right now" : "Next event below",
			iconClass: "bg-rose-500/15 text-rose-300",
			hintClass: liveCount > 0 ? "text-rose-300" : "text-[#8d89a5]",
		},
		{
			icon: CalendarDays,
			label: "This week",
			value: thisWeekCount,
			hint: "Active lineup",
			iconClass: "bg-emerald-500/15 text-emerald-300",
			hintClass: "text-emerald-300",
		},
	];

	return (
		<section className="space-y-3">
			<h2 className="font-bold text-[var(--explore-heading)] text-xl">
				Your snapshot
			</h2>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => {
					const Icon = stat.icon;

					return (
						<article
							className="flex min-h-[84px] items-center gap-4 rounded-[10px] border border-[var(--explore-border)] bg-[var(--explore-card)] p-4 shadow-[var(--explore-shadow)]"
							key={stat.label}
						>
							<div
								className={`flex size-11 items-center justify-center rounded-[9px] ${stat.iconClass}`}
							>
								<Icon className="size-5" />
							</div>
							<div>
								<p className="font-black text-[26px] text-[var(--explore-heading)] leading-none">
									{stat.value.toLocaleString()}
								</p>
								<p className="mt-1 text-[var(--explore-text)] text-sm">
									{stat.label}
								</p>
								<p className={`mt-1 font-medium text-xs ${stat.hintClass}`}>
									{stat.hint}
								</p>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}
