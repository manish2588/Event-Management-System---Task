"use client";
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

interface EventFilterProps {
  onVenueChange: (venue: string) => void;
}

export function EventFilter({ onVenueChange }: EventFilterProps) {
  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={onVenueChange}>
        <SelectTrigger className="w-full border border-gray-300 bg-white hover:border-green-500 focus:border-green-500 focus:ring-0">
          <SelectValue placeholder="Filter by venue" />
        </SelectTrigger>
        <SelectContent>
          {/* This implies no filter */}
          <SelectItem value="all" className="hover:bg-green-100">
            All Venues
          </SelectItem>

          {/*  venues */}
          {venues.map((venue) => (
            <SelectItem
              key={venue}
              value={venue}
              className="hover:bg-green-100"
            >
              {venue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
