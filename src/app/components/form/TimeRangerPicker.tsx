"use client";

import { useFormContext, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock } from "lucide-react";

export const TimeRangePicker = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const startTime = watch("startTime");

  const parseTimeString = (timeString: string | undefined): Date | null => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    return date;
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return "";
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const getEndTimeConstraints = () => {
    const minTime = parseTimeString(startTime);
    if (!minTime) return {};

    const maxTime = new Date(minTime);
    maxTime.setHours(23, 0, 0, 0);

    return {
      minTime,
      maxTime,
      filterTime: (time: Date) => time >= minTime,
    };
  };

  return (
    <div className="flex  gap-4">
      {/* Start Time */}
      <div className="flex-1">
        <div className="relative">
          <Controller
            name="startTime"
            control={control}
            rules={{ required: "Start time is required" }}
            render={({ field }) => (
              <DatePicker
                selected={parseTimeString(field.value)}
                onChange={(date) => {
                  const formatted = formatTime(date);
                  field.onChange(formatted);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-0 focus:ring-green-500 sm:text-sm"
                placeholderText="Start Time"
              />
            )}
          />
          <Clock className="absolute left-3 top-3.5 md:top-2.5 h-4 w-4 text-gray-400" />
        </div>
        {errors.startTime && (
          <p className="mt-1 text-sm text-red-600">
            {errors.startTime.message as string}
          </p>
        )}
      </div>

      {/* End Time */}
      <div className="flex-1">
        <div className="relative">
          <Controller
            name="endTime"
            control={control}
            rules={{
              required: "End time is required",
              validate: (value) => {
                if (!value) return "End time is required";
                const start = parseTimeString(startTime);
                const end = parseTimeString(value);
                if (start && end && end <= start) {
                  return "End time must be after start time";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <DatePicker
                selected={parseTimeString(field.value)}
                onChange={(date) => {
                  const formatted = formatTime(date);
                  field.onChange(formatted);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-green-500 focus:outline-none focus:ring-0 focus:ring-green-500 sm:text-sm"
                placeholderText="End time"
                {...getEndTimeConstraints()}
              />
            )}
          />
          <Clock className="absolute left-3 top-3.5 md:top-2.5 h-4 w-4 text-gray-400" />
        </div>
        {errors.endTime && (
          <p className="mt-1 text-sm text-red-600">
            {errors.endTime.message as string}
          </p>
        )}
      </div>
    </div>
  );
};
