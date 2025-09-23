import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";
import { X, Calendar, MapPin, Clock, Users } from "lucide-react";
import EventButton from "./EventButton";

const EventDetailsModal = ({ today, event, isOpen, setIsOpen, joinEvent, cancelEvent, userId, fetchEvents, activeTab, onClose }) => {
    const [viewMore, setViewMore] = useState(false);

    // Handle escape key press
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose(false);
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose(false);
        }
    };

    if (!isOpen) return null;

    // const participants = [
    //     "Alice Johnson",
    //     "Bob Smith",
    //     "Charlie Brown",
    //     "Diana Prince",
    //     "Ethan Hunt",
    //     "Fiona Gallagher",
    //     "George Costanza",
    //     "Hannah Montana",
    //     "Ian Malcolm",
    //     "Jane Doe",
    //     "Kevin Hart",
    //     "Laura Croft",
    //     "Michael Scott",
    //     "Nina Simone",
    //     "Oliver Twist",
    //     "Paula Patton",
    //     "Quentin Tarantino",
    //     "Rachel Green",
    //     "Sam Winchester",
    //     "Tina Fey",
    //     "Ursula K. Le Guin",
    //     "Victor Frankenstein",
    //     "Winston Churchill",
    //     "Xena Warrior Princess",
    // ];

    return (
        <div
            className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-in fade-in duration-200"
            onKeyDown={handleKeyDown}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-6 py-4">
                    <h2
                        id="modal-title"
                        className="text-xl font-semibold text-white pr-10 leading-tight"
                    >
                        {event.event_name}
                    </h2>
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="absolute top-2.5 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[400px] overflow-y-auto scroll-smooth p-6 space-y-6">
                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center text-slate-600">
                                <Calendar className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-700 font-medium">
                                    {formatDate(event.date)}
                                </span>
                            </div>

                            <div className="flex items-center text-slate-600">
                                <MapPin className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-700 font-medium truncate">
                                    {event.event_location}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center text-slate-600">
                                <Clock className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-700 font-medium">
                                    {formatTime(event.start_time)} -{" "}
                                    {formatTime(event.end_time)}
                                </span>
                            </div>

                            <div className="flex items-center text-slate-600">
                                <Users className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                                <span className="text-slate-700 font-medium">
                                    {event.numberOfParticipants} participant
                                    {event.numberOfParticipants !== 1
                                        ? "s"
                                        : ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Participants Section */}
                    {event.participants && event.participants.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                Participants
                            </h3>
                            <div
                                className={`${
                                    viewMore
                                        ? "h-[max-content]"
                                        : !viewMore && event.participants.length
                                        ? "h-[max-content]"
                                        : "h-16"
                                } flex flex-wrap gap-2 overflow-hidden`}
                            >
                                {event.participants.map((participant, index) => (
                                    <span
                                        key={`${participant}-${index}`}
                                        className={`bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-emerald-200 transition-colors duration-150 ${
                                            event.participants.length > 6 &&
                                            !viewMore &&
                                            index >= 6
                                                ? "hidden"
                                                : ""
                                        }`}
                                    >
                                        {participant}
                                    </span>
                                ))}
                            </div>
                            {event.participants.length > 6 && (
                                <button
                                    onClick={() => setViewMore(!viewMore)}
                                    className="text-sm text-emerald-500"
                                >
                                    {viewMore ? "- View Less" : "+ View More"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Description if available */}
                    {event.description && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                Description
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {event.description}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                        <button
                            onClick={() => onClose(false)}
                            type="button"
                            className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                            Close
                        </button>
                        {/* <button
                            type="button"
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Join Event
                        </button> */}
                        {event.date > today && (
                            <EventButton
                                // className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                setIsOpen={setIsOpen}
                                joinEvent={joinEvent}
                                cancelEvent={cancelEvent}
                                eventId={event.id}
                                scholarId={userId}
                                onRefresh={fetchEvents}
                                activeTab={activeTab}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
