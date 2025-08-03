"use client";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "./Modal";
import { useState } from "react";
import Image from "next/image";
import venueImageMap from "../utils/venueImageMap";
import { TbZoomScan } from "react-icons/tb";
interface PreviewButtonProps {
  event: {
    id: string;
    title: string;
    description?: string;
    date: string;
    venue: string;
    startTime: string;
    endTime: string;
  };
}

export function PreviewButton({ event }: PreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const normalizedVenue = event.venue.trim().toLowerCase();
  const imageSrc = venueImageMap[normalizedVenue] || "/images/c.jpg";

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-1 hover:bg-black/40 border-none rounded-sm bg-black/20"
      >
        <TbZoomScan className="h-5 w-5" />
        View
      </Button>

      <Modal open={isOpen} onOpenChange={setIsOpen} title="Event Details" width="md:max-w-[50vw]">
        <div className="flex flex-col md:flex-row gap-6 ">
          {/* Image section */}
          <div className="w-full md:w-1/2">
            <div className="relative h-48   md:h-full rounded-md overflow-hidden">
              <Image
                src={imageSrc}
                alt={event.venue}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>

          {/* Details section */}
          <div className="w-full md:w-1/2 space-y-3">
            <h2 className="text-xl font-medium">{event.title}</h2>

            {event.description && (
              <div className="text-gray-900">
                <p className="font-medium">Description:</p>
                <p>{event.description}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-green-600" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-purple-600" />
                <span>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
