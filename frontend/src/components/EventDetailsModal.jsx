import { Calendar, Check, Clock, MapPin, Users, X } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { date } from "../utils/getDateAndTime";
import React, { useEffect, useMemo, useState } from "react";
import { convertTo24HourFormat } from "../utils/convertTo24HourFormat";
import EventButton from "../pages/Scholar/Events/EventButton";
import ConfirmationModal from "../pages/Staff/Event/ConfirmationModal";

const EventDetailsModal = React.memo(
    ({
        isOpen,
        onClose,
        event,
        isStaff = false,
        joinEvent,
        cancelEvent,
        userId,
        fetchEvents,
        activeTab,
        isScholar = false,
    }) => {
        const [isOpenSelectedScholarModal, setIsOpenSelectedScholarModal] =
            useState(false);
        const [method, setMethod] = useState("");
        const [renderedHours, setRenderedHours] = useState("");
        const [selectedScholars, setSelectedScholars] = useState([]);

        const handleSelectScholar = (scholarId) => {
            setSelectedScholars((prev) => {
                if (prev.includes(scholarId)) {
                    return prev.filter((id) => id !== scholarId);
                } else {
                    return [...prev, scholarId];
                }
            });
        };

        useEffect(() => {
            if (method === "automatic") {
                const startTime = convertTo24HourFormat(
                    event?.start_time
                ).split(":");
                const endTime = convertTo24HourFormat(event?.end_time).split(
                    ":"
                );
                const renderedHours = endTime[0] - startTime[0];
                setRenderedHours(renderedHours);
            } else {
                setRenderedHours("");
            }
        }, [method]);

        return (
            <div
                className={`fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-in fade-in duration-200 ${
                    isOpen ? "block" : "hidden"
                }`}
                // onKeyDown={handleKeyDown}
                // onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="relative w-full scroll-smooth sm:w-[60%] md:[45%] lg:w-[40%] xl:w-[30%] bg-white rounded-xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="relative px-6 py-4 border-b border-slate-200">
                        <h2
                            id="modal-title"
                            className="text-lg text-slate-700 pr-10 leading-tight"
                        >
                            {event?.event_name}
                        </h2>
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="absolute top-3 right-4 p-2 text-slate-700 rounded-full hover:bg-gray-100 active:ring-1 active:ring-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-[400px] overflow-y-auto scroll-smooth p-6 space-y-6">
                        {/* Event Details Grid */}
                        <div className="grid grid-cols-2 sm:gap-12 gap-14 text-xs">
                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">
                                        {formatDate(event?.date)}
                                    </span>
                                </div>

                                <div className="flex items-center text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium truncate">
                                        {event?.event_location}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Clock className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">
                                        {formatTime(event?.start_time)} -{" "}
                                        {formatTime(event?.end_time)}
                                    </span>
                                </div>

                                <div className="flex items-center text-slate-600">
                                    <Users className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    {event?.date + " " + event?.end_time >
                                    date.getCurrentDateAndTime() ? (
                                        <span className="text-slate-700 font-medium">
                                            {event?.numberOfParticipants}
                                            {" / "}
                                            {event?.participant_limit}{" "}
                                            Participants
                                            {/* {event?.numberOfParticipants > 1
                                                ? "Participants"
                                                : "Participant"} */}
                                        </span>
                                    ) : (
                                        <span className="text-slate-700 font-medium">
                                            {event?.numberOfParticipants}
                                            {" / "}
                                            {event?.participant_limit}
                                            Participated
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3
                                className={`${
                                    event?.participants?.length > 0
                                        ? "block"
                                        : "hidden"
                                } text-xs text-gray-700 font-bold`}
                            >
                                {event?.date + " " + event?.end_time >
                                date.getCurrentDateAndTime()
                                    ? "Scholars Who Will Participate:"
                                    : "Scholars Who Participated:"}
                            </h3>
                            <ul
                                className={`mt-4 grid gap-1 ${
                                    event?.participants?.length >= 15
                                        ? "grid-cols-2"
                                        : "grid-cols-1"
                                }`}
                            >
                                {event?.participants?.map(
                                    (participant, index) => (
                                        <li
                                            key={index}
                                            className="w-[max-content]"
                                        >
                                            <label className="flex gap-2 items-center text-slate-600 text-xs">
                                                {isStaff && (
                                                    <>
                                                        {participant.is_attended ? (
                                                            <Check className="w-4 h-4 font-bold rounded-sm text-green-600 " />
                                                        ) : (
                                                            <input
                                                                type="checkbox"
                                                                value={selectedScholars.includes(
                                                                    participant.scholar_id
                                                                )}
                                                                onChange={(e) =>
                                                                    handleSelectScholar(
                                                                        participant.scholar_id,
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                                className={`${
                                                                    event?.date +
                                                                        " " +
                                                                        event?.end_time >
                                                                    date.getCurrentDateAndTime()
                                                                        ? "hidden"
                                                                        : "block"
                                                                } accent-green-600`}
                                                            />
                                                        )}
                                                    </>
                                                )}{" "}
                                                <span>
                                                    {
                                                        participant.participant_name
                                                    }
                                                </span>
                                            </label>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        {event?.date + " " + event?.end_time <
                            date.getCurrentDateAndTime() &&
                            isStaff && (
                                <div>
                                    <h3 className="text-xs text-gray-700 font-bold">
                                        Rendered Hours:
                                    </h3>
                                    <form className="mt-4">
                                        <div className="block mb-4 relative">
                                            <label className="mb-1 text-xs text-slate-600 flex gap-1 items-center">
                                                <input
                                                    value={method}
                                                    onChange={() =>
                                                        setMethod("automatic")
                                                    }
                                                    name="rendered"
                                                    type="radio"
                                                    className="accent-green-600"
                                                />
                                                Based on the event's start and
                                                end time
                                            </label>
                                            <label className="text-xs text-slate-600 flex gap-1 items-center">
                                                <input
                                                    value={method}
                                                    onChange={() =>
                                                        setMethod("manual")
                                                    }
                                                    name="rendered"
                                                    type="radio"
                                                    className="accent-green-600"
                                                />
                                                Enter number of hour(s) manually
                                            </label>
                                        </div>

                                        {method === "manual" && (
                                            <div className="block mb-2 relative">
                                                <label className="block mb-1 text-gray-600 text-xs">
                                                    Rendered Hours
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={renderedHours}
                                                    onChange={(e) =>
                                                        setRenderedHours(
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    placeholder="Enter number of hours"
                                                    className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                />
                                            </div>
                                        )}
                                    </form>
                                </div>
                            )}
                    </div>

                    <div className="p-4 flex flex-col sm:flex-row gap-3 border-t border-slate-200">
                        <button
                            onClick={() => onClose(false)}
                            type="button"
                            className="flex-1 text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
                        >
                            Close
                        </button>
                        {isScholar &&
                            event?.date + " " + event?.end_time >
                                date.getCurrentDateAndTime() && (
                                <EventButton
                                    numberOfParticipants={event?.numberOfParticipants}
                                    participantLimit={event?.participant_limit}
                                    hasJoinButton={
                                        event?.event_type === "optional"
                                    }
                                    setIsOpen={onClose}
                                    joinEvent={joinEvent}
                                    cancelEvent={cancelEvent}
                                    eventId={event?.id}
                                    scholarId={userId}
                                    onRefresh={fetchEvents}
                                    activeTab={activeTab}
                                />
                            )}
                        {isStaff &&
                            event?.date + " " + event?.end_time <
                                date.getCurrentDateAndTime() && (
                                <button
                                    onClick={() => {
                                        console.log("Clicked");
                                        setIsOpenSelectedScholarModal(true);
                                    }}
                                    type="submit"
                                    className="flex-1 text-sm bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                                >
                                    Record
                                </button>
                            )}
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={isOpenSelectedScholarModal}
                    onClose={setIsOpenSelectedScholarModal}
                    event={event}
                    participants={event?.participants}
                    eventId={event?.id}
                    selectedScholars={selectedScholars}
                    renderedHours={renderedHours}
                />
            </div>
        );
    }
);

export default EventDetailsModal;
