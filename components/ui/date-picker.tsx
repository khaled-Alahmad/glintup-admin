"use client"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatePickerProps {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  showYearSelector?: boolean
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "حدد تاريخ",
  minDate,
  maxDate,
  disabled,
  showYearSelector = false
}: DatePickerProps) {
  const [month, setMonth] = useState<Date>(selected || new Date())
  
  // Generate year options for birth date (last 80 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 80 }, (_, i) => currentYear - i)
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ]

  const handleYearChange = (year: string) => {
    const newMonth = new Date(month)
    newMonth.setFullYear(parseInt(year))
    setMonth(newMonth)
  }

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = new Date(month)
    newMonth.setMonth(parseInt(monthIndex))
    setMonth(newMonth)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-right", !selected && "text-muted-foreground")}
          disabled={disabled}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: ar }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {showYearSelector && (
          <div className="flex gap-2 p-3 border-b">
            <Select
              value={month.getMonth().toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((monthName, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={month.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          month={month}
          onMonthChange={setMonth}
          initialFocus
          locale={ar}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  )
}