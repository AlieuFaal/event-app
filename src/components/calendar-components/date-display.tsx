import { formatDate, isValid } from "date-fns";
import { motion } from "framer-motion";
import { useCalendar } from "./contexts/calendar-context";
import { rangeText } from "./helpers/helpers";
import type { CalendarView } from "./types/types";
import { buttonHover } from "./animations/animations";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../shadcn/ui/button";

interface Props {
	view: CalendarView;
}

const MotionButton = motion.create(Button);

export function DateDisplay({ view }: Props) {
	const { selectedDate, navigateCalendar } = useCalendar();

	const validDate = isValid(selectedDate) ? selectedDate : new Date();
	const month = formatDate(validDate, "MMMM");
	const year = validDate.getFullYear();

	const handlePrevious = () => {
		navigateCalendar("prev");
	};

	const handleNext = () => {
		navigateCalendar("next");
	};

	return (
		<div className="space-y-0.5">
			<div className="flex items-center gap-2">
				<motion.span
					className="text-lg font-semibold"
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
				>
					{month} {year}
				</motion.span>
			</div>

			<div className="flex items-center gap-2">
				<MotionButton
					variant="outline"
					size="icon"
					className="hover:scale-105 h-6 w-6"
					onClick={handlePrevious}
					variants={buttonHover}
					whileHover="hover"
					whileTap="tap"
				>
					<ChevronLeft className="h-4 w-4" />
				</MotionButton>
				<motion.p
					className="text-sm text-muted-foreground"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					{rangeText(view, validDate)}
				</motion.p>
				<MotionButton
					variant="outline"
					size="icon"
					className="h-6 w-6"
					onClick={handleNext}
					variants={buttonHover}
					whileHover="hover"
					whileTap="tap"
				>
					<ChevronRight className="h-4 w-4" />
				</MotionButton>
			</div>
		</div>
	);
}