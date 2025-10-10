import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/shadcn/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu"
import { useTheme } from "../components/Themeprovider"
import { m } from "@/paraglide/messages"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>{m.nav_light_mode()}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>{m.nav_dark_mode()}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>{m.nav_system_mode()}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}