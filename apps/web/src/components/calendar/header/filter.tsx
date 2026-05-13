import { Separator } from "@radix-ui/react-select";
import { CheckIcon, Filter, RefreshCcw } from "lucide-react";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import type { TEventColor } from "@/components/calendar/types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import { Toggle } from "@/components/shadcn/ui/toggle";
import { m } from "@/paraglide/messages";

export default function FilterEvents() {
	const { selectedColors, filterEventsBySelectedColors, clearFilter } =
		useCalendar();

	const colors: TEventColor[] = [
		"Blue",
		"Green",
		"Red",
		"Yellow",
		"Purple",
		"Orange",
	];

	const getColorName = (color: TEventColor): string => {
		switch (color) {
			case "Blue":
				return m.calendar_filter_blue();
			case "Green":
				return m.calendar_filter_green();
			case "Red":
				return m.calendar_filter_red();
			case "Yellow":
				return m.calendar_filter_yellow();
			case "Purple":
				return m.calendar_filter_purple();
			case "Orange":
				return m.calendar_filter_orange();
			default:
				return color;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Toggle
					variant="outline"
					className="w-fit cursor-pointer shadow-lg hover:scale-105"
				>
					<Filter className="h-4 w-4" />
				</Toggle>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[150px]">
				{colors.map((color) => (
					<DropdownMenuItem
						key={color}
						className="flex cursor-pointer items-center gap-2"
						onClick={(e) => {
							e.preventDefault();
							filterEventsBySelectedColors(color);
						}}
					>
						<div
							className={`size-3.5 rounded-full bg-${color.toLowerCase()}-600 dark:bg-${color.toLowerCase()}-700`}
						/>
						<span className="flex items-center justify-center gap-2 capitalize">
							{getColorName(color)}
							<span>
								{selectedColors.includes(color) && (
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
					disabled={selectedColors.length === 0}
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
