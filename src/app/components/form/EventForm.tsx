"use client";
import { useForm, FormProvider } from "react-hook-form";
import VenueSelect from "./VenueSelect";
import { DatePicker } from "./DatePicker";
import { Event, Action } from "@/app/utils/types";
import { FcCalendar } from "react-icons/fc";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { TimeRangePicker } from "./TimeRangerPicker";

type FormData = {
  title: string;
  description: string;
  venue: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
};

type Props = {
  dispatch: React.Dispatch<Action>;
  onClose: () => void;
  events: Event[];
  editingEvent?: Event | null;
};

const EventForm = ({ dispatch, onClose, events, editingEvent }: Props) => {
  const methods = useForm<FormData>({
    defaultValues: {
      title: editingEvent?.title || "",
      description: editingEvent?.description || "",
      venue: editingEvent?.venue || "",
      date: editingEvent?.date ? new Date(editingEvent.date) : undefined,
      startTime: editingEvent?.startTime || "",
      endTime: editingEvent?.endTime || "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (editingEvent) {
      reset({
        title: editingEvent.title,
        description: editingEvent.description || "",
        venue: editingEvent.venue,
        date: editingEvent.date ? new Date(editingEvent.date) : undefined,
        startTime: editingEvent.startTime || "",
        endTime: editingEvent.endTime || "",
      });
    }
  }, [editingEvent, reset]);

  const onSubmit = (data: FormData) => {
    if (!data.date) {
      toast.error("Date is required");
      return;
    }

    if (!data.startTime || !data.endTime) {
      toast.error("Both start and end times are required");
      return;
    }

    if (data.startTime >= data.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    const year = data.date.getUTCFullYear();
    const month = String(data.date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(data.date.getUTCDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    // Checking for conflicts
    const isConflict = events.some((event) => {
      if (event.venue !== data.venue || event.date !== dateString) {
        return false;
      }
      if (editingEvent && event.id === editingEvent.id) {
        return false;
      }

      return (
        (data.startTime < event.endTime && data.endTime > event.startTime) ||
        (event.startTime < data.endTime && event.endTime > data.startTime)
      );
    });

    if (isConflict) {
      toast.error("The venue is already booked during the selected time");
      return;
    }

    const eventData: Event = {
      id: editingEvent?.id || crypto.randomUUID(),
      title: data.title,
      description: data.description,
      venue: data.venue,
      date: dateString,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    dispatch({
      type: editingEvent ? "UPDATE" : "ADD",
      payload: eventData,
    });

    reset();
    onClose();
    toast.success(`Event ${editingEvent ? "updated" : "added"} successfully!`);
  };

  return (
    <FormProvider {...methods}>
      {/* Used form provider from react hook form to sync value from different form components */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2 md:space-y-4 relative z-50"
      >
        {/* Title Field */}
        <div className="space-y-3">
          <label htmlFor="title" className="block font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2 border rounded hover:border-green-500 focus:ring-0 focus:border-green-500 focus:outline-0"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-3">
          <label htmlFor="description" className="block font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 20,
                message: "Minimum 20 characters required",
              },
            })}
            rows={4}
            className="w-full px-4 py-2 border rounded hover:border-green-500 focus:ring-0 focus:border-green-500 focus:outline-0"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Venue Field */}
        <VenueSelect />

        {/* Date Field */}
        <DatePicker />

        {/* Time Range */}
        <div className="space-y-3">
          <label htmlFor="time" className="block font-medium">
            Select Time<span className="text-red-500">*</span>
          </label>
          <TimeRangePicker />
        </div>

        {/*  Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          >
            {editingEvent ? "Update Event" : "Add Event"}{" "}
            <FcCalendar className="w-5 h-5" />
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EventForm;
