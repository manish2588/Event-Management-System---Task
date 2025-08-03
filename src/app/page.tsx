"use client";
import React, { useEffect, useReducer, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { EventList } from "./components/EventList";
import { EventFilter } from "./components/EventFilter";
import dummyEvents from "./DummyEvent/DummyEvent";
import { eventReducer } from "./reducer/eventReducer";
import { Modal } from "./components/Modal";
import EventForm from "./components/form/EventForm";
import { Button } from "@/components/ui/button";
import { Event } from "./utils/types";
import Banner from "./components/Banner";
import dynamic from "next/dynamic";
import { Calendar, Grid3X3 } from "lucide-react";

const CalendarView = dynamic(
  () =>
    import("../app/components/CalenderView").then((mod) => mod.CalendarView),
  { ssr: false }
);

const LOCAL_STORAGE_KEY = "events";

const HomePage: React.FC = () => {
  const [events, dispatch] = useReducer(eventReducer, []);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list"); // New state for view mode


  {/* Initially save dummy events on local storage */}
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsedEvents = JSON.parse(stored);
      dispatch({ type: "INIT", payload: parsedEvents });
      setFilteredEvents(parsedEvents);
    } else {
      dispatch({ type: "INIT", payload: dummyEvents });
      setFilteredEvents(dummyEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
    setFilteredEvents(events);
  }, [events]);

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleVenueFilter = (venue: string | null) => {
    if (!venue || venue === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.venue === venue));
    }
  };

  return (
    <>
      <Banner />
      {/* Heading */}
      <div className="max-w-7xl mx-auto p-6 ">
        <h1 className="text-gray-900 text-2xl md:text-4xl font-semibold drop-shadow-lg mb-8">
          Event Management System - EB Pearls
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <h1 className="text-2xl md:text-3xl font-medium">
            {viewMode === "list" ? "Events List" : "Calendar View"}
          </h1>
          {/* Select Filter and Buttons */}
          <div className="flex flex-col md:flex-row gap-4 w-1/2 md:w-auto ">
            <EventFilter onVenueChange={handleVenueFilter} />
            <Button
              onClick={() =>
                setViewMode(viewMode === "list" ? "calendar" : "list")
              }
              variant="outline"
              className="gap-2 flex items-center"
            >
              {viewMode === "list" ? (
                <>
                  <Calendar className="w-4 h-4 text-green-500" />
                  Calendar View
                </>
              ) : (
                <>
                  <Grid3X3 className="w-4 h-4 text-green-500" />
                  List View
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                setEditingEvent(null);
                setIsModalOpen(true);
              }}
              className="gap-2 bg-green-500 hover:bg-green-600"
            >
              <CalendarPlus className="h-5 w-5" />
              Add Event
            </Button>
          </div>
        </div>

         {/* Calender View and List View*/}
        {viewMode === "calendar" ? (
          <CalendarView
            events={filteredEvents}
            onEventClick={(event) => {
              setEditingEvent(event);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <EventList
            events={filteredEvents}
            dispatch={dispatch}
            onEdit={handleEditClick}
          />
        )}

           {/*Form modal for event add and delete */}
        <Modal
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingEvent(null);
          }}
          title={editingEvent ? "Edit Event" : "Add New Event"}
          width="md:max-w-[32vw]"
        >
          <EventForm
            dispatch={dispatch}
            onClose={() => {
              setIsModalOpen(false);
              setEditingEvent(null);
            }}
            events={events}
            editingEvent={editingEvent}
          />
        </Modal>
      </div>
    </>
  );
};

export default HomePage;
