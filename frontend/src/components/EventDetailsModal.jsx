import { Calendar, Check, Clock, MapPin, Users, X } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { date } from "../utils/getDateAndTime";
import React, { useEffect, useMemo, useState } from "react";
import { convertTo24HourFormat } from "../utils/convertTo24HourFormat";
import EventButton from "../pages/Scholar/Events/EventButton";
import ConfirmationModal from "../pages/Staff/Event/ConfirmationModal";
import InputModal from "./InputModal";
import { toast } from "react-toastify";

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
        const [localEvent, setLocalEvent] = useState(event);

        // Update local event when prop changes
        useEffect(() => {
            setLocalEvent(event);
        }, [event]);

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
                    localEvent?.start_time
                ).split(":");
                const endTime = convertTo24HourFormat(
                    localEvent?.end_time
                ).split(":");
                const renderedHours = endTime[0] - startTime[0];
                setRenderedHours(renderedHours);
            } else {
                setRenderedHours("");
            }
        }, [method, localEvent]);

        const participated = localEvent?.participants.filter(
            (participant) => participant.is_attended
        );

        const handleCancel = () => {
            onClose(false);
        };

        const handleOpenConfirmationModal = () => {
            if (selectedScholars.length < 1) {
                toast.error("Select scholar(s) to proceed.");
                return;
            }

            if (renderedHours === "") {
                toast.error("Please enter number of hours.");
                return;
            }

            setIsOpenSelectedScholarModal(true);
        };

        const handleRecordSuccess = () => {
            // Update local participants to mark selected scholars as attended
            setLocalEvent((prev) => ({
                ...prev,
                participants: prev.participants.map((participant) =>
                    selectedScholars.includes(participant.scholar_id)
                        ? { ...participant, is_attended: true }
                        : participant
                ),
            }));

            // Clear selections and reset
            setSelectedScholars([]);
            setMethod("");
            setRenderedHours("");
            setIsOpenSelectedScholarModal(false);

            // Refresh the parent data
            if (fetchEvents) {
                fetchEvents();
            }
        };

        return (
            <>
                <InputModal
                    label={localEvent?.event_name}
                    isOpen={isOpen}
                    onClose={onClose}
                    expandable={true}
                    onCancel={handleCancel}
                    disabledButton={true}
                >
                    {/* Content */}
                    <div
                        className={`max-h-[400px] overflow-y-auto scroll-smooth p-6 ${localEvent?.participants.length > 0 && "space-y-6"}`}
                    >
                        {/* Event Details Grid */}
                        <div className="grid grid-cols-2 sm:gap-12 gap-14 text-xs">
                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">
                                        {formatDate(localEvent?.date)}
                                    </span>
                                </div>

                                <div className="flex items-center text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium truncate">
                                        {localEvent?.event_location}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-slate-600">
                                    <Clock className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">
                                        {formatTime(localEvent?.start_time)} -{" "}
                                        {formatTime(localEvent?.end_time)}
                                    </span>
                                </div>

                                <div className="flex items-center text-slate-600">
                                    <Users className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                                    {localEvent?.date +
                                        " " +
                                        localEvent?.end_time >
                                    date.getCurrentDateAndTime() ? (
                                        <span className="text-slate-700 font-medium">
                                            {localEvent?.numberOfParticipants}
                                            {" / "}
                                            {localEvent?.participant_limit}{" "}
                                            Participants
                                        </span>
                                    ) : (
                                        <span className="text-slate-700 font-medium">
                                            {localEvent?.numberOfParticipants}
                                            {" / "}
                                            {localEvent?.participant_limit}{" "}
                                            Participated
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div
                                className={`mt-2 grid gap-1 ${localEvent?.participants?.length > 0 ? "block" : "hidden"} ${
                                    localEvent?.participants?.length >= 15
                                        ? "grid-cols-2"
                                        : "grid-cols-1"
                                } border rounded-md border-gray-200`}
                            >
                                <h3
                                    className={`${
                                        localEvent?.participants?.length > 0
                                            ? "block"
                                            : "hidden"
                                    } bg-gray-50 rounded-tl-md rounded-tr-md px-4 py-4 border-b text-xs text-gray-600 font-bold`}
                                >
                                    {localEvent?.date +
                                        " " +
                                        localEvent?.end_time >
                                    date.getCurrentDateAndTime()
                                        ? "Scholars Who Will Participate:"
                                        : "Scholars Who Participated:"}
                                </h3>
                                <ul className="p-4 space-y-0.5">
                                    {localEvent?.participants?.map(
                                        (participant, index) => (
                                            <li
                                                key={index}
                                                className="w-[max-content]"
                                            >
                                                <label className="flex gap-2 items-center text-slate-600 text-xs">
                                                    {isStaff && (
                                                        <>
                                                            {participant.is_attended ? (
                                                                <Check className="w-4 h-4 font-bold rounded-sm text-green-600" />
                                                            ) : (
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedScholars.includes(
                                                                        participant.scholar_id
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleSelectScholar(
                                                                            participant.scholar_id,
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    className={`${
                                                                        localEvent?.date +
                                                                            " " +
                                                                            localEvent?.end_time >
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
                        </div>

                        {localEvent?.date + " " + localEvent?.end_time <
                            date.getCurrentDateAndTime() &&
                            isStaff &&
                            participated.length <
                                localEvent?.numberOfParticipants && (
                                <div>
                                    <div className="mt-2 border rounded-md border-gray-200">
                                        <h3 className="bg-gray-50 rounded-tl-md rounded-tr-md px-4 py-4 border-b text-xs text-gray-600 font-bold">
                                            Rendered Hours:
                                        </h3>
                                        <div
                                            className={`p-4 block relative ${method === "manual" ? "-mb-4" : ""}`}
                                        >
                                            <label className="mb-1 text-xs text-slate-600 flex gap-2 items-center">
                                                <input
                                                    checked={
                                                        method === "automatic"
                                                    }
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
                                            <label className="text-xs text-slate-600 flex gap-2 items-center">
                                                <input
                                                    checked={
                                                        method === "manual"
                                                    }
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
                                            <div className="block p-4 mb-2 relative">
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
                                                    className="w-full border text-xs border-gray-300 rounded-md px-2 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>

                    <div className="flex justify-end rounded-b-sm gap-2 p-3.5 border-t border-gray-300 bg-gray-50 flex-shrink-0">
                        <button
                            onClick={() => onClose(false)}
                            type="button"
                            className="ml-auto bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Close
                        </button>

                        {isScholar &&
                            date.getCurrentDateAndTime() <
                                localEvent?.date +
                                    " " +
                                    localEvent?.start_time && (
                                <EventButton
                                    numberOfParticipants={
                                        localEvent?.numberOfParticipants
                                    }
                                    participantLimit={
                                        localEvent?.participant_limit
                                    }
                                    hasJoinButton={
                                        localEvent?.event_type === "optional"
                                    }
                                    setIsOpen={onClose}
                                    joinEvent={joinEvent}
                                    cancelEvent={cancelEvent}
                                    eventId={localEvent?.id}
                                    scholarId={userId}
                                    onRefresh={fetchEvents}
                                    activeTab={activeTab}
                                />
                            )}
                        {isStaff &&
                            localEvent?.date + " " + localEvent?.end_time <
                                date.getCurrentDateAndTime() &&
                            participated.length !==
                                localEvent?.numberOfParticipants && (
                                <button
                                    onClick={handleOpenConfirmationModal}
                                    type="button"
                                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                                >
                                    Record
                                </button>
                            )}
                    </div>
                </InputModal>
                <ConfirmationModal
                    isOpen={isOpenSelectedScholarModal}
                    onClose={setIsOpenSelectedScholarModal}
                    event={localEvent}
                    participants={localEvent?.participants}
                    eventId={localEvent?.id}
                    selectedScholars={selectedScholars}
                    renderedHours={renderedHours}
                    onRecordSuccess={handleRecordSuccess}
                />
            </>
        );
    }
);

export default EventDetailsModal;
