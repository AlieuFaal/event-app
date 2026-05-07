import { useCallback, useEffect, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useTabBarVisibility } from "@/lib/tab-bar-visibility";

type UseTabBarScrollVisibilityOptions = {
	enabled?: boolean;
	bottomRevealBuffer?: number;
	hideDistance?: number;
	minRevealDelta?: number;
};

export function useTabBarScrollVisibility({
	bottomRevealBuffer = 140,
	enabled = true,
	hideDistance = 96,
	minRevealDelta = 12,
}: UseTabBarScrollVisibilityOptions = {}) {
	const lastScrollYRef = useRef(0);
	const hiddenProgressRef = useRef(0);
	const { setTabBarScrollProgress } = useTabBarVisibility();

	const handleScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			if (!enabled) return;

			const scrollY = Math.max(0, event.nativeEvent.contentOffset.y);
			const scrollDelta = scrollY - lastScrollYRef.current;
			const maxScrollY = Math.max(
				0,
				event.nativeEvent.contentSize.height -
					event.nativeEvent.layoutMeasurement.height,
			);
			const isNearBottom = maxScrollY - scrollY <= bottomRevealBuffer;
			lastScrollYRef.current = scrollY;

			if (scrollY <= 0) {
				hiddenProgressRef.current = 0;
				setTabBarScrollProgress(0);
				return;
			}

			if (Math.abs(scrollDelta) < 1) return;

			if (scrollDelta < 0 && isNearBottom && Math.abs(scrollDelta) < minRevealDelta) {
				return;
			}

			const nextProgress = Math.min(
				1,
				Math.max(0, hiddenProgressRef.current + scrollDelta / hideDistance),
			);

			hiddenProgressRef.current = nextProgress;
			setTabBarScrollProgress(nextProgress);
		},
		[
			bottomRevealBuffer,
			enabled,
			hideDistance,
			minRevealDelta,
			setTabBarScrollProgress,
		],
	);

	useEffect(() => {
		return () => {
			hiddenProgressRef.current = 0;
			setTabBarScrollProgress(0);
		};
	}, [setTabBarScrollProgress]);

	return { handleScroll };
}
