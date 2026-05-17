import { useCallback, useEffect, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useTabBarVisibility } from "@/lib/tab-bar-visibility";

type UseTabBarScrollVisibilityOptions = {
	enabled?: boolean;
	bottomRevealBuffer?: number;
	hideDistance?: number;
	minRevealDelta?: number;
	snapThreshold?: number;
};

export function useTabBarScrollVisibility({
	bottomRevealBuffer = 140,
	enabled = true,
	hideDistance = 150,
	minRevealDelta = 12,
	snapThreshold = 0.45,
}: UseTabBarScrollVisibilityOptions = {}) {
	const lastScrollYRef = useRef(0);
	const hiddenProgressRef = useRef(0);
	const isMomentumScrollingRef = useRef(false);
	const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { setTabBarScrollProgress } = useTabBarVisibility();

	const clearSnapTimeout = useCallback(() => {
		if (!snapTimeoutRef.current) return;

		clearTimeout(snapTimeoutRef.current);
		snapTimeoutRef.current = null;
	}, []);

	const snapTabBar = useCallback(() => {
		if (!enabled) return;

		const snappedProgress = hiddenProgressRef.current >= snapThreshold ? 1 : 0;
		hiddenProgressRef.current = snappedProgress;
		setTabBarScrollProgress(snappedProgress, { animated: true });
	}, [enabled, setTabBarScrollProgress, snapThreshold]);

	const handleScrollEnd = useCallback(() => {
		if (!enabled) return;

		clearSnapTimeout();
		snapTimeoutRef.current = setTimeout(() => {
			if (isMomentumScrollingRef.current) return;

			snapTabBar();
		}, 80);
	}, [clearSnapTimeout, enabled, snapTabBar]);

	const handleMomentumScrollBegin = useCallback(() => {
		isMomentumScrollingRef.current = true;
		clearSnapTimeout();
	}, [clearSnapTimeout]);

	const handleMomentumScrollEnd = useCallback(() => {
		isMomentumScrollingRef.current = false;
		clearSnapTimeout();
		snapTabBar();
	}, [clearSnapTimeout, snapTabBar]);

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
				setTabBarScrollProgress(0, { animated: true });
				return;
			}

			if (Math.abs(scrollDelta) < 1) return;

			if (
				scrollDelta < 0 &&
				isNearBottom &&
				Math.abs(scrollDelta) < minRevealDelta
			) {
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
			clearSnapTimeout();
			isMomentumScrollingRef.current = false;
			hiddenProgressRef.current = 0;
			setTabBarScrollProgress(0, { animated: true });
		};
	}, [clearSnapTimeout, setTabBarScrollProgress]);

	return {
		handleMomentumScrollBegin,
		handleMomentumScrollEnd,
		handleScroll,
		handleScrollEnd,
	};
}
