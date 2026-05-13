import { useRouter } from "@tanstack/react-router";
import {
	createContext,
	type PropsWithChildren,
	use,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { setThemeServerFn } from "@/services/ThemeService";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextVal = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (val: Theme) => void;
};
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);
const THEME_STORAGE_KEY = "theme-preference";

function getResolvedTheme(theme: Theme): ResolvedTheme {
	if (theme !== "system") {
		return theme;
	}

	if (typeof window === "undefined") {
		return "light";
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyThemePreference(theme: Theme): ResolvedTheme {
	const resolvedTheme = getResolvedTheme(theme);

	if (typeof document === "undefined") {
		return resolvedTheme;
	}

	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolvedTheme);
	document.documentElement.dataset.themePreference = theme;

	return resolvedTheme;
}

function persistThemeCookie(theme: Theme) {
	if (typeof document === "undefined") {
		return;
	}
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in all supported browsers and this keeps theme SSR hydration consistent.

	document.cookie = `${THEME_STORAGE_KEY}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function ThemeProvider({ children, theme }: Props) {
	const router = useRouter();
	const [currentTheme, setCurrentTheme] = useState(theme);
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
		getResolvedTheme(theme),
	);

	useEffect(() => {
		setCurrentTheme(theme);
		setResolvedTheme(applyThemePreference(theme));
	}, [theme]);

	useEffect(() => {
		setResolvedTheme(applyThemePreference(currentTheme));

		if (currentTheme !== "system" || typeof window === "undefined") {
			return;
		}

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemThemeChange = () => {
			setResolvedTheme(applyThemePreference("system"));
		};

		mediaQuery.addEventListener("change", handleSystemThemeChange);

		return () => {
			mediaQuery.removeEventListener("change", handleSystemThemeChange);
		};
	}, [currentTheme]);

	const setTheme = useCallback(
		(val: Theme) => {
			const previousTheme = currentTheme;
			const previousResolvedTheme = resolvedTheme;

			setCurrentTheme(val);
			setResolvedTheme(applyThemePreference(val));
			persistThemeCookie(val);

			void (async () => {
				try {
					await setThemeServerFn({ data: val });
					await router.invalidate();
				} catch (error) {
					setCurrentTheme(previousTheme);
					setResolvedTheme(previousResolvedTheme);
					applyThemePreference(previousTheme);
					persistThemeCookie(previousTheme);
					console.error("Failed to update theme:", error);
				}
			})();
		},
		[currentTheme, resolvedTheme, router],
	);

	const contextValue = useMemo(
		() => ({ theme: currentTheme, resolvedTheme, setTheme }),
		[currentTheme, resolvedTheme, setTheme],
	);

	return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}

export function useTheme() {
	const val = use(ThemeContext);
	if (!val) throw new Error("useTheme must be used within a ThemeProvider");
	return val;
}
