"use client"

import * as React from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { addDays } from "date-fns"

interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
  align?: "start" | "center" | "end"
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "حدد نطاق التاريخ",
  align = "end",
  className,
}: DateRangePickerProps) {
  const dateFormat = (date: Date) => format(date, "PPP", { locale: ar })

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range || !range.from) return placeholder
    if (!range.to) return dateFormat(range.from)
    return `${dateFormat(range.from)} - ${dateFormat(range.to)}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full sm:w-[300px] justify-start text-right font-normal",
            !value?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          <span>{formatDateRange(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          initialFocus
          locale={ar}
          numberOfMonths={2}
          classNames={{
            months: "flex flex-col md:flex-row gap-4"
          }}
        />
        <div className="flex gap-2 p-3 justify-center border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onChange(undefined)}
            className="text-xs"
          >
            مسح التاريخ
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onChange({ from: new Date(), to: addDays(new Date(), 30) })}
            className="text-xs"
          >
            30 يوم
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
