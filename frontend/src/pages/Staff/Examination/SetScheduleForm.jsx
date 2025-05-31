import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function SetScheduleForm({ isOpen, setIsOpen, batches, selectedBatch, onSuccess }) {
    const [schedule, setSchedule] = useState("");
    const [editing, setEditing] = useState(false);

    // Use useEffect to set the initial schedule value when component mounts or selectedBatch changes
    useEffect(() => {
        if (selectedBatch && batches) {
            const batch = batches.find(batch => batch.batch_name === selectedBatch);
            if (batch && batch.schedule) {
                setSchedule(batch.schedule);
                setEditing(true);
            } else {
                setSchedule("");
                setEditing(false);
            }
        }
    }, [selectedBatch, batches]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const batchToDelete = batches.find(
            (batch) => batch.batch_name === selectedBatch
        );

        // Create the data structure that matches your backend expectations
        const data = {
            schedule: schedule,
        };

        try {
            const response = await fetch(
                `http://localhost:8000/app/views/schedule.php?id=${batchToDelete.batch_name}`,
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
                setSchedule("");
                setIsOpen(false);
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
        setIsOpen(false);
    };

    // Helper function to check if batch has schedule (no state updates)
    const hasSchedule = () => {
        if (!selectedBatch || !batches) return false;
        const batch = batches.find(batch => batch.batch_name === selectedBatch);
        return batch && batch.schedule;
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                className="text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                {hasSchedule() ? "Edit Schedule" : "Set Schedule"}
            </button>

            {isOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-[80%] md:w-[50%] lg:w-[30%] bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-green-500 px-6 py-2 flex justify-between items-center">
                            <h2 className="text-md text-white">
                                Set Schedule
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            {/* Form Inputs */}
                            <div>
                                <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                    Batch
                                    <input
                                        readOnly
                                        type="text"
                                        value={selectedBatch}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none"
                                    />
                                </label>
                                <label className="py-1 flex flex-col gap-[1px] text-gray-600 text-sm">
                                    Date & Time
                                    <input
                                        required
                                        type="datetime-local"
                                        value={schedule}
                                        onChange={(e) => setSchedule(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={`w-full py-2 px-4 rounded-sm shadow-sm focus:outline-none bg-gray-200 text-gray-500`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`w-full py-2 px-4 rounded-sm shadow-sm focus:outline-none bg-green-500 text-white hover:bg-green-600`}
                                >
                                    {editing ? "Update" : "Set"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}