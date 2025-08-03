"use client";
import { EventCard } from "./EventCard";
import { Event } from "../utils/types";
import { Action } from "../utils/types";
import { motion } from "framer-motion";

interface EventListProps {
  events: Event[];
  dispatch: React.Dispatch<Action>;
  onEdit: (event: Event) => void;
}

export function EventList({ events, dispatch, onEdit }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events found. Add your first event!</p>
      </div>
    );
  }

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
      {/* Display the list of cards */}
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{once:true}}
        >
          <EventCard
            id={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
            venue={event.venue}
            startTime={event.startTime}
            endTime={event.endTime}
            dispatch={dispatch}
            onEdit={onEdit}
          />
        </motion.div>
      ))}
    </div>
  );
}
