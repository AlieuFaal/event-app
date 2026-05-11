import { setThemeServerFn } from "@/services/ThemeService";
import { useRouter } from "@tanstack/react-router";
import { createContext, PropsWithChildren, use, useCallback, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextVal = { theme: Theme; setTheme: (val: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);

function getResolvedTheme(theme: Theme): "light" | "dark" {
    if (theme !== "system") {
        return theme;
    }

    if (typeof window === "undefined") {
        return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemePreference(theme: Theme) {
    if (typeof document === "undefined") {
        return;
    }

    const resolvedTheme = getResolvedTheme(theme);

    document.documentElement.classList.remove("light", "dark", "system");
    document.documentElement.classList.add(resolvedTheme);
    document.documentElement.dataset.themePreference = theme;
}

export function ThemeProvider({ children, theme }: Props) {
    const router = useRouter()
    const [currentTheme, setCurrentTheme] = useState(theme);

    useEffect(() => {
        setCurrentTheme(theme);
    }, [theme]);

    useEffect(() => {
        applyThemePreference(currentTheme);

        if (currentTheme !== "system" || typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = () => applyThemePreference("system");

        mediaQuery.addEventListener("change", handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
    }, [currentTheme]);

    const setTheme = useCallback((val: Theme) => {
        const previousTheme = currentTheme;
        setCurrentTheme(val);
        applyThemePreference(val);

        void (async () => {
            try {
                await setThemeServerFn({ data: val })
                await router.invalidate()
            } catch (error) {
                setCurrentTheme(previousTheme);
                applyThemePreference(previousTheme);
                console.error("Failed to update theme:", error)
            }
        })()
    }, [currentTheme, router]);

    const contextValue = useMemo(
        () => ({ theme: currentTheme, setTheme }),
        [currentTheme, setTheme],
    );

    return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}

export function useTheme() {
    const val = use(ThemeContext);
    if (!val) throw new Error("useTheme must be used within a ThemeProvider");
    return val;
}
