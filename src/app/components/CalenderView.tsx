"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Clock } from "lucide-react";
import { Event } from "../utils/types";

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const isEventExpired = (event: Event) => {
    const now = new Date();
    const eventEnd = new Date(`${event.date}T${event.endTime}`);
    return eventEnd < now;
  };

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: `${event.date}T${event.startTime}`,
    end: `${event.date}T${event.endTime}`,
    extendedProps: {
      venue: event.venue,
      description: event.description,
      timeRange: `${formatTime(event.startTime)} - ${formatTime(
        event.endTime
      )}`,
      isExpired: isEventExpired(event),
    },
  }));

  return (
    <div className="p-2 sm:p-4 bg-white rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "",
        }}
        events={calendarEvents}
        eventClick={(info) => {
          const clickedEvent = events.find((e) => e.id === info.event.id);
          if (clickedEvent) onEventClick(clickedEvent);
        }}
        eventContent={(eventInfo) => (
          <div
            className={`fc-event-main px-1 py-0.5 border border-gray-300 ${
              eventInfo.event.extendedProps.isExpired
                ? "bg-red-400"
                : "bg-green-400"
            }`}
          >
            {/* In small screen only show square box and on above screen event info also shown */}
            {isMobile ? (
              <div className="h-8 w-8 rounded-full bg-transparent"></div>
            ) : (
              <div className="flex items-start gap-1 overflow-hidden">
                <div className="overflow-hidden">
                  <div className="text-sm font-medium truncate text-gray-900">
                    {eventInfo.event.title}
                  </div>
                  <div className="text-xs text-gray-800 truncate flex">
                    <Clock className="h-3 w-3 mt-0.5 mr-2 flex-shrink-0 text-gray-500" />
                    {eventInfo.event.extendedProps.timeRange}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        eventDisplay="block"
        dayMaxEvents={2}
        height="auto"
        eventOrder="start,-duration,title"
        views={{
          dayGridMonth: {
            dayMaxEventRows: 2,
            dayHeaderFormat: { weekday: "short" },
            dayCellContent: (args) => {
              return (
                <div className="fc-daygrid-day-number">
                  {args.dayNumberText.replace(",", "")}
                </div>
              );
            },
          },
        }}
        windowResizeDelay={100}
        dayHeaderContent={(args) => (
          <span className="text-xs">{args.text}</span>
        )}
        dayCellDidMount={(args) => {
          if (window.innerWidth < 768) {
            args.el.style.minHeight = "60px";
          }
        }}
      />
    </div>
  );
};
