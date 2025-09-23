import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import BASE_URL from "../../../config";

const AddEventFormModal = React.memo(
    ({ isOpen, onClose, onSuccess, onRefresh, disabled }) => {
        const [eventDate, setEventDate] = useState("");
        const [startTime, setStartTime] = useState("");
        const [endTime, setEndTime] = useState("");
        const [eventName, setEventName] = useState("");
        const [eventLocation, setEventLocation] = useState("");
        const [eventType, setEventType] = useState("");
        const [announcementMessage, setAnnouncementMessage] = useState("");
        const [enabled, setEnabled] = useState(true);

        const handleSubmit = async (e) => {
            e.preventDefault();

            // Create the data structure that matches your backend expectations
            const data = {
                event: {
                    event_date: eventDate,
                    start_time: startTime,
                    end_time: endTime,
                    event_name: eventName,
                    event_type: eventType,
                    event_location: eventLocation,
                },
            };

            try {
                const response = await fetch(
                    `${BASE_URL}app/views/events.php`,
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
                    return true;
                } else {
                    alert("Error: " + result.message);
                    return false
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert("Failed to submit the form. Please try again.");
                return false;
            }
        };

        const handleCancel = (e) => {
            e.preventDefault(); // Prevent form submission
            setEventDateAndTime("");
            setEventName("");
            setEventLocation("");
        };

        const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

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
                <div className="relative w-full sm:w-[60%] md:[45%] lg:w-[40%] xl:w-[30%] bg-white rounded-xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="relative px-6 py-4 border-b border-slate-200">
                        <h2
                            id="modal-title"
                            className="text-lg text-slate-700 pr-10 leading-tight"
                        >
                            Add New Event
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
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                placeholder="Start Date"
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                                disabled={disabled}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 block mb relative">
                                <label className="block mb-1 text-gray-600 text-xs">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    placeholder="Start Date"
                                    className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    required
                                    disabled={disabled}
                                />
                            </div>

                            <div className="flex-1 block mb relative">
                                <label className="block mb-1 text-gray-600 text-xs">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    placeholder="Start Date"
                                    className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                                onChange={(e) =>
                                    setEventLocation(e.target.value)
                                }
                                placeholder="Enter event location"
                                className="w-full border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                required
                                disabled={disabled}
                            />
                        </div>

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

                        {/* Action Buttons */}
                        <div className="flex gap-2 text-sm">
                            <button
                                type="button" // Explicitly set type to prevent form submission
                                onClick={handleCancel}
                                className="w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none bg-gray-200 text-gray-500"
                                disabled={disabled}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 rounded-lg shadow-sm focus:outline-none ${
                                    disabled
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-green-600 text-white hover:bg-green-700"
                                } transition-all`}
                                disabled={disabled}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
);

export default AddEventFormModal;
