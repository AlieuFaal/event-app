import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	type SharedValue,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

type TabBarVisibilityContextValue = {
	isTabBarHidden: boolean;
	setTabBarHidden: (hidden: boolean) => void;
	setTabBarScrollProgress: (progress: number) => void;
	tabBarHiddenProgress: SharedValue<number>;
};

const TabBarVisibilityContext =
	createContext<TabBarVisibilityContextValue | null>(null);

export function TabBarVisibilityProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [isTabBarHidden, setIsTabBarHidden] = useState(false);
	const isForcedHiddenRef = useRef(false);
	const tabBarHiddenProgress = useSharedValue(0);

	const setTabBarHidden = useCallback((hidden: boolean) => {
		isForcedHiddenRef.current = hidden;
		setIsTabBarHidden(hidden);
		tabBarHiddenProgress.value = withTiming(hidden ? 1 : 0, {
			duration: 220,
		});
	}, [tabBarHiddenProgress]);

	const setTabBarScrollProgress = useCallback(
		(progress: number) => {
			if (isForcedHiddenRef.current) return;

			tabBarHiddenProgress.value = Math.min(1, Math.max(0, progress));
		},
		[tabBarHiddenProgress],
	);

	const value = useMemo(
		() => ({
			isTabBarHidden,
			setTabBarHidden,
			setTabBarScrollProgress,
			tabBarHiddenProgress,
		}),
		[
			isTabBarHidden,
			setTabBarHidden,
			setTabBarScrollProgress,
			tabBarHiddenProgress,
		],
	);

	return (
		<TabBarVisibilityContext value={value}>
			{children}
		</TabBarVisibilityContext>
	);
}

export function useTabBarVisibility() {
	const context = useContext(TabBarVisibilityContext);

	if (!context) {
		throw new Error(
			"useTabBarVisibility must be used within TabBarVisibilityProvider",
		);
	}

	return context;
}
