"use client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useFormContext, Controller } from "react-hook-form";
import { SelectSingleEventHandler } from "react-day-picker";

export function DatePicker() {
  const { control } = useFormContext();

  return (
    <Controller
      name="date"
      control={control}
      rules={{ required: "Date is required" }}
      render={({ field, fieldState: { error } }) => {
        const handleSelect: SelectSingleEventHandler = (day) => {
          if (!day) return;

          const utcDate = new Date(
            Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())
          );
          field.onChange(utcDate);
        };

        return (
          <div className="space-y-3">
            <label htmlFor="date" className="block font-medium">
              Event Date <span className="text-red-500">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "w-full px-4 py-2 border rounded hover:border-green-500 focus:ring-0 focus:border-green-500 focus:outline-0 flex items-center justify-between cursor-pointer",
                    !field.value && "text-muted-foreground"
                  )}
                  id="date"
                >
                  <span>
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                  </span>
                  <CalendarIcon className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={handleSelect}
                  initialFocus
                  showOutsideDays
                  fixedWeeks
                  numberOfMonths={1}
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear() + 10}
                />
              </PopoverContent>
            </Popover>
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
