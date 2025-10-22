"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/shadcn/ui/button"
import { Calendar } from "@/components/shadcn/ui/calendar"
import { Input } from "@/components/shadcn/ui/input"
import { Label } from "@/components/shadcn/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/shadcn/ui/popover.tsx"

interface Calendar24Props {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
}

export function Calendar24({ value, onChange, placeholder = "Select date" }: Calendar24Props) {
  const [open, setOpen] = React.useState(false)
  const [time, setTime] = React.useState("")
  const [isMounted, setIsMounted] = React.useState(false)

  // Prevent hydration mismatch by only showing formatted date on client
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && time) {
      const [hours, minutes, seconds] = time.split(':').map(Number)
      const combinedDateTime = new Date(selectedDate)
      combinedDateTime.setHours(hours, minutes, seconds || 0)
      onChange?.(combinedDateTime)
    } else {
      onChange?.(selectedDate)
    }
    setOpen(false)
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (value && newTime) {
      const [hours, minutes, seconds] = newTime.split(':').map(Number)
      const updatedDateTime = new Date(value)
      updatedDateTime.setHours(hours, minutes, seconds || 0)
      onChange?.(updatedDateTime)
    }
  }

  React.useEffect(() => {
    if (value) {
      const timeString = value.toTimeString().slice(0, 8)
      setTime(timeString)
    }
  }, [value])

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1 relative left-3">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
              suppressHydrationWarning
            >
              {value ? (
                isMounted ? (
                  value.toLocaleDateString()
                ) : (
                  // During SSR and first render, show ISO format to prevent hydration mismatch
                  value.toISOString().split('T')[0]
                )
              ) : (
                placeholder
              )}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1 relative left-3">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
