import { useState } from "react";
import { toast } from "react-toastify";

export default function ApplicationPeriodEditForm({ applicationPeriod, onSuccess, onCancel }) {
    const [startDate, setStartDate] = useState(applicationPeriod.start_date);
    const [endDate, setEndDate] = useState(applicationPeriod.end_date);
    const [status, setStatus] = useState(applicationPeriod.status);
    const [announcementMessage, setAnnouncementMessage] = useState(
        applicationPeriod.announcement_message
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the data structure that matches your backend expectations
        const data = {
            application: {
                id: applicationPeriod.id,
                startDate: startDate,
                endDate: endDate,
                status: status,
                announcementMessage: announcementMessage,
            },
        };

        console.log(data);

        try {
            const response = await fetch(
                "http://localhost:8000/app/views/application-periods.php",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (result.success) {
                toast.success(result.message + ".");
                if (onSuccess) onSuccess();
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update the application period. Please try again.");
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="w-[30%]">
            <div className="min-h-full bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="pt-8 text-lg font-bold text-gray-800 text-center">
                    Edit Application Period
                </h2>
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {/* Start Date Input */}
                    <div className="block mb-2 relative">
                        <label className="block mb-1 text-gray-600 text-sm">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* End Date Input */}
                    <div className="block mb-2 relative">
                        <label className="block mb-1 text-gray-600 text-sm">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Status Radio Buttons */}
                    <div className="block mb-2">
                        <label className="text-gray-600 text-sm block mb-2">
                            Status
                        </label>
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="statusActive"
                                    name="status"
                                    value="Active"
                                    checked={status === "Active"}
                                    onChange={() => setStatus("Active")}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <label
                                    htmlFor="statusActive"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Active
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="statusClosed"
                                    name="status"
                                    value="Closed"
                                    checked={status === "Closed"}
                                    onChange={() => setStatus("Closed")}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <label
                                    htmlFor="statusClosed"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Closed
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Announcement Message Input */}
                    <div>
                        <label className="block mb-1 text-gray-600 text-sm">Announcement Message</label>
                        <textarea
                            rows={5}
                            type="text"
                            value={announcementMessage}
                            onChange={(e) =>
                                setAnnouncementMessage(e.target.value)
                            }
                            className="w-full resize-none border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter announcement message"
                            required
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none bg-gray-200 text-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-sm font-medium shadow-sm focus:outline-none bg-green-500 text-white hover:bg-green-600 transition-all"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}