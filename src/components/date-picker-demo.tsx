"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { id } from "date-fns/locale"; // Mengimpor locale Indonesia

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerDemoProps {
  defaultDate?: Date; // Optional prop to pass initial/default date
  onChange: (date: Date | undefined) => void; // Callback to notify parent of selected date
}

export function DatePickerDemo({ defaultDate, onChange }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);

  React.useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    }
  }, [defaultDate]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange(newDate); // Notify parent of the change
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? (
            format(date, "PPP", { locale: id })
          ) : (
            <span>Pick a date</span>
          )}{" "}
          {/* Format tanggal dengan locale Indonesia */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
