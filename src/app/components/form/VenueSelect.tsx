"use client";
import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const venues = [
  "Meeting Room",
  "Conference Hall A",
  "Conference Hall B",
  "Training Hall",
  "Client Office",
  "Main Auditorium",
  "Garden Area",
  "Innovation Lab",
];

const VenueSelect = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-3">
      <label htmlFor="venue" className="block font-medium">
        Venue <span className="text-red-500">*</span>
      </label>
      <Controller
        name="venue"
        control={control}
        rules={{ required: "Venue is required" }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full px-4 py-2 border rounded hover:border-green-500 focus:ring-0 focus:border-green-500 focus:outline-0">
              <SelectValue placeholder="Select venue" />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem
                  key={venue}
                  value={venue}
                  className="hover:bg-green-50 focus:bg-green-50"
                >
                  {venue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.venue && (
        <p className="text-red-500 text-sm mt-1">
          {errors.venue.message as string}
        </p>
      )}
    </div>
  );
};

export default VenueSelect;
