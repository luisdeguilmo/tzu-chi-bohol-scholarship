import { X, XCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../../../config";
import InputModal from "../../../components/InputModal";
import { formatTime } from "../../../utils/formatTime";
import { numbersOnly } from "../../../utils/inputValidations";
import { useScholars } from "../../../hooks/useScholars";

const EventFormModal = React.memo(
    ({ isOpen, onClose, onRefresh, disabled, action, setAction, event }) => {
        const [eventDate, setEventDate] = useState("");
        const [startTime, setStartTime] = useState("");
        const [endTime, setEndTime] = useState("");
        const [eventName, setEventName] = useState("");
        const [eventLocation, setEventLocation] = useState("");
        const [eventType, setEventType] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [selectedScholars, setSelectedScholars] = useState([]);
        const [participantLimit, setParticipantLimit] = useState("");

        const { scholars } = useScholars(
            "active",
            "all",
            "all_years",
            "all",
            "all",
            "all",
            "newest"
        );

        useEffect(() => {
            if (event && action === "edit") {
                setEventDate(event?.date || "");
                setStartTime(event?.start_time || "");
                setEndTime(event?.end_time || "");
                setEventName(event?.event_name || "");
                setEventLocation(event?.event_location);
                setEventType(event?.event_type || "");
                setParticipantLimit(event?.participant_limit || "");
                setSelectedScholars(
                    event?.participants.map((e) => e.scholar_id)
                );
            }
        }, [event, action]);

        const handleAddEvent = async () => {
            // Create the data structure that matches your backend expectations
            const data = {
                event: {
                    event_date: eventDate,
                    start_time: startTime,
                    end_time: endTime,
                    event_name: eventName,
                    event_type: eventType,
                    event_location: eventLocation,
                    participant_limit: participantLimit,
                    selected_scholars: selectedScholars,
                },
            };

            try {
                setIsLoading(true);

                const response = await fetch(
                    `${BASE_URL}app/api/events.php`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json", // Important for JSON body
                        },
                        body: JSON.stringify(data),
                    }
                );

                const result = await response.json(); // Parse as JSON instead of text

                if (result.success) {
                    toast.success(result.message + ".");
                    setEventDate("");
                    setStartTime("");
                    setEndTime("");
                    setEventName("");
                    setEventLocation("");
                    onRefresh();
                    onClose(false);
                    setIsLoading(false);
                    return true;
                } else {
                    alert("Error: " + result.message);
                    setIsLoading(false);
                    return false;
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert("Failed to submit the form. Please try again.");
                setIsLoading(false);
                return false;
            }
        };

        const handleEditEvent = async () => {
            // Create the data structure that matches your backend expectations
            const data = {
                event: {
                    event_id: event?.id,
                    event_date: eventDate,
                    start_time: startTime,
                    end_time: endTime,
                    event_name: eventName,
                    event_type: eventType,
                    event_location: eventLocation,
                    participant_limit: participantLimit,
                    selected_scholars: selectedScholars,
                },
            };

            try {
                setIsLoading(true);

                const response = await fetch(
                    `${BASE_URL}app/api/events.php`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json", // Important for JSON body
                        },
                        body: JSON.stringify(data),
                    }
                );

                const result = await response.json(); // Parse as JSON instead of text

                if (result.success) {
                    toast.success(result.message + ".");
                    setEventDate("");
                    setStartTime("");
                    setEndTime("");
                    setEventName("");
                    setEventLocation("");
                    setAction("create");
                    onRefresh();
                    onClose(false);
                    setIsLoading(false);
                    return true;
                } else {
                    alert("Error: " + result.message);
                    setIsLoading(false);
                    return false;
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert("Failed to submit the form. Please try again.");
                setIsLoading(false);
                return false;
            }
        };

        const handleCancel = (e) => {
            e.preventDefault(); // Prevent form submission
            resetFields();
        };

        const resetFields = () => {
            setAction("create");
            setEventName("");
            setEventLocation("");
            setEventDate("");
            setStartTime("");
            setEndTime("");
            setEventType("");
            setParticipantLimit("");
        };

        const toggleScholarSelection = (scholarId) => {
            setSelectedScholars((prev) => {
                if (prev.includes(scholarId)) {
                    return prev.filter((id) => id !== scholarId);
                } else {
                    return [...prev, scholarId];
                }
            });
        };

        const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

        return (
            <InputModal
                label={action === "create" ? "New Event" : "Edit Event"}
                isOpen={isOpen}
                resetFields={resetFields}
                onClose={onClose}
                onCancel={handleCancel}
                onSubmit={
                    action === "create" ? handleAddEvent : handleEditEvent
                }
                buttonLabel={"Save"}
                isLoading={isLoading}
            >
                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Start Date Input */}
                    <div className="block mb-2 relative">
                        <label className="block mb-1 text-gray-600 text-xs">
                            Date
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            onClick={(e) => e.target.showPicker()}
                            placeholder="yyyy-mm-dd"
                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 block mb relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                Start Time
                            </label>
                            {startTime && (
                                <span className="pointer-events-none absolute left-2.5 top-[32px] text-gray-800 text-xs">
                                    {formatTime(startTime)}
                                </span>
                            )}
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                onClick={(e) => e.target.showPicker()}
                                placeholder="--:-- --"
                                className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                                disabled={disabled}
                            />
                        </div>

                        <div className="flex-1 block mb relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                End Time
                            </label>
                            {endTime && (
                                <span className="pointer-events-none absolute left-2.5 top-[32px] text-gray-800 text-xs">
                                    {formatTime(endTime)}
                                </span>
                            )}
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                onClick={(e) => e.target.showPicker()}
                                placeholder="--:-- --"
                                className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                                disabled={disabled}
                            />
                        </div>
                    </div>

                    {/* End Date Input */}
                    <div className="block mb-2 relative">
                        <label className="block mb-1 text-gray-600 text-xs">
                            Event Name
                        </label>
                        <input
                            type="text"
                            min={today}
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Enter event name"
                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div className="block mb-2 relative">
                        <label className="block mb-1 text-gray-600 text-xs">
                            Event Location
                        </label>
                        <input
                            type="text"
                            min={today}
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            placeholder="Enter event location"
                            className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                            required
                            disabled={disabled}
                        />
                    </div>

                    {eventType === "optional" && (
                        <div className="block mb-2 relative">
                            <label className="block mb-1 text-gray-600 text-xs">
                                Participant Limit
                            </label>
                            <input
                                type="text"
                                min={1}
                                value={participantLimit}
                                onChange={(e) => {
                                    const value = numbersOnly(e.target.value);
                                    setParticipantLimit(value);
                                }}
                                placeholder="Enter participant limit"
                                className="w-full border text-xs border-gray-300 rounded-md py-2.5 px-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                                disabled={disabled}
                            />
                        </div>
                    )}

                    <div className="block mb-2">
                        <label className="text-gray-600 text-xs block mt-[-2px] mb-1">
                            Event Type
                        </label>
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="optional"
                                    name="event_type"
                                    value="optional"
                                    required
                                    checked={eventType === "optional"}
                                    onChange={() => setEventType("optional")}
                                    className="h-4 w-4 accent-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <label
                                    htmlFor="optional"
                                    className="ml-2 block text-xs text-gray-700"
                                >
                                    Optional
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="mandatory"
                                    name="event_type"
                                    value="mandatory"
                                    required
                                    checked={eventType === "mandatory"}
                                    onChange={() => setEventType("mandatory")}
                                    className="h-4 w-4 accent-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <label
                                    htmlFor="mandatory"
                                    className="ml-2 block text-xs text-gray-700"
                                >
                                    Mandatory
                                </label>
                            </div>
                        </div>
                    </div>

                    {eventType === "mandatory" && (
                        <div className="">
                            <div
                                className={`mt-2 mb-4 grid border rounded-md border-gray-200`}
                            >
                                <h3
                                    className={`bg-gray-50 rounded-tl-md rounded-tr-md px-4 py-4 border-b text-xs text-gray-600 font-bold`}
                                >
                                    Selected Scholars:
                                </h3>
                                <ul
                                    className={`p-4 grid ${
                                        selectedScholars?.length >= 15
                                            ? "grid-cols-2"
                                            : "grid-cols-1"
                                    }`}
                                >
                                    {selectedScholars.length === 0 && (
                                        <div>
                                            <p className="text-xs text-gray-600 text-center">
                                                No selected scholars.
                                            </p>
                                        </div>
                                    )}
                                    {scholars.map(
                                        (scholar, index) =>
                                            selectedScholars.includes(
                                                scholar.account_id
                                            ) && (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-3 text-xs text-gray-600"
                                                >
                                                    {scholar.last_name +
                                                        ", " +
                                                        scholar.first_name}
                                                    <button
                                                        onClick={() =>
                                                            toggleScholarSelection(
                                                                scholar.account_id
                                                            )
                                                        }
                                                        className="rounded-full bg-white"
                                                    >
                                                        <X className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </li>
                                            )
                                    )}
                                </ul>
                            </div>

                            <ul className="pb-0 space-y-1">
                                {scholars.map((scholar, index) => (
                                    <li
                                        key={index}
                                        className="text-xs text-gray-600"
                                    >
                                        <label className="flex gap-2">
                                            <input
                                                className="accent-green-600 hover:accent-green-600"
                                                type="checkbox"
                                                checked={selectedScholars.includes(
                                                    scholar.account_id
                                                )}
                                                onChange={() =>
                                                    toggleScholarSelection(
                                                        scholar.account_id
                                                    )
                                                }
                                            />
                                            <p>
                                                {scholar.last_name +
                                                    ", " +
                                                    scholar.first_name}
                                            </p>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-gray-500">
                                {selectedScholars.length} Selected
                            </p>
                        </div>
                    )}
                </div>
            </InputModal>
        );
    }
);

export default EventFormModal;
