"use client"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
interface DatePickerProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
  disabled?: boolean
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "حدد تاريخ",
  minDate,
  disabled
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[180px] justify-start text-right", !selected && "text-muted-foreground")}
          disabled={disabled}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: ar }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          locale={ar}
          disabled={(date) => minDate ? date < minDate : false}
        />
      </PopoverContent>
    </Popover>
  )
}