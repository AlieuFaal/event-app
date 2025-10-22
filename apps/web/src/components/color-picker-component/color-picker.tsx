"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../shadcn/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover"

const PRESET_COLORS = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#f59e0b" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Orange", value: "#f97316" },
]

interface ColorPickerProps {
    color: string
    onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="max-w-80 justify-start gap-3 h-9 bg-transparent" type="button">
                    <div className="h-6 w-6 rounded-lg border-none shadow-xl" style={{ backgroundColor: color }} />
                    <span className="flex-1 text-left">{PRESET_COLORS.find((c) => c.name === color)?.name || "Custom"}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-3 text-sm">Preset Colors</h4>
                        <div className="grid grid-cols-6 gap-2">
                            {PRESET_COLORS.map((presetColor) => (
                                <button
                                    key={presetColor.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(presetColor.name)
                                        // setOpen(false)
                                    }}
                                    className={cn(
                                        "h-10 w-10 rounded-md border-2 transition-all hover:scale-110",
                                        color === presetColor.value ? "border-foreground ring-2 ring-ring ring-offset-2" : "border-border",
                                    )}
                                    style={{ backgroundColor: presetColor.value }}
                                    title={presetColor.name}
                                >
                                    {color === presetColor.name && <Check className="h-4 w-4 mx-auto text-white drop-shadow-md" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
