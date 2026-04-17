import { setThemeServerFn } from "@/services/ThemeService";
import { useRouter } from "@tanstack/react-router";
import { createContext, PropsWithChildren, use } from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextVal = { theme: Theme; setTheme: (val: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);

export function ThemeProvider({ children, theme }: Props) {
    const router = useRouter()

    function setTheme (val: Theme) {
        void (async () => {
            try {
                await setThemeServerFn({ data: val })
                await router.invalidate()
            } catch (error) {
                console.error("Failed to update theme:", error)
            }
        })()
    }

    return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
    const val = use(ThemeContext);
    if (!val) throw new Error("useTheme must be used within a ThemeProvider");
    return val;
}
