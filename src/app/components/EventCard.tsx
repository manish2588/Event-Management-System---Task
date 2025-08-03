"use client";
import Image from "next/image";
import { Calendar, MapPin, Edit, Clock } from "lucide-react";
import venueImageMap from "../utils/venueImageMap";
import { DeleteConfirmationDialog } from "./AlretDialog";
import { useState } from "react";
import { Event, Action } from "../utils/types";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { PreviewButton } from "./PreviewButton";

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  date: string;
  venue: string;
  startTime: string;
  endTime: string;
  dispatch: React.Dispatch<Action>;
  onEdit: (event: Event) => void;
}

export function EventCard({
  id,
  title,
  description,
  date,
  venue,
  startTime,
  endTime,
  dispatch,
  onEdit,
}: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const normalizedVenue = venue.trim().toLowerCase();
  const imageSrc = venueImageMap[normalizedVenue] || "/images/c.jpg";

  const handleDelete = () => {
    setIsDeleting(true);
    dispatch({ type: "DELETE", payload: id });
    setIsDeleting(false);
    toast.success("Event Deleted");
  };

  const handleEdit = () => {
    onEdit({ id, title, description, date, venue, startTime, endTime });
  };

  // Format time to AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const getEventStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);

    const timeDiff = eventDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) return { status: "Ongoing", isPast: false };
    if (daysDiff === 1) return { status: "Tomorrow", isPast: false };
    if (daysDiff > 1) return { status: `in ${daysDiff} days`, isPast: false };
    return { status: "Past Event", isPast: true };
  };

  const { status, isPast } = getEventStatus();
  const isToday = status === "Ongoing";

  return (
    <div
      className={`group relative p-4 rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-2xl ${
        isPast
          ? "bg-red-200 opacity-80"
          : isToday
          ? "bg-green-200"
          : "bg-gray-100"
      }`}
    >
      {/* Image Part */}
      <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
        <Image
          src={imageSrc}
          alt={venue}
          fill
          className="object-cover rounded-md transition-transform duration-500 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-xl font-medium text-gray-900">{title}</h3>

        <div className="flex items-center text-gray-700 text-base">
          <Calendar className="h-4 w-4 mr-2 text-green-600" />
          <span>
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center text-gray-700 text-base">
          <Clock className="h-4 w-4 mr-2 text-purple-600" />
          <span>
            {formatTime(startTime)} - {formatTime(endTime)}
          </span>
        </div>

        <div className="flex items-center text-gray-700 text-base">
          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
          <span>{venue}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-between gap-2">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="gap-2 hover:bg-green-500"
          >
            <Edit className="h-4 w-4" />
            Update
          </Button>
          <DeleteConfirmationDialog
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
        <PreviewButton
          event={{
            id,
            title,
            description,
            date,
            venue,
            startTime,
            endTime,
          }}
        />
      </div>

      {/* Status Badge */}
      <div
        className={`absolute top-8 right-8 text-gray-900 text-xs font-medium px-2.5 py-0.5 rounded-full ${
          isPast ? "bg-red-300 " : isToday ? "bg-green-300 " : "bg-blue-300"
        }`}
      >
        {status}
      </div>
    </div>
  );
}
