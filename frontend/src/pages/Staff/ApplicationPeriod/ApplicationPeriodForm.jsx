import { useState } from "react";
import { toast } from "react-toastify";

export default function ApplicationPeriodForm({ onSuccess, disabled }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [enabled, setEnabled] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the data structure that matches your backend expectations
        const data = {
            application: {
                startDate: startDate,
                endDate: endDate,
                status: "Pending", // Default status for new application periods
                announcementMessage: announcementMessage,
            },
        };

        try {
            const response = await fetch(
                "http://localhost:8000/app/views/application-periods.php",
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
                setStartDate("");
                setEndDate("");
                setAnnouncementMessage("");
            } else {
                alert("Error: " + result.message);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit the form. Please try again.");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Prevent form submission
        setStartDate("");
        setEndDate("");
        setAnnouncementMessage("");
    };

    const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

    return (
        <div className="w-[30%]">
            <div className="min-h-full bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="pt-8 text-lg font-bold text-gray-800 text-center">
                    Set Application Period
                </h2>

                {disabled && (
                    <div className="mx-8 mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-yellow-700 text-sm">
                            Cannot create new application periods while there is
                            an active period.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {/* Start Date Input */}
                    <div className="block mb-2 relative">
                        <label className="block mb-1 text-gray-600 text-sm">
                            Start Date
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            disabled={disabled}
                        />
                    </div>

                    {/* End Date Input */}
                    <div className="block mb-2 relative">
                        <label className="block mb-1 text-gray-600 text-sm">
                            End Date
                        </label>
                        <input
                            type="date"
                            min={today}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            disabled={disabled}
                        />
                    </div>

                    {/* Announcement Message Input */}
                    <div>
                        <label className="block mb-1 text-gray-600 text-sm">
                            Announcement Message
                        </label>
                        <textarea
                            rows={5}
                            type="text"
                            value={announcementMessage}
                            onChange={(e) =>
                                setAnnouncementMessage(e.target.value)
                            }
                            className="w-full resize-none border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter announcement message"
                            required
                            disabled={disabled}
                        ></textarea>
                    </div>

                    {/* Enable Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="enablePeriod"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            disabled={disabled}
                        />
                        <label
                            htmlFor="enablePeriod"
                            className="ml-2 block text-sm text-gray-700"
                        >
                            Enable Application Period
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            type="button" // Explicitly set type to prevent form submission
                            onClick={handleCancel}
                            className="w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none bg-gray-200 text-gray-500"
                            disabled={disabled}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none ${
                                disabled
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600"
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